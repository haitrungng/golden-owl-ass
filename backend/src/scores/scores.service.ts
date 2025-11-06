// src/scores/scores.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Score } from 'generated';
import {
  SUBJECTS,
  ScoreBandReport,
  Subject,
  ScoreAggregateRow,
  GetOneSubjectDto,
} from 'src/scores/dtos/get-score-report.dto';
import { BLOCKS, TopRow } from 'src/scores/dtos/get-top.dto';

type TotalRow = { total_with_any: bigint | number };

@Injectable()
export class ScoresService {
  constructor(private prisma: PrismaService) {}

  async findBySbd(sbd: string): Promise<Score> {
    const row = await this.prisma.score.findUnique({
      where: { sbd },
    });
    if (!row) throw new NotFoundException('Không tìm thấy Số Báo Danh');
    return row;
  }

  // get report for a specific subject
  private async reportForSubject(subject: Subject): Promise<ScoreBandReport> {
    const sql = `
      SELECT
        COUNT(*) FILTER (WHERE s."${subject}" IS NOT NULL) AS total_with_score,
        COUNT(*) FILTER (WHERE s."${subject}" >= 8) AS gte8,
        COUNT(*) FILTER (WHERE s."${subject}" >= 6 AND s."${subject}" < 8) AS gte6lt8,
        COUNT(*) FILTER (WHERE s."${subject}" >= 4 AND s."${subject}" < 6) AS gte4lt6,
        COUNT(*) FILTER (WHERE s."${subject}" < 4) AS lt4
      FROM "Score" s;
    `;

    const [row] = await this.prisma.$queryRawUnsafe<ScoreAggregateRow[]>(sql);

    return {
      subject,
      counts: {
        gte8: Number(row.gte8) || 0,
        gte6lt8: Number(row.gte6lt8) || 0,
        gte4lt6: Number(row.gte4lt6) || 0,
        lt4: Number(row.lt4) || 0,
      },
      totalWithScore: Number(row.total_with_score) || 0,
    };
  }

  async getReport(dto: GetOneSubjectDto) {
    if (dto.subject) {
      return await this.reportForSubject(dto.subject);
    }

    // get all-subject report, in case no subject specified
    const reports = await Promise.all(
      (SUBJECTS as unknown as Subject[]).map((s) => this.reportForSubject(s)),
    );
    return { reports };
  }

  async getTopByBlock(block: keyof typeof BLOCKS, limit = 10) {
    const subjects = BLOCKS[block];
    const sql = this.buildTopQuery(subjects, limit);
    const rows = await this.prisma.$queryRawUnsafe<TopRow[]>(sql);

    return {
      block,
      subjects,
      totalCandidates: rows.length,
      top: rows.map((r) => ({
        sbd: r.sbd,
        total: Number(r.total ?? 0),
        scores: Object.fromEntries(subjects.map((s) => [s, Number(r[s] ?? 0)])),
      })),
    };
  }

  async getTopBySubjects(subjectsIn: string[], limit = 10) {
    const subjects = subjectsIn as Subject[];
    const sql = this.buildTopQuery(subjects, limit);
    const rows = await this.prisma.$queryRawUnsafe<TopRow[]>(sql);

    return {
      subjects,
      totalCandidates: rows.length,
      top: rows.map((r) => ({
        sbd: r.sbd,
        total: Number(r.total ?? 0),
        scores: Object.fromEntries(subjects.map((s) => [s, Number(r[s] ?? 0)])),
      })),
    };
  }

  private buildTopQuery(subjects: Subject[], limit: number) {
    const idCols = subjects.map((s) => `s."${s}"`).join(', ');
    const sumExpr = subjects.map((s) => `s."${s}"`).join(' + ');
    const whereAllNotNull = subjects
      .map((s) => `s."${s}" IS NOT NULL`)
      .join(' AND ');
    const tieBreak = subjects.map((s) => `s."${s}" DESC`).join(', ');

    // LIMIT đã sanitize (số nguyên dương), nội suy trực tiếp
    const sql = `
      SELECT
        s.sbd,
        ${idCols},
        (${sumExpr}) AS total
      FROM "Score" s
      WHERE ${whereAllNotNull}
      ORDER BY total DESC, ${tieBreak}, s.sbd ASC
      LIMIT ${Math.max(1, Math.min(limit, 100))};
    `;
    return sql;
  }

  // average score for each subject
  async getAverage() {
    const selectClauses = SUBJECTS.map(
      (s) => `
        ROUND(AVG(s."${s}")::numeric, 2) AS ${s}_avg,
        COUNT(s."${s}") AS ${s}_count
      `,
    ).join(',\n');

    const sqlAll = `
      SELECT
        ${selectClauses}
      FROM "Score" s;
    `;

    const [row] =
      await this.prisma.$queryRawUnsafe<
        Record<string, number | bigint | null>[]
      >(sqlAll);

    const averages = SUBJECTS.map((s) => ({
      subject: s,
      average: Number(row?.[`${s}_avg`] ?? 0),
      totalStudents: Number(row?.[`${s}_count`] ?? 0),
    }));

    return { averages };
  }

  async getTotalCandidatesOnly(): Promise<{ totalWithAnyScore: number }> {
    const anyNotNull = SUBJECTS.map((s) => `s."${s}" IS NOT NULL`).join(' OR ');
    const sql = `
      SELECT COUNT(*) FILTER (WHERE ${anyNotNull}) AS total_with_any
      FROM "Score" s;
    `;
    const [row] = await this.prisma.$queryRawUnsafe<TotalRow[]>(sql);
    return { totalWithAnyScore: Number(row?.total_with_any ?? 0) };
  }
}

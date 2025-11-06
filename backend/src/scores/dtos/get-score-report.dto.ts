import { IsIn, IsOptional, IsString } from 'class-validator';

export const SUBJECTS = [
  'toan',
  'ngu_van',
  'ngoai_ngu',
  'vat_li',
  'hoa_hoc',
  'sinh_hoc',
  'lich_su',
  'dia_li',
  'gdcd',
] as const;

export type ScoreAggregateRow = {
  total_with_score: bigint | number;
  gte8: bigint | number;
  gte6lt8: bigint | number;
  gte4lt6: bigint | number;
  lt4: bigint | number;
};

export type Subject = (typeof SUBJECTS)[number];

export class GetOneSubjectDto {
  @IsOptional()
  @IsString()
  @IsIn(SUBJECTS as unknown as string[], {
    message: `Mon hoc phai thuoc 1 trong: ${SUBJECTS.join(', ')}`,
  })
  subject?: Subject;
}

export type ScoreBandReport = {
  subject: Subject;
  counts: {
    gte8: number;
    gte6lt8: number;
    gte4lt6: number;
    lt4: number;
  };
  totalWithScore: number; // in case some students have null score in this subject
};

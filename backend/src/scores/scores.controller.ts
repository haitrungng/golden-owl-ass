import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { GetOneSubjectDto } from 'src/scores/dtos/get-score-report.dto';
import { GetTopDto } from 'src/scores/dtos/get-top.dto';
import { SbdParamDto } from 'src/scores/dtos/sbd.dto';
import { ScoresService } from 'src/scores/scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get('report')
  getReport(@Query() dto: GetOneSubjectDto) {
    return this.scoresService.getReport(dto);
  }

  @Get('top')
  async getTop(@Query() dto: GetTopDto) {
    const { block, subjects, limit } = dto;

    if (block && subjects) {
      throw new BadRequestException(
        'Chỉ chọn block hoặc subjects, không chọn cả hai',
      );
    }

    if (block) return this.scoresService.getTopByBlock(block, limit);
    if (subjects) return this.scoresService.getTopBySubjects(subjects, limit);

    // mặc định: khối A
    return this.scoresService.getTopByBlock('A', limit);
  }

  @Get('summary')
  async getSummary() {
    const average = await this.scoresService.getAverage();
    const totalCandidates = await this.scoresService.getTotalCandidatesOnly();
    return { average, totalCandidates };
  }

  @Get(':sbd')
  findOne(@Param() params: SbdParamDto) {
    return this.scoresService.findBySbd(params.sbd);
  }
}

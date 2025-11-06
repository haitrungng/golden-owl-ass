import { Subject } from '@/types/search-score';

export type ScoreCounts = {
  gte8: number;
  gte6lt8: number;
  gte4lt6: number;
  lt4: number;
};

export type ScoreDistribution = {
  subject: Subject;
  counts: ScoreCounts;
  totalWithScore: number;
};

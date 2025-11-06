import { Subject } from '@/types/search-score';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  SEARCH_SCORES: (regNum: string) => `${API_URL}/scores/${regNum}`,
  SEARCH_SUMMARY: `${API_URL}/scores/summary`,
  SEARCH_TOP_SCORES: (khoi: 'A' | 'B' | 'C' | 'D') =>
    `${API_URL}/scores/top?block=${khoi}`,
  SEARCH_TOP_SCORES_SUBJECTS: (subjects: Subject[]) =>
    `${API_URL}/scores/top?subjects=${subjects.join(',')}`,
  SEARCH_REPORT: (subject: Subject) =>
    `${API_URL}/scores/report?subject=${subject}`,
};

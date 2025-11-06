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

export type Subject = (typeof SUBJECTS)[number];

export type SearchScoreResponse = { sbd: string; ma_ngoai_ngu: string } & {
  [K in Subject]: number | null;
};

export type SearchScoreErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

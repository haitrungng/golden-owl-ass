import { Subject } from '@/types/search-score';

export interface Candidate {
  sbd: string;
  total: number;
  scores: Record<Subject, number>;
}

export interface TopScores {
  block: string;
  subjects: Subject[];
  totalCandidates: number;
  top: Candidate[];
}

/* Generic/strongly-typed versions */

export type ScoresFor<S extends readonly string[]> = {
  [K in S[number]]: number;
};

export interface CandidateGeneric<S extends readonly string[]> {
  sbd: string;
  total: number;
  scores: ScoresFor<S>;
}

export interface TopScoresGeneric<S extends readonly string[]> {
  block: string;
  subjects: S;
  totalCandidates: number;
  top: CandidateGeneric<S>[];
}

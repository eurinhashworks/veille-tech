export interface Source {
  title: string;
  uri: string;
}

export type CategoryType = 'Web' | 'Cloud' | 'DevOps' | 'Security' | 'IA' | 'Mix';

export interface ReviewMetadata {
  id: string;
  date: string; // YYYY-MM-DD
  formattedDate: string; // "Vendredi 08 Août 2025"
  username: string; // "Pseudo" or "Anonyme"
  timestamp: number; // Date.now()
  generationTime: number; // in seconds
  tags: string[];
  dominantCategory: CategoryType;
  newsCount: number;
  flashSummary: string;
  aiAnalysis: string; // New field for the AI's subjective opinion
  isPublic: boolean;
}

export interface Review {
  metadata: ReviewMetadata;
  content: string; // The full markdown content
  sources: Source[];
}

export interface GenerationRequest {
  date: string;
  username: string;
  isPublic: boolean;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
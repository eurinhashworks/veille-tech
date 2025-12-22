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

export interface User {
  id: string;
  username: string;
  isAdmin?: boolean;
}

export interface GenerationOptions {
  style: 'analytical' | 'creative' | 'technical' | 'executive';
  tone: 'formal' | 'casual' | 'humorous' | 'serious';
  depth: 'brief' | 'detailed' | 'comprehensive';
}

export interface SearchHistoryItem {
  query: string;
  filters: Record<string, unknown>;
  results: number;
  timestamp: number;
}

export interface UserSettings {
  theme?: string;
  defaultVisibility?: string;
  notifications?: boolean;
  autoGenerate?: boolean;
  aiPreferences?: GenerationOptions;
}

export interface UserStats {
  totalReviews: number;
  totalNews: number;
  avgGenerationTime: number;
  categoryDistribution: Record<string, number>;
  topCategory: string;
}
export interface TrendReport {
    technology: string;
    currentMentions: number;
    predictedMentions: number;
    impactScore: number;
    sentiment?: number;
}

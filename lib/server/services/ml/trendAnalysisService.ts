import { TrendPredictionModel, TrendReport } from './models/TrendPredictionModel';
import { Review } from '../../../../types/types';
import { getAllReviews } from '../../services/storageService';

export class TrendAnalysisService {
  private model: TrendPredictionModel;

  constructor() {
    this.model = new TrendPredictionModel();
  }

  // Analyser toutes les technologies
  async analyzeTrends(): Promise<TrendReport[]> {
    // 1. Extraire technologies depuis reviews
    const reviews = await getAllReviews();
    const techMap = this.model.extractTechnologiesFromReviews(reviews);
    const technologies = this.model.convertToTrendData(techMap);

    // 2. Pour chaque techno, analyser tendance
    const reports = technologies.map(tech => {
      const prediction = this.model.predictTrend(tech, 30); // 30 jours
      const impact = this.model.calculateImpactScore(tech);

      return {
        technology: tech.technology,
        currentMentions: tech.timeline[tech.timeline.length - 1].mentions,
        predictedMentions: prediction,
        impactScore: impact,
        trend: (prediction > tech.timeline[tech.timeline.length - 1].mentions ? 'rising' : 'falling') as 'rising' | 'falling'
      };
    });

    // 3. Trier par impact
    return reports.sort((a, b) => b.impactScore - a.impactScore);
  }

  // Analyser les tendances pour une période spécifique
  async analyzeTrendsForPeriod(daysBack: number = 30): Promise<TrendReport[]> {
    // 1. Extraire technologies depuis reviews
    const reviews = await getAllReviews();
    const techMap = this.model.extractTechnologiesFromReviews(reviews);
    const technologies = this.model.convertToTrendData(techMap, daysBack);

    // 2. Pour chaque techno, analyser tendance
    const reports = technologies.map(tech => {
      const prediction = this.model.predictTrend(tech, 7); // Prédire 7 jours
      const impact = this.model.calculateImpactScore(tech);

      return {
        technology: tech.technology,
        currentMentions: tech.timeline[tech.timeline.length - 1].mentions,
        predictedMentions: prediction,
        impactScore: impact,
        trend: (prediction > tech.timeline[tech.timeline.length - 1].mentions ? 'rising' : 'falling') as 'rising' | 'falling'
      };
    });

    // 3. Trier par impact
    return reports.sort((a, b) => b.impactScore - a.impactScore);
  }

  // Obtenir les tendances montantes
  async getRisingTrends(limit: number = 10): Promise<TrendReport[]> {
    const allTrends = await this.analyzeTrends();
    return allTrends
      .filter(trend => trend.trend === 'rising')
      .slice(0, limit);
  }

  // Obtenir les tendances chutantes
  async getFallingTrends(limit: number = 10): Promise<TrendReport[]> {
    const allTrends = await this.analyzeTrends();
    return allTrends
      .filter(trend => trend.trend === 'falling')
      .slice(0, limit);
  }
}
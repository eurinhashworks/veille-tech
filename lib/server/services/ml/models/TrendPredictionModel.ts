import { SimpleLinearRegression } from 'ml-regression';
import { mean } from 'd3-array';
import { Review } from '../../../../../types/types';

export interface TrendData {
  technology: string;
  timeline: {
    date: string;
    mentions: number;
  }[];
}

export interface TrendReport {
  technology: string;
  currentMentions: number;
  predictedMentions: number;
  impactScore: number;
  trend: 'rising' | 'falling';
}

export class TrendPredictionModel {
  // Prédire tendance future
  predictTrend(data: TrendData, daysAhead: number): number {
    if (data.timeline.length < 2) {
      return data.timeline.length > 0 ? data.timeline[data.timeline.length - 1].mentions : 0;
    }
    
    const x = data.timeline.map((_, i) => i);
    const y = data.timeline.map(t => t.mentions);
    
    // Régression linéaire
    try {
      const regression = new SimpleLinearRegression(x, y);
      
      // Prédire
      const futureIndex = x.length + daysAhead;
      return regression.predict(futureIndex);
    } catch (error) {
      console.error('Erreur dans la régression linéaire:', error);
      // Si la régression échoue, retourner la dernière valeur
      return data.timeline[data.timeline.length - 1].mentions;
    }
  }
  
  // Calculer score d'impact
  calculateImpactScore(data: TrendData): number {
    if (data.timeline.length === 0) return 0;
    
    const mentions = data.timeline.map(t => t.mentions);
    
    // Croissance moyenne
    const growth = this.calculateGrowthRate(mentions);
    
    // Volume actuel
    const currentVolume = mentions[mentions.length - 1];
    
    // Score combiné (0-100)
    const score = (growth * 50) + (currentVolume / 10);
    return Math.min(score, 100);
  }
  
  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;
    
    const first = values[0];
    const last = values[values.length - 1];
    
    if (first === 0) {
      // Si la première valeur est 0, la croissance est infinie, on retourne une valeur élevée
      return last > 0 ? Infinity : 0;
    }
    
    return (last - first) / first;
  }
  
  // Extraire les technologies des reviews
  extractTechnologiesFromReviews(reviews: Review[]): Map<string, number[]> {
    const techMap = new Map<string, number[]>();
    
    // Compter mentions par jour
    reviews.forEach(review => {
      review.metadata.tags.forEach(tag => {
        if (!techMap.has(tag)) {
          techMap.set(tag, []);
        }
        // On ajoute 1 mention pour cette technologie dans cette review
        techMap.get(tag)!.push(1);
      });
    });
    
    return techMap;
  }
  
  // Convertir les données brutes en TrendData
  convertToTrendData(techMap: Map<string, number[]>, daysBack: number = 30): TrendData[] {
    return Array.from(techMap.entries()).map(([tech, mentions]) => {
      // Créer une timeline avec des dates récentes
      const timeline = mentions.map((count, i) => ({
        date: new Date(Date.now() - (mentions.length - i) * 86400000).toISOString(),
        mentions: count
      }));
      
      // Remplir les jours manquants avec 0 si nécessaire
      if (timeline.length < daysBack) {
        const missingDays = daysBack - timeline.length;
        for (let i = 0; i < missingDays; i++) {
          timeline.unshift({
            date: new Date(Date.now() - (daysBack - i) * 86400000).toISOString(),
            mentions: 0
          });
        }
      }
      
      return {
        technology: tech,
        timeline: timeline.slice(-daysBack) // Garder seulement les derniers jours
      };
    });
  }
}
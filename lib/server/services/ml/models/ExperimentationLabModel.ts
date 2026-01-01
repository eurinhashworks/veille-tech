import { Review } from '../../../../../types/types';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: 'design' | 'running' | 'completed' | 'archived';
  startDate?: Date;
  endDate?: Date;
  metrics: string[]; // Les métriques à suivre
  parameters: Record<string, any>; // Les paramètres de l'expérience
  results?: ExperimentResult[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperimentResult {
  id: string;
  experimentId: string;
  timestamp: Date;
  metrics: Record<string, number>; // Valeurs des métriques
  sampleSize: number;
  confidence: number; // 0-1
  conclusion: string;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  trafficPercentage: number; // Pour les tests A/B
}

export interface ExperimentConfig {
  modelType: 'recommendation' | 'prediction' | 'classification' | 'clustering' | 'nlp';
  algorithm: string;
  parameters: Record<string, any>;
  evaluationMetrics: string[];
  validationMethod: 'cross-validation' | 'holdout' | 'time-series';
}

export interface ExperimentData {
  experimentId: string;
  input: any;
  expectedOutput?: any;
  actualOutput?: any;
  timestamp: Date;
}

export class ExperimentationLabModel {
  
  // Créer une nouvelle expérience
  createExperiment(
    name: string,
    description: string,
    hypothesis: string,
    config: ExperimentConfig,
    createdBy: string
  ): Experiment {
    return {
      id: this.generateId(),
      name,
      description,
      hypothesis,
      status: 'design',
      metrics: config.evaluationMetrics,
      parameters: config.parameters,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Calculer les résultats d'une expérience
  calculateExperimentResults(
    experimentId: string,
    testData: ExperimentData[],
    config: ExperimentConfig
  ): ExperimentResult {
    // Calculer les métriques basées sur les données de test
    const metrics: Record<string, number> = {};
    
    if (testData.length > 0) {
      // Calculer des métriques de base
      metrics.accuracy = this.calculateAccuracy(testData);
      metrics.precision = this.calculatePrecision(testData);
      metrics.recall = this.calculateRecall(testData);
      metrics.f1Score = this.calculateF1Score(metrics.precision, metrics.recall);
      metrics.meanAbsoluteError = this.calculateMAE(testData);
    }
    
    // Calculer la confiance basée sur la taille de l'échantillon
    const confidence = Math.min(testData.length / 1000, 1); // Max 100% pour 1000+ samples
    
    return {
      id: this.generateId(),
      experimentId,
      timestamp: new Date(),
      metrics,
      sampleSize: testData.length,
      confidence,
      conclusion: this.generateConclusion(metrics, config.evaluationMetrics)
    };
  }
  
  private calculateAccuracy(data: ExperimentData[]): number {
    if (data.length === 0) return 0;
    
    let correct = 0;
    data.forEach(item => {
      if (item.expectedOutput !== undefined && item.actualOutput !== undefined) {
        if (item.expectedOutput === item.actualOutput) {
          correct++;
        }
      }
    });
    
    return correct / data.length;
  }
  
  private calculatePrecision(data: ExperimentData[]): number {
    if (data.length === 0) return 0;
    
    let truePositives = 0;
    let falsePositives = 0;
    
    data.forEach(item => {
      if (item.expectedOutput !== undefined && item.actualOutput !== undefined) {
        if (item.actualOutput === true && item.expectedOutput === true) {
          truePositives++;
        } else if (item.actualOutput === true && item.expectedOutput === false) {
          falsePositives++;
        }
      }
    });
    
    const totalPositives = truePositives + falsePositives;
    return totalPositives > 0 ? truePositives / totalPositives : 0;
  }
  
  private calculateRecall(data: ExperimentData[]): number {
    if (data.length === 0) return 0;
    
    let truePositives = 0;
    let falseNegatives = 0;
    
    data.forEach(item => {
      if (item.expectedOutput !== undefined && item.actualOutput !== undefined) {
        if (item.actualOutput === true && item.expectedOutput === true) {
          truePositives++;
        } else if (item.actualOutput === false && item.expectedOutput === true) {
          falseNegatives++;
        }
      }
    });
    
    const actualPositives = truePositives + falseNegatives;
    return actualPositives > 0 ? truePositives / actualPositives : 0;
  }
  
  private calculateF1Score(precision: number, recall: number): number {
    if (precision + recall === 0) return 0;
    return 2 * (precision * recall) / (precision + recall);
  }
  
  private calculateMAE(data: ExperimentData[]): number {
    if (data.length === 0) return 0;
    
    let totalError = 0;
    let validComparisons = 0;
    
    data.forEach(item => {
      if (typeof item.expectedOutput === 'number' && typeof item.actualOutput === 'number') {
        totalError += Math.abs(item.expectedOutput - item.actualOutput);
        validComparisons++;
      }
    });
    
    return validComparisons > 0 ? totalError / validComparisons : 0;
  }
  
  private generateConclusion(metrics: Record<string, number>, evaluationMetrics: string[] = []): string {
    const metricNames = Object.keys(metrics).filter(m => evaluationMetrics.length === 0 || evaluationMetrics.includes(m));
    if (metricNames.length === 0) {
      return "Aucune conclusion disponible pour cette expérience.";
    }

    const avgMetric = metricNames.reduce((sum, name) => sum + (metrics[name] || 0), 0) / metricNames.length;

    if (avgMetric > 0.8) {
      return "Expérience très réussie. Les résultats dépassent les attentes.";
    } else if (avgMetric > 0.6) {
      return "Expérience réussie. Les résultats sont conformes aux attentes.";
    } else if (avgMetric > 0.4) {
      return "Résultats mitigés. L'expérience nécessite des ajustements.";
    } else {
      return "Expérience infructueuse. Les résultats sont inférieurs aux attentes.";
    }
  }
  
  // Comparer deux variantes d'expérience
  compareVariants(results1: ExperimentResult, results2: ExperimentResult): string {
    let comparison = "Comparaison des résultats:\n";
    
    Object.keys(results1.metrics).forEach(metric => {
      const val1 = results1.metrics[metric];
      const val2 = results2.metrics[metric];
      
      if (val1 !== undefined && val2 !== undefined) {
        const diff = val2 - val1;
        const improvement = (diff / val1) * 100;
        
        comparison += `${metric}: V1=${val1.toFixed(3)}, V2=${val2.toFixed(3)}, Diff=${diff > 0 ? '+' : ''}${diff.toFixed(3)} (${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%)\n`;
      }
    });
    
    return comparison;
  }
  
  // Déterminer si une expérience est statistiquement significative
  isStatisticallySignificant(result: ExperimentResult, threshold: number = 0.05): boolean {
    // Pour cette implémentation simplifiée, nous utilisons une approche basée sur la confiance
    // et la taille de l'échantillon
    return result.confidence > 0.8 && result.sampleSize > 100;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  // Créer une configuration d'expérience pour un modèle de recommandation
  createRecommendationExperimentConfig(): ExperimentConfig {
    return {
      modelType: 'recommendation',
      algorithm: 'collaborative-filtering',
      parameters: {
        numFactors: 50,
        learningRate: 0.01,
        regularization: 0.01,
        iterations: 100
      },
      evaluationMetrics: ['accuracy', 'precision', 'recall', 'f1Score', 'meanAbsoluteError'],
      validationMethod: 'cross-validation'
    };
  }
  
  // Créer une configuration d'expérience pour un modèle de prédiction
  createPredictionExperimentConfig(): ExperimentConfig {
    return {
      modelType: 'prediction',
      algorithm: 'linear-regression',
      parameters: {
        learningRate: 0.01,
        regularization: 0.01,
        iterations: 1000
      },
      evaluationMetrics: ['meanAbsoluteError', 'accuracy', 'precision'],
      validationMethod: 'time-series'
    };
  }
}
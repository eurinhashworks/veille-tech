import { Review } from '../../../types';
import { TrendReport } from '../models/TrendPredictionModel';

export interface DecisionFactor {
  name: string;
  value: number; // 0-1
  weight: number; // 0-1
  source: string; // d'où vient cette information
}

export interface StrategicDecision {
  id: string;
  title: string;
  description: string;
  factors: DecisionFactor[];
  confidence: number; // 0-1
  recommendation: 'adopt' | 'monitor' | 'avoid';
  impact: 'low' | 'medium' | 'high';
  timeline: 'short' | 'medium' | 'long';
  reasoning: string;
}

export interface DecisionContext {
  currentTrends: TrendReport[];
  userPreferences: {
    riskTolerance: 'low' | 'medium' | 'high';
    investmentCapacity: 'limited' | 'moderate' | 'high';
    adoptionStrategy: 'early' | 'moderate' | 'late';
  };
  businessConstraints: {
    budget: number;
    timeline: number; // en mois
    teamSize: number;
    skillLevel: number; // 0-1
  };
}

export class DecisionSupportModel {
  
  // Calculer la recommandation stratégique basée sur les facteurs
  calculateStrategicDecision(
    title: string, 
    description: string, 
    context: DecisionContext
  ): StrategicDecision {
    // Extraire les facteurs clés à partir du contexte
    const factors: DecisionFactor[] = this.extractDecisionFactors(context);
    
    // Calculer le score global de recommandation
    const { recommendation, confidence, impact, timeline } = this.analyzeFactors(factors, context);
    
    // Générer un raisonnement
    const reasoning = this.generateReasoning(factors, context, recommendation);
    
    return {
      id: this.generateId(),
      title,
      description,
      factors,
      confidence,
      recommendation,
      impact,
      timeline,
      reasoning
    };
  }
  
  private extractDecisionFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];
    
    // Facteur basé sur la tendance technologique
    if (context.currentTrends && context.currentTrends.length > 0) {
      const avgGrowth = context.currentTrends.reduce((sum, trend) => sum + trend.impactScore, 0) / context.currentTrends.length;
      factors.push({
        name: 'TechnologyTrendGrowth',
        value: Math.min(avgGrowth / 100, 1), // Normaliser sur 0-1
        weight: 0.3,
        source: 'TrendAnalysis'
      });
    }
    
    // Facteur basé sur la tolérance au risque
    factors.push({
      name: 'RiskTolerance',
      value: context.userPreferences.riskTolerance === 'high' ? 1 : 
             context.userPreferences.riskTolerance === 'medium' ? 0.5 : 0.2,
      weight: 0.25,
      source: 'UserPreferences'
    });
    
    // Facteur basé sur la capacité d'investissement
    factors.push({
      name: 'InvestmentCapacity',
      value: context.userPreferences.investmentCapacity === 'high' ? 1 : 
             context.userPreferences.investmentCapacity === 'moderate' ? 0.6 : 0.3,
      weight: 0.2,
      source: 'UserPreferences'
    });
    
    // Facteur basé sur les contraintes budgétaires
    factors.push({
      name: 'BudgetAvailability',
      value: Math.min(context.businessConstraints.budget / 100000, 1), // Exemple: normaliser par 100k
      weight: 0.15,
      source: 'BusinessConstraints'
    });
    
    // Facteur basé sur le niveau de compétence de l'équipe
    factors.push({
      name: 'TeamSkillLevel',
      value: context.businessConstraints.skillLevel,
      weight: 0.1,
      source: 'BusinessConstraints'
    });
    
    return factors;
  }
  
  private analyzeFactors(factors: DecisionFactor[], context: DecisionContext): {
    recommendation: 'adopt' | 'monitor' | 'avoid';
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    timeline: 'short' | 'medium' | 'long';
  } {
    // Calculer le score pondéré
    let weightedScore = 0;
    let totalWeight = 0;
    
    factors.forEach(factor => {
      weightedScore += factor.value * factor.weight;
      totalWeight += factor.weight;
    });
    
    const normalizedScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    const confidence = Math.min(normalizedScore + 0.2, 1); // Ajouter un minimum de confiance
    
    // Déterminer la recommandation basée sur le score
    let recommendation: 'adopt' | 'monitor' | 'avoid';
    if (normalizedScore > 0.7) {
      recommendation = 'adopt';
    } else if (normalizedScore > 0.4) {
      recommendation = 'monitor';
    } else {
      recommendation = 'avoid';
    }
    
    // Déterminer l'impact basé sur la tendance
    let impact: 'low' | 'medium' | 'high';
    if (normalizedScore > 0.8) {
      impact = 'high';
    } else if (normalizedScore > 0.5) {
      impact = 'medium';
    } else {
      impact = 'low';
    }
    
    // Déterminer la timeline basée sur la stratégie d'adoption
    let timeline: 'short' | 'medium' | 'long';
    switch (context.userPreferences.adoptionStrategy) {
      case 'early':
        timeline = 'short';
        break;
      case 'moderate':
        timeline = 'medium';
        break;
      default:
        timeline = 'long';
    }
    
    return {
      recommendation,
      confidence,
      impact,
      timeline
    };
  }
  
  private generateReasoning(
    factors: DecisionFactor[], 
    context: DecisionContext, 
    recommendation: 'adopt' | 'monitor' | 'avoid'
  ): string {
    const positiveFactors = factors.filter(f => f.value > 0.5);
    const negativeFactors = factors.filter(f => f.value <= 0.5);
    
    let reasoning = `Recommandation "${recommendation.toUpperCase()}" basée sur l'analyse de ${factors.length} facteurs :\n\n`;
    
    if (positiveFactors.length > 0) {
      reasoning += "Facteurs positifs :\n";
      positiveFactors.forEach(factor => {
        reasoning += `- ${factor.name}: ${Math.round(factor.value * 100)}% (${factor.source})\n`;
      });
    }
    
    if (negativeFactors.length > 0) {
      reasoning += "\nFacteurs limitants :\n";
      negativeFactors.forEach(factor => {
        reasoning += `- ${factor.name}: ${Math.round(factor.value * 100)}% (${factor.source})\n`;
      });
    }
    
    reasoning += `\nLa décision est faite avec une confiance de ${Math.round(context.userPreferences.riskTolerance === 'high' ? 90 : 
                    context.userPreferences.riskTolerance === 'medium' ? 75 : 60)}%.`;
    
    return reasoning;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
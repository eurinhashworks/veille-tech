import { DecisionSupportModel, StrategicDecision, DecisionContext } from './models/DecisionSupportModel';
import { TrendAnalysisService } from './trendAnalysisService';
import { Review } from '../../types';

// Simuler les fonctions d'accès à la base de données
async function getUserPreferences(userId: string) {
  // Dans une implémentation réelle, cela récupérerait depuis la base de données
  return {
    riskTolerance: 'medium' as 'low' | 'medium' | 'high',
    investmentCapacity: 'moderate' as 'limited' | 'moderate' | 'high',
    adoptionStrategy: 'moderate' as 'early' | 'moderate' | 'late',
  };
}

async function getBusinessConstraints(userId: string) {
  // Dans une implémentation réelle, cela récupérerait depuis la base de données
  return {
    budget: 50000,
    timeline: 12, // mois
    teamSize: 5,
    skillLevel: 0.7
  };
}

export class DecisionSupportService {
  private model: DecisionSupportModel;
  private trendService: TrendAnalysisService;
  
  constructor() {
    this.model = new DecisionSupportModel();
    this.trendService = new TrendAnalysisService();
  }
  
  // Générer une décision stratégique
  async generateStrategicDecision(
    userId: string,
    title: string,
    description: string
  ): Promise<StrategicDecision> {
    // Récupérer les préférences de l'utilisateur
    const userPreferences = await getUserPreferences(userId);
    
    // Récupérer les contraintes business
    const businessConstraints = await getBusinessConstraints(userId);
    
    // Récupérer les tendances actuelles
    const currentTrends = await this.trendService.analyzeTrends();
    
    // Construire le contexte de décision
    const context: DecisionContext = {
      currentTrends,
      userPreferences,
      businessConstraints
    };
    
    // Générer la décision
    return this.model.calculateStrategicDecision(title, description, context);
  }
  
  // Analyser plusieurs décisions possibles
  async analyzeMultipleDecisions(
    userId: string,
    decisionOptions: Array<{ title: string; description: string }>
  ): Promise<StrategicDecision[]> {
    const decisions: StrategicDecision[] = [];
    
    for (const option of decisionOptions) {
      const decision = await this.generateStrategicDecision(userId, option.title, option.description);
      decisions.push(decision);
    }
    
    return decisions;
  }
  
  // Obtenir les décisions les plus pertinentes pour un utilisateur
  async getRelevantDecisions(userId: string): Promise<StrategicDecision[]> {
    // Récupérer les dernières tendances pertinentes
    const risingTrends = await this.trendService.getRisingTrends(10);
    
    // Générer des décisions pour chaque tendance montante
    const decisionOptions = risingTrends.map(trend => ({
      title: `Adopter ${trend.technology}`,
      description: `Considérer l'adoption de ${trend.technology} dans le contexte de votre organisation`
    }));
    
    return this.analyzeMultipleDecisions(userId, decisionOptions);
  }
  
  // Obtenir les décisions à risque élevé
  async getHighRiskDecisions(userId: string): Promise<StrategicDecision[]> {
    const allDecisions = await this.getRelevantDecisions(userId);
    return allDecisions.filter(decision => 
      decision.impact === 'high' && 
      decision.confidence < 0.7
    );
  }
  
  // Obtenir les décisions à fort potentiel
  async getHighPotentialDecisions(userId: string): Promise<StrategicDecision[]> {
    const allDecisions = await this.getRelevantDecisions(userId);
    return allDecisions.filter(decision => 
      decision.recommendation === 'adopt' && 
      decision.impact === 'high' && 
      decision.confidence > 0.8
    );
  }
  
  // Expliquer une décision
  async explainDecision(decision: StrategicDecision): Promise<string> {
    return decision.reasoning;
  }
}
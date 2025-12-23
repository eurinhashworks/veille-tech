import { Review } from '../../../types';
import { UserProfile } from '../models/UserProfileModel';

export interface AdaptationRule {
  id: string;
  condition: string; // description de la condition
  action: string; // description de l'action
  priority: number; // 1-10
  active: boolean;
}

export interface LearningPattern {
  userId: string;
  behaviorType: 'reading' | 'skimming' | 'bookmarking' | 'sharing' | 'searching';
  contentCategory: string;
  timeSpent: number; // en secondes
  engagementScore: number; // 0-1
  timestamp: number;
}

export interface AdaptationProfile {
  userId: string;
  adaptationRules: AdaptationRule[];
  learningPatterns: LearningPattern[];
  preferences: {
    contentDepth: 'shallow' | 'medium' | 'deep';
    updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    notificationLevel: 'minimal' | 'moderate' | 'high';
    contentFormat: 'text' | 'summary' | 'visual' | 'multi';
  };
  adaptationHistory: {
    date: string;
    changes: string[];
    effectiveness: number; // 0-1
  }[];
}

export class AdaptiveIntelligenceModel {
  
  // Adapter les préférences de veille basées sur l'historique
  adaptUserPreferences(
    userCurrentProfile: UserProfile,
    learningPatterns: LearningPattern[],
    adaptationRules: AdaptationRule[]
  ): AdaptationProfile {
    // Analyser les patterns d'apprentissage
    const contentPreferences = this.analyzeContentPreferences(learningPatterns);
    const behaviorPatterns = this.analyzeBehaviorPatterns(learningPatterns);
    
    // Déterminer les préférences adaptées
    const adaptedPreferences = this.determineAdaptedPreferences(
      contentPreferences,
      behaviorPatterns,
      userCurrentProfile
    );
    
    // Appliquer les règles d'adaptation
    const activeRules = adaptationRules.filter(rule => rule.active);
    const appliedChanges = this.applyAdaptationRules(activeRules, adaptedPreferences);
    
    // Créer le profil d'adaptation
    return {
      userId: userCurrentProfile.userId,
      adaptationRules,
      learningPatterns,
      preferences: adaptedPreferences,
      adaptationHistory: [{
        date: new Date().toISOString(),
        changes: appliedChanges,
        effectiveness: this.calculateEffectiveness(learningPatterns)
      }]
    };
  }
  
  private analyzeContentPreferences(learningPatterns: LearningPattern[]): Record<string, number> {
    const categoryScores: Record<string, number> = {};
    
    learningPatterns.forEach(pattern => {
      if (!categoryScores[pattern.contentCategory]) {
        categoryScores[pattern.contentCategory] = 0;
      }
      
      // Pondérer par le temps passé et le score d'engagement
      categoryScores[pattern.contentCategory] += pattern.timeSpent * pattern.engagementScore;
    });
    
    // Normaliser les scores
    const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
    if (totalScore > 0) {
      Object.keys(categoryScores).forEach(category => {
        categoryScores[category] = categoryScores[category] / totalScore;
      });
    }
    
    return categoryScores;
  }
  
  private analyzeBehaviorPatterns(learningPatterns: LearningPattern[]): {
    readingDepth: number; // 0-1
    updateFrequency: number; // 0-1
    notificationSensitivity: number; // 0-1
  } {
    let totalTimeSpent = 0;
    let totalEngagement = 0;
    let totalPatterns = 0;
    
    learningPatterns.forEach(pattern => {
      totalTimeSpent += pattern.timeSpent;
      totalEngagement += pattern.engagementScore;
      totalPatterns++;
    });
    
    const avgTimeSpent = totalPatterns > 0 ? totalTimeSpent / totalPatterns : 0;
    const avgEngagement = totalPatterns > 0 ? totalEngagement / totalPatterns : 0;
    
    // Déterminer la profondeur de lecture (0-1)
    const readingDepth = Math.min(avgTimeSpent / 300, 1); // 300 secondes = 5 minutes max
    
    // Déterminer la fréquence de mise à jour (0-1)
    const updateFrequency = Math.min(learningPatterns.length / 50, 1); // 50 interactions max
    
    // Déterminer la sensibilité aux notifications (0-1)
    const notificationSensitivity = avgEngagement;
    
    return {
      readingDepth,
      updateFrequency,
      notificationSensitivity
    };
  }
  
  private determineAdaptedPreferences(
    contentPreferences: Record<string, number>,
    behaviorPatterns: any,
    userProfile: UserProfile
  ): AdaptationProfile['preferences'] {
    // Déterminer la profondeur de contenu
    let contentDepth: 'shallow' | 'medium' | 'deep' = 'medium';
    if (behaviorPatterns.readingDepth < 0.3) {
      contentDepth = 'shallow';
    } else if (behaviorPatterns.readingDepth > 0.7) {
      contentDepth = 'deep';
    }
    
    // Déterminer la fréquence de mise à jour
    let updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' = 'daily';
    if (behaviorPatterns.updateFrequency < 0.2) {
      updateFrequency = 'weekly';
    } else if (behaviorPatterns.updateFrequency < 0.5) {
      updateFrequency = 'daily';
    } else if (behaviorPatterns.updateFrequency < 0.8) {
      updateFrequency = 'hourly';
    } else {
      updateFrequency = 'realtime';
    }
    
    // Déterminer le niveau de notification
    let notificationLevel: 'minimal' | 'moderate' | 'high' = 'moderate';
    if (behaviorPatterns.notificationSensitivity < 0.3) {
      notificationLevel = 'minimal';
    } else if (behaviorPatterns.notificationSensitivity > 0.7) {
      notificationLevel = 'high';
    }
    
    // Déterminer le format de contenu
    let contentFormat: 'text' | 'summary' | 'visual' | 'multi' = 'text';
    if (contentDepth === 'shallow') {
      contentFormat = 'summary';
    } else if (Object.keys(contentPreferences).length > 3) {
      contentFormat = 'multi';
    }
    
    return {
      contentDepth,
      updateFrequency,
      notificationLevel,
      contentFormat
    };
  }
  
  private applyAdaptationRules(
    activeRules: AdaptationRule[],
    currentPreferences: AdaptationProfile['preferences']
  ): string[] {
    const changes: string[] = [];
    
    activeRules.forEach(rule => {
      // Ici, nous pourrions implémenter une logique complexe pour appliquer les règles
      // Pour l'instant, nous retournons simplement une liste de changements potentiels
      changes.push(`Règle appliquée: ${rule.condition} -> ${rule.action}`);
    });
    
    return changes;
  }
  
  private calculateEffectiveness(learningPatterns: LearningPattern[]): number {
    if (learningPatterns.length === 0) {
      return 0.5; // Valeur par défaut
    }
    
    // Calculer l'efficacité moyenne basée sur l'engagement
    const totalEngagement = learningPatterns.reduce((sum, pattern) => sum + pattern.engagementScore, 0);
    return totalEngagement / learningPatterns.length;
  }
  
  // Détecter les changements dans les préférences de l'utilisateur
  detectPreferenceChanges(
    oldProfile: AdaptationProfile,
    newProfile: AdaptationProfile
  ): string[] {
    const changes: string[] = [];
    
    if (oldProfile.preferences.contentDepth !== newProfile.preferences.contentDepth) {
      changes.push(`Profondeur de contenu: ${oldProfile.preferences.contentDepth} -> ${newProfile.preferences.contentDepth}`);
    }
    
    if (oldProfile.preferences.updateFrequency !== newProfile.preferences.updateFrequency) {
      changes.push(`Fréquence de mise à jour: ${oldProfile.preferences.updateFrequency} -> ${newProfile.preferences.updateFrequency}`);
    }
    
    if (oldProfile.preferences.notificationLevel !== newProfile.preferences.notificationLevel) {
      changes.push(`Niveau de notification: ${oldProfile.preferences.notificationLevel} -> ${newProfile.preferences.notificationLevel}`);
    }
    
    if (oldProfile.preferences.contentFormat !== newProfile.preferences.contentFormat) {
      changes.push(`Format de contenu: ${oldProfile.preferences.contentFormat} -> ${newProfile.preferences.contentFormat}`);
    }
    
    return changes;
  }
  
  // Générer des règles d'adaptation personnalisées
  generateAdaptationRules(userProfile: UserProfile, learningPatterns: LearningPattern[]): AdaptationRule[] {
    const rules: AdaptationRule[] = [];
    
    // Règle basée sur la catégorie préférée
    const topCategory = this.getTopCategory(learningPatterns);
    if (topCategory) {
      rules.push({
        id: this.generateId(),
        condition: `L'utilisateur préfère la catégorie "${topCategory}"`,
        action: `Augmenter la fréquence des contenus "${topCategory}"`,
        priority: 8,
        active: true
      });
    }
    
    // Règle basée sur le comportement de lecture
    const avgTimeSpent = this.getAverageTimeSpent(learningPatterns);
    if (avgTimeSpent < 60) { // Moins de 1 minute
      rules.push({
        id: this.generateId(),
        condition: 'L\'utilisateur passe peu de temps sur les contenus',
        action: 'Fournir des résumés plus courts et plus concis',
        priority: 9,
        active: true
      });
    } else if (avgTimeSpent > 300) { // Plus de 5 minutes
      rules.push({
        id: this.generateId(),
        condition: 'L\'utilisateur passe beaucoup de temps sur les contenus',
        action: 'Fournir des contenus plus détaillés et approfondis',
        priority: 9,
        active: true
      });
    }
    
    return rules;
  }
  
  private getTopCategory(learningPatterns: LearningPattern[]): string | null {
    const categoryCounts: Record<string, number> = {};
    
    learningPatterns.forEach(pattern => {
      if (!categoryCounts[pattern.contentCategory]) {
        categoryCounts[pattern.contentCategory] = 0;
      }
      categoryCounts[pattern.contentCategory]++;
    });
    
    let topCategory: string | null = null;
    let maxCount = 0;
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = category;
      }
    });
    
    return topCategory;
  }
  
  private getAverageTimeSpent(learningPatterns: LearningPattern[]): number {
    if (learningPatterns.length === 0) return 0;
    
    const totalTime = learningPatterns.reduce((sum, pattern) => sum + pattern.timeSpent, 0);
    return totalTime / learningPatterns.length;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
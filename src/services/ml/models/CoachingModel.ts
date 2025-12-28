import { Review } from '../../../types';
import { UserProfile } from '../models/UserProfileModel';

export interface CoachingGoal {
  id: string;
  title: string;
  description: string;
  category: 'knowledge' | 'skills' | 'habits' | 'tools' | 'network';
  targetDate: Date;
  progress: number; // 0-1
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  userId: string;
}

export interface CoachingTip {
  id: string;
  title: string;
  content: string;
  category: 'knowledge' | 'skills' | 'habits' | 'tools' | 'network';
  priority: 'low' | 'medium' | 'high';
  relevanceScore: number; // 0-1
  actionItems?: string[];
}

export interface CoachingSession {
  id: string;
  userId: string;
  date: Date;
  duration: number; // en minutes
  type: 'check-in' | 'goal-review' | 'skill-assessment' | 'feedback-session';
  notes: string;
  recommendations: CoachingTip[];
}

export interface SkillAssessment {
  skill: string;
  currentLevel: number; // 1-5
  targetLevel: number; // 1-5
  improvementArea: string;
  resources: string[];
  timeline: number; // en jours
}

export interface VeilleHabit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  timeSpent: number; // en minutes
  consistency: number; // 0-1
  userId: string;
}

export class CoachingModel {
  
  // Générer des conseils personnalisés basés sur le profil utilisateur
  generatePersonalizedTips(userProfile: UserProfile, recentReviews: Review[]): CoachingTip[] {
    const tips: CoachingTip[] = [];
    
    // Conseils basés sur les intérêts de l'utilisateur
    const interestBasedTips = this.generateInterestBasedTips(userProfile.interests);
    tips.push(...interestBasedTips);
    
    // Conseils basés sur les technologies du moment
    const trendingTechTips = this.generateTrendingTechTips(recentReviews);
    tips.push(...trendingTechTips);
    
    // Conseils basés sur les lacunes dans le profil
    const gapBasedTips = this.generateGapBasedTips(userProfile);
    tips.push(...gapBasedTips);
    
    // Trier par pertinence
    return tips.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  private generateInterestBasedTips(interests: string[]): CoachingTip[] {
    const tips: CoachingTip[] = [];
    
    interests.forEach(interest => {
      // Générer des conseils basés sur l'intérêt spécifique
      switch (interest.toLowerCase()) {
        case 'react':
          tips.push({
            id: this.generateId(),
            title: 'Approfondir React',
            content: 'Considérez d\'explorer React Server Components et les nouvelles fonctionnalités de React 19',
            category: 'skills',
            priority: 'high',
            relevanceScore: 0.9,
            actionItems: [
              'Lire la documentation officielle',
              'Suivre un cours avancé',
              'Mettre en pratique dans un projet personnel'
            ]
          });
          break;
        case 'typescript':
          tips.push({
            id: this.generateId(),
            title: 'Maîtriser TypeScript',
            content: 'Explorez les types avancés et les generics pour améliorer votre code',
            category: 'skills',
            priority: 'medium',
            relevanceScore: 0.8,
            actionItems: [
              'Pratiquer avec des challenges TypeScript',
              'Lire les generics avancés',
              'Utiliser dans un projet réel'
            ]
          });
          break;
        case 'ia':
        case 'ai':
          tips.push({
            id: this.generateId(),
            title: 'Explorer l\'IA générative',
            content: 'Familiarisez-vous avec les modèles récents et leurs applications pratiques',
            category: 'knowledge',
            priority: 'high',
            relevanceScore: 0.85,
            actionItems: [
              'Tester différents modèles',
              'Comprendre les limites et biais',
              'Explorer les cas d\'usage dans votre domaine'
            ]
          });
          break;
        default:
          tips.push({
            id: this.generateId(),
            title: `Approfondir ${interest}`,
            content: `Découvrez les dernières tendances et bonnes pratiques pour ${interest}`,
            category: 'knowledge',
            priority: 'medium',
            relevanceScore: 0.7,
            actionItems: [
              'Lire les articles récents',
              'Suivre les experts du domaine',
              'Participer à des discussions techniques'
            ]
          });
      }
    });
    
    return tips;
  }
  
  private generateTrendingTechTips(reviews: Review[]): CoachingTip[] {
    const tips: CoachingTip[] = [];
    
    // Extraire les technologies mentionnées dans les récents articles
    const mentionedTechs = new Set<string>();
    reviews.forEach(review => {
      review.metadata.tags.forEach(tag => {
        mentionedTechs.add(tag.toLowerCase());
      });
    });
    
    // Générer des conseils pour les technologies tendance
    mentionedTechs.forEach(tech => {
      tips.push({
        id: this.generateId(),
        title: `Tendance: ${tech}`,
        content: `La technologie ${tech} est en train de devenir populaire. Considérez de vous y intéresser.`,
        category: 'knowledge',
        priority: 'medium',
        relevanceScore: 0.6,
        actionItems: [
          'Lire les articles récents sur cette technologie',
          'Comparer avec les solutions existantes',
          'Évaluer le potentiel d\'adoption'
        ]
      });
    });
    
    return tips;
  }
  
  private generateGapBasedTips(userProfile: UserProfile): CoachingTip[] {
    const tips: CoachingTip[] = [];
    
    // Identifier les domaines où l'utilisateur pourrait s'améliorer
    if (userProfile.techStack.length < 3) {
      tips.push({
        id: this.generateId(),
        title: 'Élargir votre stack technique',
        content: 'Considérez d\'apprendre des technologies complémentaires pour devenir plus polyvalent',
        category: 'skills',
        priority: 'high',
        relevanceScore: 0.8,
        actionItems: [
          'Identifier les technologies complémentaires',
          'Créer un plan d\'apprentissage',
          'Mettre en pratique régulièrement'
        ]
      });
    }
    
    // Conseils sur les habitudes de veille
    tips.push({
      id: this.generateId(),
      title: 'Optimiser vos habitudes de veille',
      content: 'Établissez un rythme régulier pour votre veille technologique',
      category: 'habits',
      priority: 'medium',
      relevanceScore: 0.7,
      actionItems: [
        'Fixez un créneau horaire spécifique',
        'Utilisez des outils d\'automatisation',
        'Dédicacez 15-30 min par jour'
      ]
    });
    
    return tips;
  }
  
  // Évaluer les compétences de l'utilisateur
  assessSkills(userProfile: UserProfile, recentReviews: Review[]): SkillAssessment[] {
    const assessments: SkillAssessment[] = [];
    
    // Évaluer les compétences basées sur les intérêts et les interactions
    userProfile.interests.forEach(interest => {
      const currentLevel = this.estimateSkillLevel(interest, userProfile, recentReviews);
      
      assessments.push({
        skill: interest,
        currentLevel,
        targetLevel: Math.min(currentLevel + 1, 5), // Prochaine étape
        improvementArea: this.getIdentifyImprovementArea(interest, currentLevel),
        resources: this.getSuggestedResources(interest),
        timeline: 30 // 30 jours pour atteindre le niveau cible
      });
    });
    
    return assessments;
  }
  
  private estimateSkillLevel(skill: string, userProfile: UserProfile, recentReviews: Review[]): number {
    // Estimation basée sur l'interaction avec les contenus liés à cette compétence
    const relevantReviews = recentReviews.filter(review => 
      review.metadata.tags.some(tag => 
        tag.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    // Plus d'interactions ou de lectures = niveau plus élevé
    if (relevantReviews.length > 10) return 5;
    if (relevantReviews.length > 7) return 4;
    if (relevantReviews.length > 4) return 3;
    if (relevantReviews.length > 1) return 2;
    
    return 1; // Nouveau dans le domaine
  }
  
  private getIdentifyImprovementArea(skill: string, currentLevel: number): string {
    switch (currentLevel) {
      case 1:
        return `Apprentissage des bases de ${skill}`;
      case 2:
        return `Approfondissement des concepts fondamentaux de ${skill}`;
      case 3:
        return `Application pratique de ${skill} dans des projets réels`;
      case 4:
        return `Maîtrise avancée et bonnes pratiques de ${skill}`;
      default:
        return `Expertise et contribution à la communauté ${skill}`;
    }
  }
  
  private getSuggestedResources(skill: string): string[] {
    return [
      `https://developer.mozilla.org/en-US/docs/Web/${skill}`,
      `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}`,
      `https://github.com/topics/${skill.toLowerCase()}`
    ];
  }
  
  // Générer des objectifs de coaching
  generateCoachingGoals(userProfile: UserProfile): CoachingGoal[] {
    const goals: CoachingGoal[] = [];
    
    // Objectif d'apprentissage basé sur les intérêts
    if (userProfile.interests.length > 0) {
      const primaryInterest = userProfile.interests[0];
      goals.push({
        id: this.generateId(),
        title: `Devenir expert en ${primaryInterest}`,
        description: `Approfondir vos connaissances et compétences en ${primaryInterest}`,
        category: 'skills',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
        progress: 0,
        status: 'not-started',
        userId: userProfile.userId
      });
    }
    
    // Objectif d'habitude de veille
    goals.push({
      id: this.generateId(),
      title: 'Établir une routine de veille quotidienne',
      description: 'Consacrer 30 minutes chaque jour à la veille technologique',
      category: 'habits',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      progress: 0,
      status: 'not-started',
      userId: userProfile.userId
    });
    
    // Objectif de réseau
    goals.push({
      id: this.generateId(),
      title: 'Élargir votre réseau professionnel',
      description: 'Se connecter avec 5 nouveaux professionnels du domaine chaque mois',
      category: 'network',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 jours
      progress: 0,
      status: 'not-started',
      userId: userProfile.userId
    });
    
    return goals;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
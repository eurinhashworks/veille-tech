import * as tf from '@tensorflow/tfjs';
import natural from 'natural';
import { Review, CategoryType } from '../../../types';

export interface UserProfile {
  userId: string;
  techStack: string[];        // ["React", "TypeScript", "AWS"]
  interests: string[];        // ["Cloud", "IA", "DevOps"]
  interactionHistory: {
    reviewId: string;
    timeSpent: number;        // secondes
    clicked: boolean;
    favorited: boolean;
  }[];
  skillLevel: number;         // 0-1
}

export class UserProfileModel {
  private tfidf: any;

  constructor() {
    this.tfidf = new natural.TfIdf();
  }
  
  // Extraire intérêts depuis historique
  extractInterests(reviews: Review[]): string[] {
    reviews.forEach(review => {
      if (review.content) {
        this.tfidf.addDocument(review.content);
      }
    });

    // Top 10 termes les plus importants
    const terms: { term: string; tfidf: number }[] = [];
    // Utilisation d'un type plus spécifique pour éviter 'any'
    const termList = this.tfidf.listTerms(0);
    for (let i = 0; i < termList.length; i++) {
      const termInfo = termList[i];
      if (termInfo && termInfo.term && termInfo.tfidf !== undefined) {
        terms.push({ term: termInfo.term, tfidf: termInfo.tfidf });
      }
    }

    return terms
      .sort((a, b) => b.tfidf - a.tfidf)
      .slice(0, 10)
      .map(t => t.term);
  }
  
  // Calculer score de pertinence
  calculateRelevance(review: Review, profile: UserProfile): number {
    let score = 0;
    
    // Matching catégorie
    if (profile.interests.includes(review.metadata.dominantCategory)) {
      score += 0.4;
    }
    
    // Matching tags
    const commonTags = review.metadata.tags.filter(tag => 
      profile.techStack.includes(tag) || profile.interests.includes(tag)
    );
    score += commonTags.length * 0.1;
    
    // Normaliser 0-1
    return Math.min(score, 1);
  }
}
import { PersonalizationService } from './personalizationService';
import { Review, CategoryType } from '../../types';

// Données de test
const mockReviews: Review[] = [
  {
    metadata: {
      id: '1',
      date: '2025-01-15',
      formattedDate: 'mercredi 15 janvier 2025',
      username: 'testUser',
      timestamp: Date.now(),
      generationTime: 10.5,
      tags: ['React', 'TypeScript', 'Web'],
      dominantCategory: 'Web',
      newsCount: 5,
      flashSummary: 'Résumé rapide',
      aiAnalysis: 'Analyse IA',
      isPublic: true
    },
    content: 'Ceci est un article sur React et TypeScript avec des nouveautés intéressantes.',
    sources: [
      { title: 'Article React', uri: 'https://example.com/react' }
    ]
  },
  {
    metadata: {
      id: '2',
      date: '2025-01-15',
      formattedDate: 'mercredi 15 janvier 2025',
      username: 'testUser',
      timestamp: Date.now(),
      generationTime: 12.3,
      tags: ['AWS', 'Cloud', 'DevOps'],
      dominantCategory: 'Cloud',
      newsCount: 7,
      flashSummary: 'Résumé AWS',
      aiAnalysis: 'Analyse IA',
      isPublic: true
    },
    content: 'Cet article parle des dernières nouveautés d\'AWS et de ses services cloud.',
    sources: [
      { title: 'Article AWS', uri: 'https://example.com/aws' }
    ]
  }
];

async function testPersonalization() {
  console.log('Test de la fonctionnalité de personnalisation...');
  
  const personalizationService = new PersonalizationService();
  
  try {
    // Test de recommandation
    const recommendations = await personalizationService.recommendReviews('test-user-123', mockReviews);
    
    console.log(`Nombre de recommandations: ${recommendations.length}`);
    console.log('Recommandations:');
    recommendations.forEach((review, index) => {
      console.log(`${index + 1}. ${review.metadata.flashSummary} - Catégorie: ${review.metadata.dominantCategory}`);
      console.log(`   Tags: ${review.metadata.tags.join(', ')}`);
      console.log(`   Score de pertinence: ${personalizationService['profileModel'].calculateRelevance(review, {
        userId: 'test-user-123',
        techStack: ['React', 'TypeScript'],
        interests: ['Web', 'Frontend'],
        interactionHistory: [],
        skillLevel: 0.7
      })}`);
    });
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testPersonalization().then(() => {
  console.log('Test terminé avec succès!');
});
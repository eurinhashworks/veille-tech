import { TrendAnalysisService } from './trendAnalysisService';
import { Review } from '../../types';

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
  },
  {
    metadata: {
      id: '3',
      date: '2025-01-14',
      formattedDate: 'mardi 14 janvier 2025',
      username: 'testUser',
      timestamp: Date.now() - 86400000,
      generationTime: 8.7,
      tags: ['React', 'JavaScript'],
      dominantCategory: 'Web',
      newsCount: 4,
      flashSummary: 'Mise à jour React',
      aiAnalysis: 'Analyse IA',
      isPublic: true
    },
    content: 'Nouvelle mise à jour de React avec des fonctionnalités intéressantes.',
    sources: [
      { title: 'Mise à jour React', uri: 'https://example.com/react-update' }
    ]
  }
];

async function testTrendAnalysis() {
  console.log('Test de la fonctionnalité d\'analyse de tendance...');
  
  try {
    const trendAnalysisService = new TrendAnalysisService();
    
    // Utiliser les données de test directement
    const techMap = trendAnalysisService['model'].extractTechnologiesFromReviews(mockReviews);
    const technologies = trendAnalysisService['model'].convertToTrendData(techMap);
    
    console.log(`Technologies identifiées: ${Array.from(techMap.keys()).join(', ')}`);
    
    // Analyser les tendances pour les données de test
    const reports = technologies.map(tech => {
      const prediction = trendAnalysisService['model'].predictTrend(tech, 7); // Prédire 7 jours
      const impact = trendAnalysisService['model'].calculateImpactScore(tech);
      
      return {
        technology: tech.technology,
        currentMentions: tech.timeline[tech.timeline.length - 1].mentions,
        predictedMentions: prediction,
        impactScore: impact,
        trend: prediction > tech.timeline[tech.timeline.length - 1].mentions ? 'rising' : 'falling'
      };
    });
    
    // Trier par impact
    const trends = reports.sort((a, b) => b.impactScore - a.impactScore);
    
    console.log(`Nombre de tendances identifiées: ${trends.length}`);
    console.log('Tendances:');
    trends.forEach((trend, index) => {
      console.log(`${index + 1}. ${trend.technology} - Impact: ${trend.impactScore.toFixed(2)}`);
      console.log(`   Actuel: ${trend.currentMentions}, Prédit: ${trend.predictedMentions.toFixed(2)}`);
      console.log(`   Tendance: ${trend.trend}`);
    });
    
    // Pour les tendances montantes, utilisons les données calculées
    console.log('\nTendances montantes:');
    const risingTrends = trends.filter(t => t.trend === 'rising').slice(0, 5);
    risingTrends.forEach((trend, index) => {
      console.log(`${index + 1}. ${trend.technology} - Impact: ${trend.impactScore.toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testTrendAnalysis().then(() => {
  console.log('Test d\'analyse de tendance terminé avec succès!');
});
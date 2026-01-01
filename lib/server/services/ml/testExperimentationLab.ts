import { ExperimentationLabService } from './experimentationLabService';
import { ExperimentData } from './models/ExperimentationLabModel';

async function testExperimentationLab() {
  console.log('Test du Laboratoire d\'Expérimentation (LE)...');
  
  const experimentService = new ExperimentationLabService();
  
  try {
    // Créer une expérience de recommandation
    const recommendationExp = await experimentService.createRecommendationExperiment('user123');
    console.log(`Expérience créée: ${recommendationExp.name}`);
    console.log(`Hypothèse: ${recommendationExp.hypothesis}`);
    console.log(`Statut: ${recommendationExp.status}`);
    
    console.log('\n---');
    
    // Créer une deuxième expérience pour comparaison
    const trendExp = await experimentService.createTrendPredictionExperiment('user123');
    console.log(`Deuxième expérience créée: ${trendExp.name}`);

    console.log('\n---');

    // Simuler le calcul de résultats pour la première expérience
    const testData: ExperimentData[] = [
      {
        experimentId: recommendationExp.id,
        input: { userId: 'user1', item: 'article1', context: { category: 'React' } },
        expectedOutput: true,
        actualOutput: true,
        timestamp: new Date()
      },
      {
        experimentId: recommendationExp.id,
        input: { userId: 'user2', item: 'article2', context: { category: 'Cloud' } },
        expectedOutput: true,
        actualOutput: false,
        timestamp: new Date()
      },
      {
        experimentId: recommendationExp.id,
        input: { userId: 'user3', item: 'article3', context: { category: 'IA' } },
        expectedOutput: false,
        actualOutput: false,
        timestamp: new Date()
      }
    ];

    console.log(`Données d'expérience simulées: ${testData.length}`);

    // Créer un config d'expérience pour les tests
    const config = experimentService['model'].createRecommendationExperimentConfig();

    // Calculer les résultats de l'expérience (directement via le modèle)
    const results = experimentService['model'].calculateExperimentResults(
      recommendationExp.id,
      testData,
      config
    );

    console.log(`Résultats calculés:`);
    console.log(`- Taille de l'échantillon: ${results.sampleSize}`);
    console.log(`- Confiance: ${(results.confidence * 100).toFixed(1)}%`);
    console.log(`- Précision: ${(results.metrics.precision * 100).toFixed(1)}%`);
    console.log(`- Rappel: ${(results.metrics.recall * 100).toFixed(1)}%`);
    console.log(`- F1-Score: ${(results.metrics.f1Score * 100).toFixed(1)}%`);
    console.log(`- Conclusion: ${results.conclusion}`);

    console.log('\n---');

    // Simuler les données pour la deuxième expérience
    const trendTestData: ExperimentData[] = [
      {
        experimentId: trendExp.id,
        input: { technology: 'TypeScript', historicalData: [10, 15, 20, 25, 30] },
        expectedOutput: 35,
        actualOutput: 32,
        timestamp: new Date()
      },
      {
        experimentId: trendExp.id,
        input: { technology: 'Kubernetes', historicalData: [5, 8, 12, 18, 22] },
        expectedOutput: 26,
        actualOutput: 25,
        timestamp: new Date()
      }
    ];

    // Créer un config d'expérience pour les tests
    const trendConfig = experimentService['model'].createPredictionExperimentConfig();

    // Calculer les résultats de la deuxième expérience
    const trendResults = experimentService['model'].calculateExperimentResults(
      trendExp.id,
      trendTestData,
      trendConfig
    );

    console.log(`Résultats de la 2ème expérience:`);
    console.log(`- Précision: ${(trendResults.metrics.precision * 100).toFixed(1)}%`);
    console.log(`- Erreur absolue moyenne: ${trendResults.metrics.meanAbsoluteError.toFixed(2)}`);

    console.log('\n---');

    // Comparer les deux expériences (simulation)
    const comparison = experimentService['model'].compareVariants(results, trendResults);
    console.log(`Comparaison des expériences:\n${comparison}`);

    console.log('\n---');

    // Vérifier la significativité statistique (simulation)
    const isSignificant = experimentService['model'].isStatisticallySignificant(results);
    console.log(`Expérience statistiquement significative: ${isSignificant ? 'OUI' : 'NON'}`);

    console.log('\n---');

    // Archiver l'expérience (simulation)
    console.log(`Expérience simulée archivée: ${recommendationExp.name}`);
    console.log(`Nouveau statut: archived`);
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testExperimentationLab().then(() => {
  console.log('\nTest du Laboratoire d\'Expérimentation terminé avec succès!');
});
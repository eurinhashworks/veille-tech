import { DecisionSupportService } from './decisionSupportService';

async function testDecisionSupport() {
  console.log('Test de l\'Assistant de Prise de Décision Stratégique (APDS)...');
  
  const decisionService = new DecisionSupportService();
  
  try {
    // Tester une décision simple
    const decision = await decisionService.generateStrategicDecision(
      'user123',
      'Adopter React 19',
      'Considérer la mise à jour vers React 19 pour bénéficier des dernières fonctionnalités'
    );
    
    console.log(`Décision: ${decision.title}`);
    console.log(`Recommandation: ${decision.recommendation.toUpperCase()}`);
    console.log(`Confiance: ${(decision.confidence * 100).toFixed(1)}%`);
    console.log(`Impact: ${decision.impact.toUpperCase()}`);
    console.log(`Timeline: ${decision.timeline.toUpperCase()}`);
    console.log(`Raisonnement:\n${decision.reasoning}`);
    
    console.log('\n---');
    
    // Tester plusieurs décisions
    const decisionOptions = [
      { title: 'Adopter TypeScript', description: 'Migrer vers TypeScript pour améliorer la qualité du code' },
      { title: 'Utiliser Kubernetes', description: 'Mettre en place Kubernetes pour l\'orchestration de conteneurs' },
      { title: 'Passer à Serverless', description: 'Évaluer une migration vers une architecture serverless' }
    ];
    
    const multipleDecisions = await decisionService.analyzeMultipleDecisions('user123', decisionOptions);
    
    console.log(`Analyse de ${multipleDecisions.length} décisions:`);
    multipleDecisions.forEach((dec, index) => {
      console.log(`${index + 1}. ${dec.title}: ${dec.recommendation.toUpperCase()} (${(dec.confidence * 100).toFixed(1)}%)`);
    });
    
    console.log('\n---');
    
    // Obtenir les décisions pertinentes
    const relevantDecisions = await decisionService.getRelevantDecisions('user123');
    console.log(`Décisions pertinentes pour l'utilisateur: ${relevantDecisions.length}`);
    
    if (relevantDecisions.length > 0) {
      const topDecision = relevantDecisions[0];
      console.log(`Meilleure opportunité: ${topDecision.title} - ${topDecision.recommendation.toUpperCase()}`);
    }
    
    console.log('\n---');
    
    // Obtenir les décisions à fort potentiel
    const highPotential = await decisionService.getHighPotentialDecisions('user123');
    console.log(`Décisions à fort potentiel: ${highPotential.length}`);
    highPotential.forEach(dec => {
      console.log(`- ${dec.title} (${(dec.confidence * 100).toFixed(1)}% confiance)`);
    });
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testDecisionSupport().then(() => {
  console.log('\nTest de l\'Assistant de Prise de Décision Stratégique terminé avec succès!');
});
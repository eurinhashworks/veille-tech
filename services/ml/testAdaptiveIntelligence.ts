import { AdaptiveIntelligenceService } from './adaptiveIntelligenceService';
import { LearningPattern } from './models/AdaptiveIntelligenceModel';

async function testAdaptiveIntelligence() {
  console.log('Test de l\'Intelligence de Veille Adaptative (IVA)...');
  
  const adaptiveService = new AdaptiveIntelligenceService();
  
  try {
    // Créer des patterns d'apprentissage de test
    const testPatterns: LearningPattern[] = [
      {
        userId: 'user123',
        behaviorType: 'reading',
        contentCategory: 'React',
        timeSpent: 120, // 2 minutes
        engagementScore: 0.8,
        timestamp: Date.now() - 86400000 // hier
      },
      {
        userId: 'user123',
        behaviorType: 'reading',
        contentCategory: 'TypeScript',
        timeSpent: 180, // 3 minutes
        engagementScore: 0.9,
        timestamp: Date.now() - 43200000 // il y a 12h
      },
      {
        userId: 'user123',
        behaviorType: 'skimming',
        contentCategory: 'Cloud',
        timeSpent: 45, // 45 secondes
        engagementScore: 0.3,
        timestamp: Date.now() - 3600000 // il y a 1h
      }
    ];
    
    // Mettre à jour les patterns d'apprentissage
    await adaptiveService.updateLearningPatterns('user123', testPatterns);
    
    // Obtenir le profil d'adaptation
    const profile = await adaptiveService.adaptUserWatch('user123');
    
    console.log(`Profil d'adaptation pour l'utilisateur: ${profile.userId}`);
    console.log(`Préférences adaptées:`);
    console.log(`- Profondeur de contenu: ${profile.preferences.contentDepth}`);
    console.log(`- Fréquence de mise à jour: ${profile.preferences.updateFrequency}`);
    console.log(`- Niveau de notification: ${profile.preferences.notificationLevel}`);
    console.log(`- Format de contenu: ${profile.preferences.contentFormat}`);
    
    console.log(`\nRègles d'adaptation actives: ${profile.adaptationRules.filter(r => r.active).length}`);
    
    if (profile.adaptationHistory.length > 0) {
      const lastAdaptation = profile.adaptationHistory[profile.adaptationHistory.length - 1];
      console.log(`\nDernière adaptation:`);
      console.log(`- Date: ${lastAdaptation.date}`);
      console.log(`- Changements: ${lastAdaptation.changes.length}`);
      console.log(`- Efficacité: ${(lastAdaptation.effectiveness * 100).toFixed(1)}%`);
    }
    
    console.log('\n---');
    
    // Obtenir les suggestions d'amélioration
    const suggestions = await adaptiveService.getImprovementSuggestions('user123');
    console.log(`Suggestions d'amélioration:`);
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`);
    });
    
    console.log('\n---');
    
    // Obtenir les règles d'adaptation actives
    const activeRules = await adaptiveService.getActiveAdaptationRules('user123');
    console.log(`Règles d'adaptation actives (${activeRules.length}):`);
    activeRules.forEach((rule, index) => {
      console.log(`${index + 1}. ${rule.condition} -> ${rule.action} (Priorité: ${rule.priority})`);
    });
    
    console.log('\n---');
    
    // Simuler la détection de changements
    const changes = await adaptiveService.detectPreferenceChanges('user123');
    console.log(`Changements détectés: ${changes.length}`);
    changes.forEach(change => console.log(`- ${change}`));
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testAdaptiveIntelligence().then(() => {
  console.log('\nTest de l\'Intelligence de Veille Adaptative terminé avec succès!');
});
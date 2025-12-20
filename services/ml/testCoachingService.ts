import { CoachingService } from './coachingService';

async function testCoachingService() {
  console.log('Test du Coach de Veille (CV)...');
  
  const coachingService = new CoachingService();
  
  try {
    // Obtenir les conseils personnalisés
    const tips = await coachingService.getPersonalizedTips('user123');
    console.log(`Conseils personnalisés: ${tips.length}`);
    
    if (tips.length > 0) {
      console.log(`Premier conseil: ${tips[0].title}`);
      console.log(`Pertinence: ${(tips[0].relevanceScore * 100).toFixed(1)}%`);
      console.log(`Priorité: ${tips[0].priority.toUpperCase()}`);
      console.log(`Catégorie: ${tips[0].category.toUpperCase()}`);
      
      if (tips[0].actionItems && tips[0].actionItems.length > 0) {
        console.log(`Première action: ${tips[0].actionItems[0]}`);
      }
    }
    
    console.log('\n---');
    
    // Obtenir une session de coaching
    const session = await coachingService.getCoachingSession('user123');
    console.log(`Session de coaching: ${session.type.toUpperCase()}`);
    console.log(`Date: ${session.date.toISOString()}`);
    console.log(`Durée: ${session.duration} minutes`);
    console.log(`Recommandations: ${session.recommendations.length}`);
    
    console.log('\n---');
    
    // Évaluer les compétences
    const skills = await coachingService.assessUserSkills('user123');
    console.log(`Évaluation des compétences: ${skills.length}`);
    
    if (skills.length > 0) {
      const firstSkill = skills[0];
      console.log(`Compétence: ${firstSkill.skill}`);
      console.log(`Niveau actuel: ${firstSkill.currentLevel}/5`);
      console.log(`Niveau cible: ${firstSkill.targetLevel}/5`);
      console.log(`Domaine d'amélioration: ${firstSkill.improvementArea}`);
      console.log(`Ressources suggérées: ${firstSkill.resources.length}`);
    }
    
    console.log('\n---');
    
    // Générer des objectifs de coaching
    const goals = await coachingService.generateCoachingGoals('user123');
    console.log(`Objectifs de coaching générés: ${goals.length}`);
    
    goals.forEach((goal, index) => {
      console.log(`${index + 1}. ${goal.title} (${goal.category.toUpperCase()})`);
    });
    
    console.log('\n---');
    
    // Obtenir les objectifs actifs
    const activeGoals = await coachingService.getActiveCoachingGoals('user123');
    console.log(`Objectifs actifs: ${activeGoals.length}`);
    
    console.log('\n---');
    
    // Obtenir le plan de développement personnalisé
    const developmentPlan = await coachingService.getPersonalizedDevelopmentPlan('user123');
    console.log(`Plan de développement:`);
    console.log(`- Objectifs: ${developmentPlan.goals.length}`);
    console.log(`- Conseils: ${developmentPlan.tips.length}`);
    console.log(`- Compétences: ${developmentPlan.skills.length}`);
    console.log(`- Timeline: ${developmentPlan.timeline}`);
    
    console.log('\n---');
    
    // Obtenir les conseils prioritaires
    const priorityTips = await coachingService.getPriorityTips('user123', 3);
    console.log(`Conseils prioritaires: ${priorityTips.length}`);
    
    priorityTips.forEach((tip, index) => {
      console.log(`${index + 1}. ${tip.title} (${(tip.relevanceScore * 100).toFixed(1)}%)`);
    });
    
    console.log('\n---');
    
    // Planifier une session de coaching
    const scheduledSession = await coachingService.scheduleCoachingSession('user123', 'skill-assessment');
    console.log(`Session planifiée: ${scheduledSession.type.toUpperCase()}`);
    console.log(`Durée: ${scheduledSession.duration} minutes`);
    
    console.log('\n---');
    
    // Obtenir les statistiques de coaching
    const stats = await coachingService.getUserCoachingStats('user123');
    console.log(`Statistiques de coaching:`);
    console.log(`- Sessions totales: ${stats.totalSessions}`);
    console.log(`- Objectifs actifs: ${stats.activeGoals}`);
    console.log(`- Objectifs complétés: ${stats.completedGoals}`);
    console.log(`- Score de pertinence moyen: ${(stats.avgRelevanceScore * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testCoachingService().then(() => {
  console.log('\nTest du Coach de Veille terminé avec succès!');
});
import { WorkflowIntegrationService } from './workflowIntegrationService';
import { Review } from '../../../../types/types';

// Données de test
const mockReview: Review = {
  metadata: {
    id: 'review123',
    date: '2025-01-15',
    formattedDate: 'mercredi 15 janvier 2025',
    username: 'testUser',
    userId: 'user123',
    timestamp: Date.now(),
    generationTime: 10.5,
    tags: ['React', 'TypeScript', 'Web'],
    dominantCategory: 'Web',
    newsCount: 5,
    flashSummary: 'Nouvelles fonctionnalités React 19',
    aiAnalysis: 'Analyse IA',
    isPublic: true
  },
  content: '# Nouvelles fonctionnalités React 19\n\nReact 19 introduit plusieurs nouvelles fonctionnalités...',
  sources: [
    { title: 'Article React', uri: 'https://example.com/react' }
  ]
};

async function testWorkflowIntegration() {
  console.log('Test du Connecteur de Flux de Travail (CFT)...');
  
  const workflowService = new WorkflowIntegrationService();
  
  try {
    // Connecter des applications
    const jiraConnector = await workflowService.connectApp('user123', {
      name: 'Projet Jira',
      type: 'jira',
      config: {
        apiUrl: 'https://monentreprise.atlassian.net',
        token: 'mon-token',
        projectId: 'PROJ'
      },
      enabled: true
    });
    
    const slackConnector = await workflowService.connectApp('user123', {
      name: 'Canal Slack Tech',
      type: 'slack',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/...'
      },
      enabled: true
    });
    
    console.log(`Connecteurs créés: ${jiraConnector.name}, ${slackConnector.name}`);
    
    console.log('\n---');
    
    // Obtenir les connecteurs actifs
    const activeConnectors = await workflowService.getActiveConnectors('user123');
    console.log(`Connecteurs actifs: ${activeConnectors.length}`);
    activeConnectors.forEach(conn => {
      console.log(`- ${conn.name} (${conn.type})`);
    });
    
    console.log('\n---');
    
    // Envoyer la revue à tous les connecteurs
    const sendResults = await workflowService.sendReviewToAllConnectors('user123', mockReview);
    console.log('Résultats de l\'envoi à tous les connecteurs:');
    Object.entries(sendResults).forEach(([appName, success]) => {
      console.log(`- ${appName}: ${success ? 'SUCCÈS' : 'ÉCHEC'}`);
    });
    
    console.log('\n---');
    
    // Créer une règle d'automatisation
    const automationRule = await workflowService.createAutomationRule('user123', {
      name: 'Envoyer nouvelles revues à Slack',
      description: 'Automatiquement envoyer les nouvelles revues au canal Slack',
      connectorId: slackConnector.id,
      trigger: 'new_review',
      payload: {
        title: 'Nouvelle veille disponible',
        content: 'Une nouvelle revue de veille est disponible',
        tags: ['veille', 'tech'],
        priority: 'medium'
      },
      enabled: true
    });
    
    console.log(`Règle d'automatisation créée: ${automationRule.name}`);
    
    console.log('\n---');
    
    // Déclencher l'automatisation pour la revue
    const triggeredActions = await workflowService.triggerAutomationForReview('user123', mockReview);
    console.log(`Actions déclenchées: ${triggeredActions.length}`);
    triggeredActions.forEach(action => {
      console.log(`- ${action.name}`);
    });
    
    console.log('\n---');
    
    // Synchroniser tous les connecteurs
    const syncResults = await workflowService.syncAllConnectors('user123');
    console.log('Résultats de la synchronisation:');
    Object.entries(syncResults).forEach(([appName, success]) => {
      console.log(`- ${appName}: ${success ? 'SYNCHRONISÉ' : 'ÉCHEC'}`);
    });
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testWorkflowIntegration().then(() => {
  console.log('\nTest du Connecteur de Flux de Travail terminé avec succès!');
});
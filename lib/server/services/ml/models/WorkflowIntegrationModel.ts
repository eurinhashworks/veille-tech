import { Review } from '../../../../../types/types';

export interface WorkflowConnector {
  id: string;
  name: string;
  type: 'jira' | 'slack' | 'email' | 'notion' | 'github' | 'trello' | 'custom';
  config: Record<string, any>;
  enabled: boolean;
  lastSync?: Date;
}

export interface IntegrationPayload {
  title: string;
  content: string;
  sourceUrl?: string;
  tags: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  assignee?: string;
}

export interface WorkflowAction {
  id: string;
  name: string;
  description: string;
  connectorId: string;
  trigger: 'new_review' | 'trend_identified' | 'decision_made' | 'custom';
  payload: IntegrationPayload;
  enabled: boolean;
}

export interface WorkflowContext {
  userId: string;
  currentReview?: Review;
  currentTrend?: any;
  currentDecision?: any;
  userPreferences: {
    connectedApps: WorkflowConnector[];
    automationRules: WorkflowAction[];
  };
}

export class WorkflowIntegrationModel {
  
  // Générer un payload pour une intégration spécifique
  generateIntegrationPayload(
    review: Review,
    integrationType: WorkflowConnector['type'],
    context?: Record<string, any>
  ): IntegrationPayload {
    let title = `Nouvelle veille: ${review.metadata.date}`;
    let content = review.content.substring(0, 500) + '...'; // Limiter la longueur
    const tags = [...review.metadata.tags];
    
    switch (integrationType) {
      case 'jira':
        title = `Ticket: ${review.metadata.flashSummary}`;
        content = `**Résumé :** ${review.metadata.flashSummary}\n\n**Détails :** ${review.content}\n\n**Sources :**\n${review.sources.map(s => `- [${s.title}](${s.uri})`).join('\n')}`;
        break;
        
      case 'slack':
        title = review.metadata.flashSummary;
        content = `<!channel> Nouvelle veille tech :\n>${review.metadata.flashSummary}\n\n${review.content.substring(0, 200)}...`;
        break;
        
      case 'email':
        title = `Revue Tech du ${review.metadata.formattedDate}`;
        content = `<h2>${review.metadata.flashSummary}</h2><p>${review.content}</p><p><strong>Sources:</strong><ul>${review.sources.map(s => `<li><a href="${s.uri}">${s.title}</a></li>`).join('')}</ul></p>`;
        break;
        
      case 'notion':
        title = `📝 Veille du ${review.metadata.formattedDate}`;
        content = `# ${review.metadata.flashSummary}\n\n${review.content}\n\n## Sources\n${review.sources.map(s => `- [${s.title}](${s.uri})`).join('\n')}`;
        break;
        
      case 'github':
        title = `Research: ${review.metadata.flashSummary}`;
        content = `## ${review.metadata.flashSummary}\n\n${review.content}\n\n### Sources\n${review.sources.map(s => `- [${s.title}](${s.uri})`).join('\n')}\n\n/label research`;
        tags.push('research', 'veille');
        break;
        
      default:
        // Format par défaut
        content = `**${review.metadata.flashSummary}**\n\n${review.content}\n\nSources: ${review.sources.map(s => s.title).join(', ')}`;
    }
    
    return {
      title,
      content,
      sourceUrl: context?.sourceUrl || review.sources[0]?.uri,
      tags,
      priority: this.determinePriority(review),
      dueDate: context?.dueDate,
      assignee: context?.assignee
    };
  }
  
  private determinePriority(review: Review): 'low' | 'medium' | 'high' | 'critical' {
    // Déterminer la priorité basée sur divers facteurs
    const impactKeywords = ['security', 'vulnerability', 'breach', 'critical', 'urgent'];
    const highImpact = impactKeywords.some(keyword => 
      review.content.toLowerCase().includes(keyword) || 
      review.metadata.flashSummary.toLowerCase().includes(keyword)
    );
    
    if (highImpact) return 'critical';
    if (review.metadata.tags.includes('Security')) return 'high';
    if (review.metadata.tags.includes('Cloud') || review.metadata.tags.includes('IA')) return 'medium';
    
    return 'low';
  }
  
  // Formater le contenu pour un format spécifique
  formatContentForIntegration(content: string, format: 'markdown' | 'html' | 'plain' | 'rich'): string {
    switch (format) {
      case 'html':
        // Convertir markdown en HTML basique
        return content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>$2')
          .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>$2')
          .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>$2')
          .replace(/\n/g, '<br>');
          
      case 'plain':
        // Supprimer le formatage markdown
        return content
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/[#*`_]/g, '');
          
      case 'rich':
        // Format enrichi avec des éléments spécifiques à certains outils
        return content
          .replace(/\*\*(.*?)\*\*/g, '*$1*') // Gras en italique pour Slack
          .replace(/### (.*?)(\n|$)/g, '*$1*$2'); // Titres en italique pour Slack
          
      default:
        // Format markdown (par défaut)
        return content;
    }
  }
  
  // Créer une action de flux de travail basée sur un déclencheur
  createActionFromTrigger(
    trigger: 'new_review' | 'trend_identified' | 'decision_made' | 'custom',
    context: WorkflowContext
  ): WorkflowAction | null {
    if (!context.currentReview) {
      return null; // Impossible de créer une action sans contenu
    }
    
    // Trouver les connecteurs appropriés pour ce type de déclencheur
    const relevantConnectors = context.userPreferences.connectedApps.filter(conn => conn.enabled);
    
    if (relevantConnectors.length === 0) {
      return null;
    }
    
    // Créer une action pour le premier connecteur disponible
    const connector = relevantConnectors[0];
    const payload = this.generateIntegrationPayload(context.currentReview, connector.type);
    
    return {
      id: this.generateId(),
      name: `Action: ${trigger} -> ${connector.name}`,
      description: `Action automatique pour ${trigger} vers ${connector.name}`,
      connectorId: connector.id,
      trigger,
      payload,
      enabled: true
    };
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  // Valider la configuration d'un connecteur
  validateConnectorConfig(connector: WorkflowConnector): boolean {
    // Vérifier que les champs requis sont présents
    switch (connector.type) {
      case 'jira':
        return !!(connector.config.apiUrl && connector.config.token && connector.config.projectId);
      case 'slack':
        return !!(connector.config.webhookUrl || connector.config.token);
      case 'email':
        return !!(connector.config.smtpHost && connector.config.senderEmail);
      case 'notion':
        return !!(connector.config.token && connector.config.databaseId);
      case 'github':
        return !!(connector.config.token && connector.config.repo);
      default:
        return Object.keys(connector.config).length > 0;
    }
  }
}
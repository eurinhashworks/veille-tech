import Graph from 'graphology';
import graphMetrics from 'graphology-metrics';
import { connectedComponents } from 'graphology-components';

export interface UserNode {
  id: string;
  username: string;
  techStack: string[];
  interests: string[];
  skillLevel: number;
  lastActive: Date;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  type: 'similarity' | 'interaction' | 'follow';
}

export class UserNetwork {
  private graph: Graph;
  
  constructor() {
    this.graph = new Graph({ type: 'undirected' });
  }
  
  // Ajouter utilisateur
  addUser(user: UserNode) {
    this.graph.addNode(user.id, {
      ...user,
      lastActive: user.lastActive.toISOString()
    });
  }
  
  // Créer lien (intérêts communs)
  connectUsers(user1Id: string, user2Id: string, similarity: number, type: 'similarity' | 'interaction' | 'follow' = 'similarity') {
    if (user1Id === user2Id) {
      return; // Ne pas créer de boucle
    }
    
    if (!this.graph.hasEdge(user1Id, user2Id)) {
      this.graph.addEdge(user1Id, user2Id, { 
        weight: similarity, 
        type 
      });
    } else {
      // Mettre à jour le poids si l'arête existe déjà
      const currentWeight = this.graph.getEdgeAttribute(user1Id, user2Id, 'weight') || 0;
      const newWeight = (currentWeight + similarity) / 2; // Moyenne des poids
      this.graph.setEdgeAttribute(user1Id, user2Id, 'weight', newWeight);
    }
  }
  
  // Trouver utilisateurs similaires
  findSimilarUsers(userId: string, limit: number = 5): string[] {
    if (!this.graph.hasNode(userId)) {
      return [];
    }
    
    const neighbors = this.graph.neighbors(userId);
    
    // Trier par poids de l'arête
    const sorted = neighbors.sort((a, b) => {
      const weightA = this.graph.getEdgeAttribute(userId, a, 'weight') || 0;
      const weightB = this.graph.getEdgeAttribute(userId, b, 'weight') || 0;
      return weightB - weightA;
    });
    
    return sorted.slice(0, limit);
  }
  
  // Détecter les communautés
  detectCommunities(): Map<string, string[]> {
    // Pour l'instant, on utilise une méthode simple basée sur les composantes connexes
    // Dans une implémentation plus avancée, on pourrait utiliser l'algorithme de Louvain
    const components = connectedComponents(this.graph);
    
    // Créer une map pour regrouper les utilisateurs par communauté
    const communityMap = new Map<string, string[]>();
    
    components.forEach((component, index) => {
      communityMap.set(`community_${index}`, component);
    });
    
    return communityMap;
  }
  
  // Calculer l'influence d'un utilisateur
  calculateInfluence(userId: string): number {
    if (!this.graph.hasNode(userId)) {
      return 0;
    }

    try {
      // Calculer la centralité de betweenness (mesure de l'influence)
      const centrality = graphMetrics.centrality.betweenness(this.graph);
      return centrality[userId] || 0;
    } catch (error) {
      // Si la centralité échoue (graphes très simples), utiliser le degré
      return this.graph.degree(userId);
    }
  }
  
  // Calculer la similarité entre deux utilisateurs
  calculateUserSimilarity(user1Id: string, user2Id: string): number {
    if (!this.graph.hasNode(user1Id) || !this.graph.hasNode(user2Id)) {
      return 0;
    }
    
    const user1 = this.graph.getNodeAttributes(user1Id);
    const user2 = this.graph.getNodeAttributes(user2Id);

    // Calculer la similarité basée sur les technologies et les intérêts
    const techStack1 = user1.techStack || [];
    const techStack2 = user2.techStack || [];
    const interests1 = user1.interests || [];
    const interests2 = user2.interests || [];
    
    // Calculer la similarité de Jaccard pour les stacks technologiques
    const techIntersection = techStack1.filter((tech: string) => techStack2.includes(tech)).length;
    const techUnion = new Set([...techStack1, ...techStack2]).size;
    const techSimilarity = techUnion > 0 ? techIntersection / techUnion : 0;

    // Calculer la similarité de Jaccard pour les intérêts
    const interestIntersection = interests1.filter((interest: string) => interests2.includes(interest)).length;
    const interestUnion = new Set([...interests1, ...interests2]).size;
    const interestSimilarity = interestUnion > 0 ? interestIntersection / interestUnion : 0;
    
    // Pondérer les similarités
    return (techSimilarity * 0.6) + (interestSimilarity * 0.4);
  }
  
  // Obtenir le nombre d'amis pour un utilisateur
  getUserFriendCount(userId: string): number {
    if (!this.graph.hasNode(userId)) {
      return 0;
    }
    return this.graph.degree(userId);
  }
  
  // Obtenir les relations d'un utilisateur
  getUserConnections(userId: string): NetworkEdge[] {
    if (!this.graph.hasNode(userId)) {
      return [];
    }
    
    const edges: NetworkEdge[] = [];
    const neighbors = this.graph.neighbors(userId);
    
    neighbors.forEach(neighborId => {
      const edge = this.graph.edge(userId, neighborId);
      if (edge) {
        const attrs = this.graph.getEdgeAttributes(edge);
        edges.push({
          source: userId,
          target: neighborId,
          weight: attrs.weight || 0,
          type: attrs.type || 'similarity'
        });
      }
    });
    
    return edges;
  }
  
  // Obtenir le sous-graphe pour un utilisateur
  getUserSubgraph(userId: string, radius: number = 2): Graph {
    // Crée un sous-graphe centré sur l'utilisateur avec un certain rayon
    const subgraph = new Graph();
    
    // Ajouter le nœud central
    if (this.graph.hasNode(userId)) {
      const nodeAttrs = this.graph.getNodeAttributes(userId);
      subgraph.addNode(userId, nodeAttrs);
    }
    
    // Ajouter les voisins directs
    const neighbors = this.graph.neighbors(userId);
    neighbors.forEach(neighborId => {
      if (this.graph.hasNode(neighborId)) {
        const nodeAttrs = this.graph.getNodeAttributes(neighborId);
        subgraph.addNode(neighborId, nodeAttrs);
        
        // Ajouter l'arête entre le nœud central et le voisin
        const edgeAttrs = this.graph.getEdgeAttributes(userId, neighborId);
        subgraph.addEdge(userId, neighborId, edgeAttrs);
      }
    });
    
    return subgraph;
  }
}
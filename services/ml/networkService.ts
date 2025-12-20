import { UserNetwork, UserNode } from './graph/UserNetwork';

// Simuler les fonctions d'accès à la base de données
async function getAllUsers(): Promise<UserNode[]> {
  console.log('Récupération de tous les utilisateurs');
  return [];
}

export class NetworkService {
  private network: UserNetwork;

  constructor() {
    this.network = new UserNetwork();
  }

  // Initialiser le réseau avec les utilisateurs existants
  async initializeNetwork() {
    const users = await getAllUsers();
    users.forEach(user => {
      this.network.addUser({
        id: user.id,
        username: user.username,
        techStack: user.techStack || [],
        interests: user.interests || [],
        skillLevel: user.skillLevel || 0.5,
        lastActive: user.lastActive || new Date()
      });
    });
  }
  
  // Connecter des utilisateurs basé sur la similarité
  async connectSimilarUsers() {
    const users = await getAllUsers();
    
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const similarity = this.network.calculateUserSimilarity(users[i].id, users[j].id);
        
        if (similarity > 0.3) { // Seuil de similarité
          this.network.connectUsers(users[i].id, users[j].id, similarity, 'similarity');
        }
      }
    }
  }
  
  // Trouver des utilisateurs similaires pour un utilisateur
  async findSimilarUsers(userId: string, limit: number = 5) {
    return this.network.findSimilarUsers(userId, limit);
  }
  
  // Calculer l'influence d'un utilisateur
  async getUserInfluence(userId: string) {
    return this.network.calculateInfluence(userId);
  }
  
  // Obtenir les connexions d'un utilisateur
  async getUserConnections(userId: string) {
    return this.network.getUserConnections(userId);
  }
  
  // Obtenir les communautés du réseau
  async getCommunities() {
    return this.network.detectCommunities();
  }
  
  // Suivre un utilisateur
  async followUser(followerId: string, followeeId: string) {
    const similarity = this.network.calculateUserSimilarity(followerId, followeeId);
    this.network.connectUsers(followerId, followeeId, similarity, 'follow');
  }
  
  // Obtenir les suggestions d'utilisateurs à suivre
  async getSuggestedUsers(userId: string, limit: number = 10) {
    // Trouver les utilisateurs similaires
    const similarUsers = this.network.findSimilarUsers(userId, limit * 2);
    
    // Filtrer ceux que l'utilisateur ne suit pas déjà
    const connections = this.network.getUserConnections(userId);
    const connectedUserIds = connections.map(conn => conn.target);
    
    return similarUsers
      .filter(user => !connectedUserIds.includes(user))
      .slice(0, limit);
  }
  
  // Obtenir le top des influenceurs
  async getTopInfluencers(limit: number = 10) {
    const users = await getAllUsers();
    
    const userInfluences = users.map(user => ({
      userId: user.id,
      username: user.username,
      influence: this.network.calculateInfluence(user.id)
    }));
    
    return userInfluences
      .sort((a, b) => b.influence - a.influence)
      .slice(0, limit);
  }
  
  // Calculer la similarité entre deux utilisateurs
  async getUserSimilarity(user1Id: string, user2Id: string) {
    return this.network.calculateUserSimilarity(user1Id, user2Id);
  }
  
  // Ajouter un utilisateur au réseau
  addUserToNetwork(user: UserNode) {
    this.network.addUser(user);
  }
}
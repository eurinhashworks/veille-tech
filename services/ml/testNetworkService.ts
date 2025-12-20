import { NetworkService } from './networkService';
import { UserNetwork } from './graph/UserNetwork';

// Données de test
const mockUsers = [
  {
    id: 'user1',
    username: 'alice',
    techStack: ['React', 'TypeScript', 'Node.js'],
    interests: ['Web', 'Frontend', 'UI/UX'],
    skillLevel: 0.8,
    lastActive: new Date()
  },
  {
    id: 'user2',
    username: 'bob',
    techStack: ['React', 'JavaScript', 'CSS'],
    interests: ['Web', 'Frontend', 'Performance'],
    skillLevel: 0.7,
    lastActive: new Date()
  },
  {
    id: 'user3',
    username: 'charlie',
    techStack: ['Python', 'TensorFlow', 'Data Science'],
    interests: ['AI', 'ML', 'Data'],
    skillLevel: 0.9,
    lastActive: new Date()
  },
  {
    id: 'user4',
    username: 'diana',
    techStack: ['React', 'TypeScript', 'GraphQL'],
    interests: ['Web', 'Backend', 'API'],
    skillLevel: 0.75,
    lastActive: new Date()
  }
];

async function testNetworkService() {
  console.log('Test de la fonctionnalité de réseau social...');
  
  const networkService = new NetworkService();
  
  try {
    // Ajouter les utilisateurs au réseau
    mockUsers.forEach(user => {
      networkService.addUserToNetwork(user);
    });
    
    // Connecter les utilisateurs similaires
    // Connecter Alice et Bob (similaires en React/JavaScript)
    const similarityAB = networkService['network'].calculateUserSimilarity('user1', 'user2');
    console.log(`Similarité entre Alice et Bob: ${similarityAB.toFixed(2)}`);
    networkService['network'].connectUsers('user1', 'user2', similarityAB, 'similarity');
    
    // Connecter Alice et Diana (similaires en React/TypeScript)
    const similarityAD = networkService['network'].calculateUserSimilarity('user1', 'user4');
    console.log(`Similarité entre Alice et Diana: ${similarityAD.toFixed(2)}`);
    networkService['network'].connectUsers('user1', 'user4', similarityAD, 'similarity');
    
    // Trouver les utilisateurs similaires à Alice
    const similarUsers = networkService['network'].findSimilarUsers('user1', 5);
    console.log(`Utilisateurs similaires à Alice: ${similarUsers.join(', ')}`);
    
    // Calculer l'influence de chaque utilisateur
    console.log('\nInfluence des utilisateurs:');
    mockUsers.forEach(user => {
      const influence = networkService['network'].calculateInfluence(user.id);
      console.log(`${user.username}: ${influence.toFixed(2)}`);
    });
    
    // Obtenir les connexions de Alice
    const connections = networkService['network'].getUserConnections('user1');
    console.log(`\nConnexions de Alice:`);
    connections.forEach(conn => {
      console.log(`- Connecté à ${conn.target} avec un poids de ${conn.weight.toFixed(2)}`);
    });
    
    // Suggestions d'utilisateurs à suivre pour Alice
    const suggestions = await networkService.getSuggestedUsers('user1', 5);
    console.log(`\nSuggestions pour Alice: ${suggestions.join(', ')}`);
    
    // Top des influenceurs
    const influencers = await networkService.getTopInfluencers(5);
    console.log(`\nTop influenceurs:`);
    influencers.forEach((inf, index) => {
      console.log(`${index + 1}. ${inf.username}: ${inf.influence.toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

// Exécuter le test
testNetworkService().then(() => {
  console.log('Test de réseau social terminé avec succès!');
});
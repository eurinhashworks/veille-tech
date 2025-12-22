# Configuration de la Base de Données - TechPulse AI

## ✅ Installation Complétée

La base de données PostgreSQL avec Prisma a été configurée avec succès!

## 📦 Ce qui a été installé

- **Prisma** (v7.0.0) - ORM moderne pour TypeScript
- **@prisma/client** - Client Prisma généré
- **dotenv** - Gestion des variables d'environnement

## 🗄️ Structure de la Base de Données

### 7 Tables Créées

1. **users** - Gestion des utilisateurs
2. **reviews** - Stockage des revues tech
3. **tags** - Tags associés aux revues
4. **sources** - Sources des actualités
5. **favorites** - Revues favorites des utilisateurs
6. **search_history** - Historique des recherches
7. **user_settings** - Paramètres personnalisés

## 🚀 Démarrage Rapide

### 1. Vérifier la Configuration

La DATABASE_URL est déjà configurée dans `.env`:
```env
DATABASE_URL=postgresql://neondb_owner:...@ep-rough-dew-a4mgavpk-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Migration Appliquée

La migration initiale a été créée et appliquée:
```
✅ prisma/migrations/20251124125826_init/migration.sql
```

### 3. Client Prisma Généré

Le client Prisma est prêt à être utilisé:
```typescript
import { prisma } from './lib/prisma';
```

## 📚 Utilisation

### Service Database

Un service complet a été créé dans `services/databaseService.ts` avec toutes les opérations:

```typescript
import * as db from './services/databaseService';

// Créer un utilisateur
const user = await db.createUser('john_doe');

// Sauvegarder une revue
const review = await db.saveReview(reviewData, userId);

// Rechercher des revues
const results = await db.searchReviews('kubernetes', {
  category: 'Cloud',
  tags: ['AWS'],
});

// Gérer les favoris
await db.addFavorite(userId, reviewId);
const favorites = await db.getFavorites(userId);

// Historique de recherche
await db.saveSearchHistory(userId, 'react', filters, 10);
const history = await db.getSearchHistory(userId);

// Statistiques
const stats = await db.getReviewStats(userId);
```

### Hook React

Un hook personnalisé pour gérer l'utilisateur actuel:

```typescript
import { useCurrentUser } from './hooks/useCurrentUser';

function MyComponent() {
  const { user, loading, updateUser, logout } = useCurrentUser();
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Hello {user?.username}</div>;
}
```

## 🔧 Commandes Utiles

### Ouvrir Prisma Studio (Interface Graphique)
```bash
pnpm exec prisma studio
```
Accessible sur http://localhost:5555

### Créer une nouvelle migration
```bash
pnpm exec prisma migrate dev --name nom_de_la_migration
```

### Régénérer le client Prisma
```bash
pnpm exec prisma generate
```

### Voir le statut des migrations
```bash
pnpm exec prisma migrate status
```

### Réinitialiser la base de données
```bash
pnpm exec prisma migrate reset
```

## 📊 Schéma des Relations

```
User
├── reviews (1:N)
├── favorites (1:N)
├── searchHistory (1:N)
└── settings (1:1)

Review
├── user (N:1)
├── tags (N:M)
├── sources (1:N)
└── favorites (1:N)
```

## 🎯 Prochaines Étapes

### 1. Intégrer dans l'Application

Modifier `App.tsx` pour utiliser la base de données au lieu de localStorage:

```typescript
import * as db from './services/databaseService';
import { useCurrentUser } from './hooks/useCurrentUser';

const App = () => {
  const { user } = useCurrentUser();
  
  const handleGenerate = async () => {
    const review = await generateTechReview(date, username, isPublic);
    
    // Sauvegarder dans la base de données
    if (user) {
      await db.saveReview(review, user.id);
    }
    
    setSelectedReview(review);
  };
  
  // Charger les revues depuis la DB
  useEffect(() => {
    const loadReviews = async () => {
      const dbReviews = await db.getAllReviews(user?.id);
      setReviews(dbReviews);
    };
    loadReviews();
  }, [user]);
};
```

### 2. Implémenter l'Authentification

Créer une page de connexion/inscription pour gérer les vrais utilisateurs.

### 3. Synchroniser les Favoris

Remplacer localStorage par la base de données dans `pages/Favorites.tsx`:

```typescript
const favorites = await db.getFavorites(user.id);
```

### 4. Sauvegarder l'Historique de Recherche

Dans `pages/Search.tsx`, sauvegarder chaque recherche:

```typescript
await db.saveSearchHistory(user.id, searchQuery, filters, results.length);
```

### 5. Synchroniser les Paramètres

Dans `pages/Settings.tsx`, sauvegarder dans la DB:

```typescript
await db.updateUserSettings(user.id, {
  theme,
  notifications,
  autoGenerate,
});
```

## 🔐 Sécurité

### Variables d'Environnement

⚠️ **Important:** Ne jamais exposer la DATABASE_URL côté client!

Les opérations de base de données doivent être effectuées:
- Côté serveur (API routes)
- Ou via un backend séparé

### Pour une Application Full-Stack

Si vous voulez une vraie application avec backend:

1. **Créer des API routes** (Next.js, Express, etc.)
2. **Authentification JWT** ou sessions
3. **Validation des données** avec Zod
4. **Rate limiting** pour les requêtes
5. **CORS** configuré correctement

## 📈 Monitoring

### Neon Dashboard

Accédez à votre dashboard Neon pour:
- Voir les métriques de performance
- Gérer les backups
- Monitorer l'utilisation
- Configurer les alertes

URL: https://console.neon.tech/

## 🐛 Dépannage

### Erreur: "Can't reach database server"

1. Vérifier que la DATABASE_URL est correcte
2. Vérifier la connexion internet
3. Vérifier que Neon est accessible

```bash
pnpm exec prisma db pull
```

### Erreur: "Schema is out of sync"
```bash
pnpm exec prisma migrate dev
```

### Erreur: "Client not generated"
```bash
pnpm exec prisma generate
```

## 📚 Documentation Complète

Voir `docs/10-database.md` pour la documentation détaillée.

## ✅ Checklist de Vérification

- [x] Prisma installé
- [x] DATABASE_URL configurée
- [x] Schéma créé (7 tables)
- [x] Migration appliquée
- [x] Client Prisma généré
- [x] Service database créé
- [x] Hook useCurrentUser créé
- [x] Documentation complète

## 🎉 Résultat

Votre application TechPulse AI est maintenant prête à utiliser une vraie base de données PostgreSQL hébergée sur Neon!

Les données seront persistées de manière fiable et pourront être partagées entre plusieurs utilisateurs.

---

**Prochaine étape recommandée:** Intégrer les appels à la base de données dans les composants React existants.

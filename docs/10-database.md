# Base de Données - TechPulse AI

## 📊 Vue d'ensemble

TechPulse AI utilise **PostgreSQL** hébergé sur **Neon** avec **Prisma** comme ORM.

## 🗄️ Schéma de Base de Données

### Tables Principales

#### 1. **users** - Utilisateurs
```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Champs:**
- `id`: Identifiant unique (CUID)
- `username`: Nom d'utilisateur unique
- `email`: Email optionnel
- `createdAt`: Date de création
- `updatedAt`: Date de dernière modification

---

#### 2. **reviews** - Revues Tech
```prisma
model Review {
  id                String   @id @default(cuid())
  date              String   @unique // YYYY-MM-DD
  formattedDate     String
  content           String   @db.Text
  flashSummary      String   @db.Text
  aiAnalysis        String   @db.Text
  dominantCategory  String
  newsCount         Int
  generationTime    Float
  isPublic          Boolean  @default(true)
  userId            String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

**Champs:**
- `id`: Identifiant unique
- `date`: Date de la revue (format YYYY-MM-DD, unique)
- `content`: Contenu Markdown complet
- `flashSummary`: Résumé court pour la timeline
- `aiAnalysis`: Avis de l'IA
- `dominantCategory`: Catégorie principale (Web, Cloud, DevOps, Security, IA, Mix)
- `newsCount`: Nombre de news dans la revue
- `generationTime`: Temps de génération en secondes
- `isPublic`: Visibilité publique/privée
- `userId`: Référence à l'utilisateur créateur

**Index:**
- `userId`, `date`, `dominantCategory`, `isPublic`

---

#### 3. **tags** - Tags
```prisma
model Tag {
  id   String @id @default(cuid())
  name String @unique
}
```

**Relation:** Many-to-Many avec `reviews`

---

#### 4. **sources** - Sources des actualités
```prisma
model Source {
  id       String @id @default(cuid())
  title    String
  uri      String @db.Text
  reviewId String
}
```

**Relation:** Many-to-One avec `reviews`

---

#### 5. **favorites** - Favoris
```prisma
model Favorite {
  id        String   @id @default(cuid())
  userId    String
  reviewId  String
  createdAt DateTime @default(now())
  
  @@unique([userId, reviewId])
}
```

**Contrainte:** Un utilisateur ne peut favoriser une revue qu'une seule fois

---

#### 6. **search_history** - Historique des recherches
```prisma
model SearchHistory {
  id        String   @id @default(cuid())
  query     String
  filters   Json?
  results   Int
  userId    String
  createdAt DateTime @default(now())
}
```

**Champs:**
- `query`: Texte de la recherche
- `filters`: Filtres appliqués (JSON)
- `results`: Nombre de résultats trouvés

---

#### 7. **user_settings** - Paramètres utilisateur
```prisma
model UserSettings {
  id                String   @id @default(cuid())
  theme             String   @default("dark")
  defaultVisibility String   @default("public")
  notifications     Boolean  @default(false)
  autoGenerate      Boolean  @default(false)
  userId            String   @unique
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

## 🔧 Configuration

### Variables d'Environnement

Dans `.env`:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Fichier de Configuration Prisma

`prisma.config.ts`:
```typescript
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

---

## 🚀 Commandes Prisma

### Créer une migration
```bash
pnpm exec prisma migrate dev --name nom_migration
```

### Appliquer les migrations en production
```bash
pnpm exec prisma migrate deploy
```

### Générer le client Prisma
```bash
pnpm exec prisma generate
```

### Ouvrir Prisma Studio (interface graphique)
```bash
pnpm exec prisma studio
```

### Réinitialiser la base de données
```bash
pnpm exec prisma migrate reset
```

### Synchroniser le schéma sans migration
```bash
pnpm exec prisma db push
```

---

## 📚 Utilisation du Service Database

### Importer le service
```typescript
import * as db from './services/databaseService';
```

### Opérations Utilisateur

#### Créer un utilisateur
```typescript
const user = await db.createUser('john_doe', 'john@example.com');
```

#### Récupérer ou créer un utilisateur
```typescript
const user = await db.getOrCreateUser('john_doe');
```

---

### Opérations Revues

#### Sauvegarder une revue
```typescript
const review = await db.saveReview(reviewData, userId);
```

#### Récupérer toutes les revues
```typescript
const reviews = await db.getAllReviews();
// Ou filtrer par utilisateur
const userReviews = await db.getAllReviews(userId);
// Ou seulement les publiques
const publicReviews = await db.getAllReviews(undefined, true);
```

#### Récupérer une revue par date
```typescript
const review = await db.getReviewByDate('2025-11-24');
```

#### Rechercher des revues
```typescript
const results = await db.searchReviews('kubernetes', {
  category: 'Cloud',
  tags: ['AWS', 'DevOps'],
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31',
  userId: 'user-id',
});
```

---

### Opérations Favoris

#### Ajouter aux favoris
```typescript
await db.addFavorite(userId, reviewId);
```

#### Retirer des favoris
```typescript
await db.removeFavorite(userId, reviewId);
```

#### Récupérer les favoris
```typescript
const favorites = await db.getFavorites(userId);
```

#### Vérifier si une revue est favorite
```typescript
const isFav = await db.isFavorite(userId, reviewId);
```

---

### Historique de Recherche

#### Sauvegarder une recherche
```typescript
await db.saveSearchHistory(userId, 'kubernetes', { category: 'Cloud' }, 15);
```

#### Récupérer l'historique
```typescript
const history = await db.getSearchHistory(userId, 10);
```

#### Effacer l'historique
```typescript
await db.clearSearchHistory(userId);
```

---

### Paramètres Utilisateur

#### Mettre à jour les paramètres
```typescript
await db.updateUserSettings(userId, {
  theme: 'dark',
  notifications: true,
  autoGenerate: false,
});
```

#### Récupérer les paramètres
```typescript
const settings = await db.getUserSettings(userId);
```

---

### Statistiques

#### Obtenir les statistiques
```typescript
const stats = await db.getReviewStats(userId);
// Retourne:
// {
//   totalReviews: 42,
//   totalNews: 1250,
//   avgGenerationTime: 2.8,
//   categoryDistribution: {
//     'Cloud': 15,
//     'IA': 12,
//     'Security': 10,
//     ...
//   }
// }
```

---

### Tags

#### Récupérer tous les tags
```typescript
const tags = await db.getAllTags();
```

#### Récupérer les tags populaires
```typescript
const popularTags = await db.getPopularTags(10);
```

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Ne jamais exposer la DATABASE_URL** côté client
2. **Valider toutes les entrées** avant insertion
3. **Utiliser les transactions** pour les opérations multiples
4. **Limiter les requêtes** avec `take` et `skip`
5. **Indexer les champs** fréquemment recherchés

### Exemple de Transaction
```typescript
import { prisma } from '../lib/prisma';

await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { username: 'john' } });
  await tx.review.create({ data: { userId: user.id, ... } });
});
```

---

## 🎯 Migrations

### Structure des Migrations
```
prisma/
├── migrations/
│   ├── 20251124125826_init/
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma
```

### Fichier de Migration SQL
```sql
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
```

---

## 📊 Diagramme des Relations

```
User (1) ──────< (N) Review
  │                   │
  │                   ├──< (N) Tag (M:N)
  │                   └──< (N) Source
  │
  ├──< (N) Favorite ──> (1) Review
  ├──< (N) SearchHistory
  └──< (1) UserSettings
```

---

## 🐛 Dépannage

### Erreur de connexion
```bash
# Vérifier la connexion
pnpm exec prisma db pull
```

### Schéma désynchronisé
```bash
# Réinitialiser et recréer
pnpm exec prisma migrate reset
pnpm exec prisma migrate dev
```

### Client Prisma non généré
```bash
pnpm exec prisma generate
```

---

## 📈 Performance

### Optimisations

1. **Utiliser `select`** pour limiter les champs
```typescript
const users = await prisma.user.findMany({
  select: { id: true, username: true }
});
```

2. **Utiliser `include`** avec parcimonie
```typescript
const review = await prisma.review.findUnique({
  where: { id },
  include: { tags: true } // Seulement ce qui est nécessaire
});
```

3. **Pagination**
```typescript
const reviews = await prisma.review.findMany({
  take: 20,
  skip: page * 20,
});
```

4. **Index personnalisés**
```prisma
@@index([userId, date])
@@index([dominantCategory, isPublic])
```

---

## 🔄 Backup et Restauration

### Backup
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restauration
```bash
psql $DATABASE_URL < backup.sql
```

---

## 📝 Notes

- **Neon** offre un tier gratuit avec 0.5 GB de stockage
- Les connexions sont poolées automatiquement
- SSL est requis pour les connexions
- Les migrations sont versionnées et traçables
- Prisma Studio est accessible sur `http://localhost:5555`

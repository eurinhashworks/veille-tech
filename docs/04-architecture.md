# Architecture du Projet

## Structure des dossiers

```
techpulse-ai/
├── components/          # Composants React réutilisables
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── HistoryTable.tsx
│   ├── MarkdownViewer.tsx
│   ├── Stats.tsx
│   └── Timeline.tsx
├── services/            # Logique métier et appels API
│   └── geminiService.ts
├── docs/                # Documentation complète
├── App.tsx              # Composant principal
├── index.tsx            # Point d'entrée React
├── types.ts             # Définitions TypeScript
├── index.html           # Template HTML
├── vite.config.ts       # Configuration Vite
├── tsconfig.json        # Configuration TypeScript
├── package.json         # Dépendances npm
├── .env.local           # Variables d'environnement (non versionné)
└── metadata.json        # Métadonnées de l'app
```

## Modèle de données

### Type `Review`

Structure principale représentant une revue technologique :

```typescript
interface Review {
  metadata: ReviewMetadata;
  content: string;        // Contenu Markdown
  sources: Source[];      // Sources vérifiées
}
```

### Type `ReviewMetadata`

Métadonnées enrichies de chaque revue :

```typescript
interface ReviewMetadata {
  id: string;                    // Identifiant unique
  date: string;                  // Format YYYY-MM-DD
  formattedDate: string;         // "Vendredi 08 août 2025"
  username: string;              // Pseudo ou "Anonyme"
  timestamp: number;             // Date.now()
  generationTime: number;        // Durée en secondes
  tags: string[];                // Tags thématiques
  dominantCategory: CategoryType; // Catégorie principale
  newsCount: number;             // Nombre d'actualités
  flashSummary: string;          // Résumé court
  aiAnalysis: string;            // Avis subjectif de l'IA
  isPublic: boolean;             // Visibilité
}
```

### Type `CategoryType`

Catégories disponibles :

```typescript
type CategoryType = 'Web' | 'Cloud' | 'DevOps' | 'Security' | 'IA' | 'Mix';
```

### Type `Source`

Référence d'une source d'information :

```typescript
interface Source {
  title: string;  // Titre de l'article
  uri: string;    // URL complète
}
```

## Architecture des composants

### Hiérarchie

```
App (État global)
├── Header (Statique)
├── Tabs (Navigation)
├── Generator (Vue génération)
│   └── Button
├── Timeline (Vue fil d'actualité)
├── HistoryTable (Vue tableau)
├── Stats (Vue analytics)
└── ReviewDetail (Vue détail)
    └── MarkdownViewer
```

### Flux de données

```
User Action → App State → Component Props → UI Update
     ↓
  API Call (geminiService)
     ↓
  Response → State Update → Re-render
```

## Service Layer

### geminiService.ts

Responsabilités :
- Connexion à l'API Google Gemini
- Construction du prompt structuré
- Parsing de la réponse (JSON + Markdown)
- Extraction des sources (grounding metadata)
- Gestion des erreurs

**Fonction principale :**

```typescript
generateTechReview(
  date: string, 
  username: string, 
  isPublic: boolean
): Promise<Review>
```

**Workflow :**
1. Validation de la clé API
2. Construction du prompt avec instructions de format
3. Appel à Gemini avec outil Google Search
4. Parsing de la réponse (séparation metadata/content)
5. Extraction des sources depuis grounding metadata
6. Retour d'un objet `Review` complet

## Gestion de l'état

### État principal (App.tsx)

```typescript
const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
const [currentTab, setCurrentTab] = useState<Tab>('generator');
const [selectedReview, setSelectedReview] = useState<Review | null>(null);
const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
```

### Statuts de génération

```typescript
enum GenerationStatus {
  IDLE = 'IDLE',       // Aucune action
  LOADING = 'LOADING', // Génération en cours
  SUCCESS = 'SUCCESS', // Revue générée
  ERROR = 'ERROR'      // Erreur survenue
}
```

## Patterns de conception

### 1. Separation of Concerns

- **Composants** : Affichage uniquement
- **Services** : Logique métier et API
- **Types** : Contrats de données

### 2. Props Drilling

Les données descendent via props :

```typescript
<Timeline 
  reviews={reviews} 
  onSelectReview={handleViewReview} 
/>
```

### 3. Lifting State Up

L'état est géré au niveau `App` et partagé aux enfants.

### 4. Composition

Les composants sont composables :

```typescript
<Button variant="primary" isLoading={true}>
  Générer
</Button>
```

## Styling

### Approche Utility-First

Classes Tailwind CSS directement dans les composants :

```typescript
<div className="bg-dark-800 border border-slate-700 rounded-2xl p-6">
```

### Thème personnalisé

Couleurs définies dans les classes :

- `bg-dark-900` : Fond principal (#0f172a)
- `bg-dark-800` : Cartes (#1e293b)
- `text-primary` : Bleu accent (#3b82f6)
- `text-accent-ia` : Violet IA (#a855f7)

### Animations

Transitions CSS natives :

```css
transition-all duration-200
hover:bg-blue-500
animate-fade-in-up
```

## Performance

### Optimisations

1. **Lazy Loading** : Composants chargés à la demande
2. **Memoization** : Éviter les re-renders inutiles (potentiel)
3. **Vite HMR** : Hot Module Replacement ultra-rapide
4. **Code Splitting** : Build optimisé par Vite

### Métriques

- Temps de génération : 2-5 secondes
- Taille du bundle : ~200KB (gzipped)
- First Contentful Paint : <1s

## Sécurité

### Bonnes pratiques

1. **Clé API** : Stockée dans `.env.local`, jamais commitée
2. **Validation** : TypeScript pour la sécurité des types
3. **Sanitization** : Markdown parsé manuellement (pas de `dangerouslySetInnerHTML`)
4. **HTTPS** : Recommandé en production

## Extensibilité

### Ajouter une nouvelle vue

1. Créer un composant dans `components/`
2. Ajouter un onglet dans `App.tsx`
3. Gérer l'état `currentTab`

### Ajouter un nouveau service

1. Créer un fichier dans `services/`
2. Exporter les fonctions nécessaires
3. Importer dans les composants

### Modifier le prompt IA

Éditer `geminiService.ts` → variable `prompt`

## Prochaines étapes

Consultez le [guide d'utilisation](./04-guide-utilisation.md) pour apprendre à utiliser l'application.

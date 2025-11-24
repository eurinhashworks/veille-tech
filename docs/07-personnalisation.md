# Personnalisation

## Thème et couleurs

### Palette de couleurs actuelle

```css
/* Fonds */
--dark-900: #0f172a;  /* Fond principal */
--dark-800: #1e293b;  /* Cartes et sections */

/* Textes */
--slate-200: #e2e8f0; /* Texte principal */
--slate-300: #cbd5e1; /* Texte secondaire */
--slate-400: #94a3b8; /* Texte désactivé */

/* Accents */
--primary: #3b82f6;    /* Bleu principal */
--accent-ia: #a855f7;  /* Violet IA */
--accent-sec: #06b6d4; /* Cyan secondaire */
```

### Modifier les couleurs

#### Dans les composants

Remplacez les classes Tailwind :

```typescript
// Avant
<div className="bg-dark-800 text-slate-200">

// Après (thème clair)
<div className="bg-white text-gray-900">
```

#### Créer un thème personnalisé

Ajoutez un fichier `theme.ts` :

```typescript
export const themes = {
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    text: '#e2e8f0',
    primary: '#3b82f6',
  },
  light: {
    background: '#ffffff',
    card: '#f8fafc',
    text: '#1e293b',
    primary: '#2563eb',
  },
  cyberpunk: {
    background: '#0a0e27',
    card: '#1a1f3a',
    text: '#00ff9f',
    primary: '#ff00ff',
  }
};
```

Utilisez-le dans les composants :

```typescript
const { theme } = useTheme();

<div style={{ backgroundColor: theme.background }}>
```

## Logo et branding

### Modifier le logo

Remplacez l'en-tête dans `Header.tsx` :

```typescript
<header>
  <img src="/logo.svg" alt="Mon Logo" />
  <h1>Mon Nom d'App</h1>
</header>
```

### Changer le titre

Dans `index.html` :

```html
<title>Mon App de Veille Tech</title>
```

Dans `metadata.json` :

```json
{
  "name": "Mon App de Veille Tech",
  "description": "Ma description personnalisée"
}
```

## Personnaliser le prompt IA

### Modifier le ton

Dans `geminiService.ts`, changez l'instruction :

```typescript
const prompt = `
  Tu es un [rédacteur technique / analyste senior / expert DevOps].
  Ton ton est [professionnel / décontracté / humoristique / académique].
  
  Ta mission est de rédiger une revue tech pour ${date}.
`;
```

### Ajouter des catégories

```typescript
const prompt = `
  Concentre tes recherches sur :
  - Développement Web/Mobile
  - Cloud Computing
  - DevOps
  - Cybersécurité
  - Intelligence Artificielle
  - Blockchain & Web3  // Nouvelle catégorie
  - Data Engineering    // Nouvelle catégorie
`;
```

N'oubliez pas de mettre à jour le type `CategoryType` :

```typescript
type CategoryType = 
  | 'Web' 
  | 'Cloud' 
  | 'DevOps' 
  | 'Security' 
  | 'IA' 
  | 'Blockchain'  // Nouveau
  | 'Data'        // Nouveau
  | 'Mix';
```

### Modifier la structure de la revue

```typescript
const prompt = `
  ---CONTENT---
  # Revue Tech — [Date]
  
  ## 📊 Résumé Exécutif
  [Nouveau bloc pour les décideurs]
  
  ## 🔥 Top 3 du Jour
  [Les 3 actualités les plus importantes]
  
  ## [Vos sections personnalisées]
  ...
  ---END CONTENT---
`;
```

### Changer la langue

```typescript
const prompt = `
  You are a tech editor. Your mission is to write a tech review for ${date}.
  
  Focus on: Web Dev, Cloud, DevOps, Security, AI.
  
  Write in English with a professional tone.
`;
```

## Ajouter de nouvelles vues

### Créer un nouvel onglet

1. **Ajouter le type de tab**

```typescript
type Tab = 'generator' | 'timeline' | 'table' | 'stats' | 'favorites'; // Nouveau
```

2. **Créer le composant**

```typescript
// components/Favorites.tsx
const Favorites: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const favoriteReviews = reviews.filter(r => r.metadata.isFavorite);
  
  return (
    <div>
      <h2>Mes Favoris</h2>
      {favoriteReviews.map(review => (
        <ReviewCard key={review.metadata.id} review={review} />
      ))}
    </div>
  );
};
```

3. **Ajouter l'onglet dans App.tsx**

```typescript
<button 
  onClick={() => setCurrentTab('favorites')}
  className={currentTab === 'favorites' ? 'active' : ''}
>
  ⭐ Favoris
</button>

{currentTab === 'favorites' && (
  <Favorites reviews={reviews} />
)}
```

## Ajouter des fonctionnalités

### Système de favoris

1. **Mettre à jour le type ReviewMetadata**

```typescript
interface ReviewMetadata {
  // ... champs existants
  isFavorite?: boolean;
}
```

2. **Ajouter le handler**

```typescript
const toggleFavorite = (reviewId: string) => {
  setReviews(prev => prev.map(review =>
    review.metadata.id === reviewId
      ? {
          ...review,
          metadata: {
            ...review.metadata,
            isFavorite: !review.metadata.isFavorite
          }
        }
      : review
  ));
};
```

3. **Ajouter le bouton**

```typescript
<button onClick={() => toggleFavorite(review.metadata.id)}>
  {review.metadata.isFavorite ? '⭐' : '☆'}
</button>
```

### Export en PDF

Installez `jspdf` :

```bash
npm install jspdf
```

Créez la fonction d'export :

```typescript
import jsPDF from 'jspdf';

const exportToPDF = (review: Review) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Revue Tech', 20, 20);
  
  doc.setFontSize(12);
  doc.text(review.metadata.formattedDate, 20, 30);
  
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(review.content, 170);
  doc.text(lines, 20, 40);
  
  doc.save(`revue-${review.metadata.date}.pdf`);
};
```

### Partage par lien

1. **Générer un lien unique**

```typescript
const generateShareLink = (review: Review) => {
  const encodedReview = btoa(JSON.stringify(review));
  return `${window.location.origin}?share=${encodedReview}`;
};
```

2. **Lire le lien au chargement**

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const sharedReview = params.get('share');
  
  if (sharedReview) {
    const review = JSON.parse(atob(sharedReview));
    setSelectedReview(review);
  }
}, []);
```

### Notifications

Installez `react-toastify` :

```bash
npm install react-toastify
```

Utilisez-le :

```typescript
import { toast } from 'react-toastify';

const handleGenerate = async () => {
  try {
    const review = await generateTechReview(...);
    toast.success('Revue générée avec succès !');
  } catch (error) {
    toast.error('Erreur lors de la génération');
  }
};
```

## Personnaliser les métadonnées

### Ajouter des champs personnalisés

```typescript
interface ReviewMetadata {
  // ... champs existants
  customField1?: string;
  customField2?: number;
  customTags?: string[];
}
```

### Formulaire de génération étendu

```typescript
<input 
  type="text"
  placeholder="Projet associé"
  value={projectName}
  onChange={(e) => setProjectName(e.target.value)}
/>

<select value={priority} onChange={(e) => setPriority(e.target.value)}>
  <option value="low">Basse</option>
  <option value="medium">Moyenne</option>
  <option value="high">Haute</option>
</select>
```

## Intégrations externes

### Slack

Envoyez les revues sur Slack :

```typescript
const sendToSlack = async (review: Review) => {
  await fetch('https://hooks.slack.com/services/YOUR/WEBHOOK/URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Nouvelle revue tech : ${review.metadata.formattedDate}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: review.metadata.flashSummary
          }
        }
      ]
    })
  });
};
```

### Email

Utilisez un service comme SendGrid :

```typescript
const sendByEmail = async (review: Review, recipient: string) => {
  await fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
      to: recipient,
      subject: `Revue Tech - ${review.metadata.formattedDate}`,
      html: markdownToHtml(review.content)
    })
  });
};
```

### Notion

Exportez vers Notion :

```typescript
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const exportToNotion = async (review: Review) => {
  await notion.pages.create({
    parent: { database_id: 'YOUR_DATABASE_ID' },
    properties: {
      Name: { title: [{ text: { content: review.metadata.formattedDate } }] },
      Category: { select: { name: review.metadata.dominantCategory } },
      Tags: { multi_select: review.metadata.tags.map(tag => ({ name: tag })) }
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: review.content } }]
        }
      }
    ]
  });
};
```

## Stockage persistant

### LocalStorage

```typescript
// Sauvegarder
useEffect(() => {
  localStorage.setItem('reviews', JSON.stringify(reviews));
}, [reviews]);

// Charger
useEffect(() => {
  const saved = localStorage.getItem('reviews');
  if (saved) setReviews(JSON.parse(saved));
}, []);
```

### IndexedDB

Pour de grandes quantités de données :

```typescript
import { openDB } from 'idb';

const db = await openDB('TechPulseDB', 1, {
  upgrade(db) {
    db.createObjectStore('reviews', { keyPath: 'metadata.id' });
  }
});

// Sauvegarder
await db.put('reviews', review);

// Charger
const allReviews = await db.getAll('reviews');
```

### Backend API

Créez un backend pour synchroniser les données :

```typescript
const saveReview = async (review: Review) => {
  await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
};

const loadReviews = async () => {
  const response = await fetch('/api/reviews');
  return await response.json();
};
```

## Prochaines étapes

Consultez le guide de [Déploiement](./08-deploiement.md) pour mettre votre application en production.

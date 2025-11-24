# Composants React

## Vue d'ensemble

TechPulse AI utilise une architecture de composants React modulaires et réutilisables.

## Composant App.tsx

### Responsabilités

- Gestion de l'état global de l'application
- Routing entre les différentes vues
- Orchestration des composants enfants

### État principal

```typescript
const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
const [currentTab, setCurrentTab] = useState<Tab>('generator');
const [selectedReview, setSelectedReview] = useState<Review | null>(null);
const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
```

### Handlers principaux

#### handleGenerate

```typescript
const handleGenerate = async () => {
  setStatus(GenerationStatus.LOADING);
  setError(null);
  
  try {
    const newReview = await generateTechReview(date, username, isPublic);
    setReviews(prev => [newReview, ...prev]);
    setSelectedReview(newReview);
    setStatus(GenerationStatus.SUCCESS);
  } catch (err) {
    setStatus(GenerationStatus.ERROR);
    setError(err.message);
  }
};
```

#### handleViewReview

```typescript
const handleViewReview = (review: Review) => {
  setSelectedReview(review);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

#### handleCopy

```typescript
const handleCopy = () => {
  if (selectedReview) {
    const textToCopy = `🤖 L'AVIS DE L'IA :\n${selectedReview.metadata.aiAnalysis}\n\n---\n\n${selectedReview.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
};
```

## Composant Button

### Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}
```

### Variantes

#### Primary
```typescript
<Button variant="primary">
  Générer la revue
</Button>
```
Style : Fond bleu avec glow effect

#### Secondary
```typescript
<Button variant="secondary">
  Annuler
</Button>
```
Style : Fond gris avec bordure

#### Ghost
```typescript
<Button variant="ghost">
  Voir plus
</Button>
```
Style : Transparent avec hover

### État de chargement

```typescript
<Button isLoading={true}>
  Génération en cours...
</Button>
```

Affiche un spinner animé automatiquement.

### Personnalisation

```typescript
<Button 
  variant="primary" 
  className="w-full h-12 text-lg"
  disabled={!isValid}
>
  Soumettre
</Button>
```

## Composant Header

### Structure

```typescript
const Header: React.FC = () => (
  <header className="bg-dark-800 border-b border-slate-700">
    <div className="container mx-auto px-4 py-4">
      <h1>TechPulse AI</h1>
      <p>Revue Quotidienne</p>
    </div>
  </header>
);
```

### Personnalisation

Modifiez le logo, les couleurs ou ajoutez un menu de navigation.

## Composant MarkdownViewer

### Responsabilités

- Parser le contenu Markdown
- Appliquer le styling approprié
- Gérer les listes, titres, citations

### Parsing des éléments

#### Titres

```typescript
if (trimmed.startsWith('# ')) {
  sections.push(
    <h1 className="text-3xl font-bold text-gradient">
      {trimmed.slice(2)}
    </h1>
  );
}
```

#### Listes

```typescript
if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
  currentList.push(
    <li className="mb-2 text-slate-300">
      {parseBold(trimmed.substring(2))}
    </li>
  );
}
```

#### Texte en gras

```typescript
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => 
    part.startsWith('**') && part.endsWith('**') 
    ? <strong key={i}>{part.slice(2, -2)}</strong> 
    : part
  );
};
```

#### Citations

```typescript
if (trimmed.startsWith('> ')) {
  sections.push(
    <blockquote className="border-l-4 border-primary pl-6 italic">
      "{trimmed.slice(2)}"
    </blockquote>
  );
}
```

### Sécurité

Le composant parse manuellement le Markdown sans utiliser `dangerouslySetInnerHTML`, évitant ainsi les risques XSS.

## Composant Timeline

### Props

```typescript
interface TimelineProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}
```

### Structure

```typescript
const Timeline: React.FC<TimelineProps> = ({ reviews, onSelectReview }) => (
  <div className="space-y-6">
    {reviews.map(review => (
      <TimelineCard 
        key={review.metadata.id}
        review={review}
        onClick={() => onSelectReview(review)}
      />
    ))}
  </div>
);
```

### Carte de revue

Chaque carte affiche :
- Date avec emoji du jour de la semaine
- Auteur et catégorie
- Résumé flash
- Tags
- Métadonnées (nombre de news, temps de génération)

### Interactions

- Hover : Effet de surbrillance
- Click : Ouvre la revue détaillée

## Composant HistoryTable

### Props

```typescript
interface HistoryTableProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}
```

### Fonctionnalités

#### Tri

```typescript
const [sortBy, setSortBy] = useState<'date' | 'author' | 'category'>('date');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

const sortedReviews = [...reviews].sort((a, b) => {
  if (sortBy === 'date') {
    return sortOrder === 'asc' 
      ? a.metadata.timestamp - b.metadata.timestamp
      : b.metadata.timestamp - a.metadata.timestamp;
  }
  // ...
});
```

#### Recherche

```typescript
const [searchTerm, setSearchTerm] = useState('');

const filteredReviews = sortedReviews.filter(review =>
  review.metadata.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  review.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
);
```

#### Pagination

```typescript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const paginatedReviews = filteredReviews.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
```

### Structure du tableau

```typescript
<table>
  <thead>
    <tr>
      <th onClick={() => handleSort('date')}>Date</th>
      <th onClick={() => handleSort('author')}>Auteur</th>
      <th>Catégorie</th>
      <th>Tags</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {paginatedReviews.map(review => (
      <tr key={review.metadata.id}>
        <td>{review.metadata.formattedDate}</td>
        <td>{review.metadata.username}</td>
        <td>{review.metadata.dominantCategory}</td>
        <td>{review.metadata.tags.join(', ')}</td>
        <td>
          <Button onClick={() => onSelectReview(review)}>
            Voir
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## Composant Stats

### Props

```typescript
interface StatsProps {
  reviews: Review[];
}
```

### Calculs de métriques

#### Nombre total de revues

```typescript
const totalReviews = reviews.length;
```

#### Temps moyen de génération

```typescript
const avgGenerationTime = reviews.reduce(
  (sum, r) => sum + r.metadata.generationTime, 0
) / reviews.length;
```

#### Distribution par catégorie

```typescript
const categoryDistribution = reviews.reduce((acc, review) => {
  const cat = review.metadata.dominantCategory;
  acc[cat] = (acc[cat] || 0) + 1;
  return acc;
}, {} as Record<CategoryType, number>);
```

#### Top tags

```typescript
const tagFrequency = reviews.flatMap(r => r.metadata.tags)
  .reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

const topTags = Object.entries(tagFrequency)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10);
```

### Visualisations

#### Cartes de métriques

```typescript
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <StatCard 
    title="Total Revues" 
    value={totalReviews} 
    icon="📚"
  />
  <StatCard 
    title="Temps Moyen" 
    value={`${avgGenerationTime.toFixed(1)}s`} 
    icon="⏱️"
  />
  {/* ... */}
</div>
```

#### Graphique en camembert

```typescript
<PieChart data={categoryDistribution} />
```

#### Nuage de tags

```typescript
<TagCloud tags={topTags} />
```

## Bonnes pratiques

### 1. Props typing

Toujours typer les props avec TypeScript :

```typescript
interface MyComponentProps {
  title: string;
  count: number;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, count, onAction }) => {
  // ...
};
```

### 2. Composition

Préférer la composition à l'héritage :

```typescript
<Card>
  <CardHeader>Titre</CardHeader>
  <CardBody>Contenu</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

### 3. Hooks personnalisés

Extraire la logique réutilisable :

```typescript
const useReviewFilters = (reviews: Review[]) => {
  const [filters, setFilters] = useState({});
  const filteredReviews = applyFilters(reviews, filters);
  return { filteredReviews, setFilters };
};
```

### 4. Memoization

Optimiser les calculs coûteux :

```typescript
const sortedReviews = useMemo(() => {
  return [...reviews].sort(compareFn);
}, [reviews, sortBy, sortOrder]);
```

### 5. Error boundaries

Gérer les erreurs de rendu :

```typescript
<ErrorBoundary fallback={<ErrorMessage />}>
  <MyComponent />
</ErrorBoundary>
```

## Prochaines étapes

Consultez le guide de [Personnalisation](./07-personnalisation.md) pour adapter l'application à vos besoins.

# API et Services

## Architecture du service Gemini

Le fichier `services/geminiService.ts` est le cœur de la logique métier de EUREKA.

## Initialisation de l'API

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY 
});
```

**Points clés :**
- Utilise le SDK officiel `@google/genai`
- La clé API est injectée via les variables d'environnement
- L'instance `ai` est réutilisée pour toutes les requêtes

## Fonction principale : generateTechReview

### Signature

```typescript
export const generateTechReview = async (
  date: string,      // Format YYYY-MM-DD
  username: string,  // Pseudo de l'utilisateur
  isPublic: boolean  // Visibilité de la revue
): Promise<Review>
```

### Workflow détaillé

#### 1. Validation

```typescript
if (!process.env.API_KEY) {
  throw new Error("Clé API manquante.");
}
```

Vérifie que la clé API est configurée avant tout appel.

#### 2. Construction du prompt

Le prompt est structuré en deux sections distinctes :

**Section METADATA (JSON)**
```json
{
  "flashSummary": "Résumé court",
  "dominantCategory": "Cloud",
  "tags": ["AWS", "Kubernetes"],
  "newsCount": 15,
  "aiAnalysis": "Mon analyse : ..."
}
```

**Section CONTENT (Markdown)**
```markdown
# Revue Tech — 08 Août 2025
> Citation inspirante

### Résumé Flash
...

## ☁️ Cloud Computing
* **AWS Graviton4** : Description...
```

#### 3. Appel à l'API Gemini

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    tools: [{ googleSearch: {} }],
  },
});
```

**Paramètres importants :**
- `model` : Utilise Gemini 2.5 Flash (rapide et performant)
- `tools` : Active Google Search Grounding pour des sources vérifiées
- `contents` : Le prompt structuré

#### 4. Parsing de la réponse

##### Extraction des métadonnées

```typescript
const metaMatch = text.match(/---METADATA---([\s\S]*?)---END METADATA---/);
if (metaMatch && metaMatch[1]) {
  const cleanJson = metaMatch[1]
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
  parsedMeta = JSON.parse(cleanJson);
}
```

##### Extraction du contenu Markdown

```typescript
const contentMatch = text.split('---CONTENT---');
if (contentMatch.length > 1) {
  markdownContent = contentMatch[1]
    .replace('---END CONTENT---', '')
    .trim();
}
```

##### Fallback en cas d'erreur

Si les délimiteurs sont absents, le service tente de parser le JSON et le Markdown séparément.

#### 5. Extraction des sources

```typescript
const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
if (chunks) {
  chunks.forEach((chunk: any) => {
    if (chunk.web?.uri) {
      sources.push({
        title: chunk.web.title || new URL(chunk.web.uri).hostname,
        uri: chunk.web.uri,
      });
    }
  });
}
```

**Grounding Metadata** : Gemini retourne automatiquement les sources utilisées lors de la recherche Google.

#### 6. Construction de l'objet Review

```typescript
const review: Review = {
  content: markdownContent,
  sources: uniqueSources,
  metadata: {
    id: generateId(),
    date: date,
    formattedDate: new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    username: username.trim() || 'Anonyme',
    timestamp: Date.now(),
    generationTime: parseFloat(duration.toFixed(2)),
    tags: parsedMeta.tags || [],
    dominantCategory: parsedMeta.dominantCategory || 'Mix',
    newsCount: parsedMeta.newsCount || 0,
    flashSummary: parsedMeta.flashSummary || "Revue tech quotidienne.",
    aiAnalysis: parsedMeta.aiAnalysis || "Analyse en cours...",
    isPublic: isPublic
  }
};
```

## Personnalisation du prompt

### Modifier les catégories

Éditez la section du prompt :

```typescript
const prompt = `
  Concentre tes recherches sur : 
  - Développement Web/Mobile
  - Cloud Computing
  - DevOps
  - Cybersécurité
  - Intelligence Artificielle
  - [NOUVELLE CATÉGORIE]
`;
```

### Changer le ton de l'IA

Modifiez l'instruction d'analyse :

```typescript
Dans le champ "aiAnalysis", tu dois rédiger un paragraphe court (3-4 phrases) 
à la première personne où tu donnes ton avis subjectif et stratégique.
Sois [incisif / neutre / humoristique / technique].
```

### Ajouter des sections

Dans la section `---CONTENT---` du prompt :

```markdown
## 🆕 Nouvelle Section
* **Titre** : Description...
```

### Modifier le format de sortie

Changez les délimiteurs ou le format JSON :

```typescript
---METADATA---
{
  "nouveauChamp": "valeur",
  ...
}
---END METADATA---
```

N'oubliez pas de mettre à jour le parsing correspondant.

## Gestion des erreurs

### Erreurs courantes

#### 1. Clé API invalide

```typescript
Error: Invalid API key
```

**Solution :** Vérifiez votre `.env.local` et régénérez la clé sur AI Studio.

#### 2. Quota dépassé

```typescript
Error: Resource exhausted
```

**Solution :** Attendez quelques minutes ou passez à un plan payant.

#### 3. Timeout

```typescript
Error: Request timeout
```

**Solution :** Réessayez ou vérifiez votre connexion internet.

#### 4. Parsing JSON échoué

```typescript
Error parsing metadata JSON
```

**Solution :** L'IA n'a pas respecté le format. Relancez la génération.

### Stratégie de retry

Ajoutez une logique de retry :

```typescript
const maxRetries = 3;
let attempt = 0;

while (attempt < maxRetries) {
  try {
    return await generateTechReview(date, username, isPublic);
  } catch (error) {
    attempt++;
    if (attempt === maxRetries) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }
}
```

## Optimisations possibles

### 1. Cache des revues

Stockez les revues générées dans localStorage :

```typescript
const cacheKey = `review-${date}`;
const cached = localStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);

// Sinon, générer et mettre en cache
const review = await generateTechReview(...);
localStorage.setItem(cacheKey, JSON.stringify(review));
```

### 2. Streaming de la réponse

Utilisez `streamGenerateContent` pour afficher le contenu progressivement :

```typescript
const stream = await ai.models.streamGenerateContent({...});
for await (const chunk of stream) {
  updateUI(chunk.text);
}
```

### 3. Batch processing

Générez plusieurs revues en parallèle :

```typescript
const dates = ['2025-08-01', '2025-08-02', '2025-08-03'];
const reviews = await Promise.all(
  dates.map(date => generateTechReview(date, 'Bot', true))
);
```

### 4. Compression des prompts

Réduisez la taille du prompt pour économiser des tokens :

```typescript
const prompt = `
  Génère une revue tech pour ${date}.
  Format: JSON metadata + Markdown content.
  Catégories: Web, Cloud, DevOps, Sécu, IA.
`;
```

## Monitoring et analytics

### Mesurer les performances

```typescript
const startTime = Date.now();
const review = await generateTechReview(...);
const duration = Date.now() - startTime;

console.log(`Génération en ${duration}ms`);
```

### Logger les erreurs

```typescript
try {
  return await generateTechReview(...);
} catch (error) {
  console.error('Erreur génération:', {
    date,
    username,
    error: error.message,
    stack: error.stack
  });
  throw error;
}
```

### Tracker l'usage

```typescript
const usage = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageDuration: 0
};

// Incrémenter après chaque appel
usage.totalRequests++;
```

## Sécurité

### Validation des entrées

```typescript
if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
  throw new Error('Format de date invalide');
}

if (username.length > 50) {
  throw new Error('Pseudo trop long');
}
```

### Rate limiting

```typescript
const rateLimiter = {
  requests: 0,
  resetTime: Date.now() + 60000
};

if (rateLimiter.requests >= 10) {
  throw new Error('Trop de requêtes, réessayez dans 1 minute');
}
rateLimiter.requests++;
```

### Sanitization

```typescript
const sanitizedUsername = username
  .trim()
  .replace(/[<>]/g, ''); // Éviter XSS
```

## Prochaines étapes

Consultez la documentation des [Composants React](./06-composants.md) pour comprendre l'interface utilisateur.

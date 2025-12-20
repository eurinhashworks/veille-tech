# FAQ et Dépannage

## Questions fréquentes

### Général

#### Qu'est-ce que EUREKA ?

EUREKA est une application web qui utilise l'intelligence artificielle (Google Gemini) pour générer automatiquement des revues technologiques quotidiennes. Elle agrège et synthétise les actualités en développement web, cloud, DevOps, cybersécurité et IA.

#### Est-ce gratuit ?

L'application elle-même est gratuite. Cependant, vous devez avoir une clé API Google Gemini. Le plan gratuit de Gemini offre 60 requêtes par minute, ce qui est largement suffisant pour un usage personnel.

#### Puis-je l'utiliser hors ligne ?

Non, l'application nécessite une connexion internet pour :
- Appeler l'API Google Gemini
- Effectuer des recherches Google
- Récupérer les sources d'actualités

#### Les données sont-elles sauvegardées ?

Par défaut, les revues générées sont stockées uniquement dans la mémoire du navigateur (état React). Elles disparaissent au rechargement de la page. Pour une sauvegarde persistante, consultez la section [Stockage persistant](./07-personnalisation.md#stockage-persistant).

#### Puis-je partager mes revues ?

Oui, utilisez le bouton "Copier texte" pour copier le contenu et le partager par email, Slack, ou tout autre moyen. Pour un partage automatisé, consultez la section [Intégrations externes](./07-personnalisation.md#intégrations-externes).

### Installation et configuration

#### J'obtiens "Cannot find module '@google/genai'"

```bash
npm install @google/genai
```

Si le problème persiste :

```bash
rm -rf node_modules package-lock.json
npm install
```

#### "GEMINI_API_KEY is not defined"

Vérifiez que :
1. Le fichier `.env.local` existe à la racine du projet
2. La variable est nommée exactement `GEMINI_API_KEY`
3. Il n'y a pas d'espaces autour du `=`
4. Vous avez redémarré le serveur après modification

Exemple correct :
```env
GEMINI_API_KEY=AIzaSyAbc123...
```

#### Le port 3000 est déjà utilisé

Modifiez le port dans `vite.config.ts` :

```typescript
server: {
  port: 3001, // Changez ici
}
```

Ou lancez avec un port différent :

```bash
npm run dev -- --port 3001
```

#### Erreur "Module not found: Error: Can't resolve 'path'"

Installez les types Node.js :

```bash
npm install --save-dev @types/node
```

### Génération de revues

#### La génération prend trop de temps

Temps normal : 5-10 secondes. Si c'est plus long :

1. Vérifiez votre connexion internet
2. Essayez avec une date différente
3. Vérifiez le statut de l'API Gemini : [status.google.com](https://status.google.com)

#### "Error: Resource exhausted"

Vous avez dépassé le quota de l'API Gemini (60 requêtes/minute en gratuit).

Solutions :
- Attendez 1 minute
- Passez à un plan payant
- Implémentez un rate limiter côté client

#### Les sources ne s'affichent pas

Les sources proviennent du "grounding metadata" de Gemini. Si elles sont absentes :

1. Vérifiez que Google Search est activé dans la config :
   ```typescript
   config: {
     tools: [{ googleSearch: {} }],
   }
   ```

2. Certaines requêtes peuvent ne pas retourner de sources si l'IA génère du contenu sans recherche

#### Le contenu généré est en anglais

Modifiez le prompt dans `geminiService.ts` :

```typescript
const prompt = `
  Tu es un rédacteur en chef expert en technologie.
  Rédige TOUJOURS en français.
  ...
`;
```

#### Le format de la revue est cassé

L'IA n'a pas respecté les délimiteurs. Relancez la génération. Si le problème persiste, simplifiez le prompt.

### Interface utilisateur

#### Les onglets ne s'affichent pas correctement sur mobile

Ajoutez un scroll horizontal :

```typescript
<div className="flex space-x-1 overflow-x-auto">
  {/* Onglets */}
</div>
```

#### Le bouton "Copier" ne fonctionne pas

Le Clipboard API nécessite HTTPS en production. En local, utilisez `localhost` (pas `127.0.0.1`).

Fallback pour HTTP :

```typescript
const handleCopy = () => {
  const textarea = document.createElement('textarea');
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};
```

#### Les styles ne s'appliquent pas

Vérifiez que les classes Tailwind sont correctes. Si vous utilisez des classes dynamiques :

```typescript
// ❌ Ne fonctionne pas
<div className={`text-${color}`}>

// ✅ Fonctionne
<div className={color === 'blue' ? 'text-blue-500' : 'text-red-500'}>
```

### Déploiement

#### "Failed to load environment variables" sur Vercel

1. Allez dans Settings → Environment Variables
2. Ajoutez `GEMINI_API_KEY` avec votre clé
3. Redéployez

#### 404 sur les routes après déploiement

Configurez les redirections :

**Vercel** : Créez `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** : Créez `_redirects` dans `public/`
```
/*    /index.html   200
```

#### L'application ne se charge pas en production

1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs du serveur
3. Testez le build localement : `npm run build && npm run preview`

#### Erreur CORS en production

Si vous avez un backend séparé, configurez CORS :

```typescript
app.use(cors({
  origin: 'https://votre-domaine.com'
}));
```

### Performance

#### L'application est lente

Optimisations :

1. **Lazy loading des composants**
   ```typescript
   const Stats = lazy(() => import('./components/Stats'));
   ```

2. **Memoization**
   ```typescript
   const sortedReviews = useMemo(() => {
     return [...reviews].sort(compareFn);
   }, [reviews, sortBy]);
   ```

3. **Virtualisation des listes**
   ```bash
   npm install react-window
   ```

#### Le bundle est trop gros

Analysez le bundle :

```bash
npm install --save-dev rollup-plugin-visualizer
```

Dans `vite.config.ts` :

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

Puis :

```bash
npm run build
```

### Sécurité

#### Ma clé API est exposée

Si vous avez commité votre clé par erreur :

1. **Révoquez immédiatement** la clé sur [AI Studio](https://ai.google.dev/)
2. Générez une nouvelle clé
3. Supprimez la clé de l'historique Git :
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```

#### Comment sécuriser l'API key ?

**Mauvaise pratique** : Clé dans le code frontend

**Bonne pratique** : Créez un backend proxy

```typescript
// Backend (Node.js/Express)
app.post('/api/generate', async (req, res) => {
  const { date, username } = req.body;
  
  // La clé est sur le serveur, pas exposée
  const review = await generateTechReview(date, username);
  res.json(review);
});

// Frontend
const review = await fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({ date, username })
}).then(r => r.json());
```

#### Puis-je limiter l'accès à l'application ?

Oui, ajoutez une authentification :

```bash
npm install firebase
```

```typescript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const user = await signInWithEmailAndPassword(auth, email, password);
```

## Problèmes connus

### Gemini API

- **Latence variable** : 2-15 secondes selon la charge
- **Quotas stricts** : 60 req/min en gratuit
- **Parsing aléatoire** : L'IA ne respecte pas toujours le format exact

### React 19

- Certaines librairies tierces peuvent ne pas être compatibles
- Utilisez React 18 si nécessaire :
  ```bash
  npm install react@18 react-dom@18
  ```

### Vite

- Hot reload peut échouer sur certains fichiers
- Solution : Redémarrez le serveur

## Obtenir de l'aide

### Ressources officielles

- [Documentation Google Gemini](https://ai.google.dev/docs)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation React](https://react.dev/)

### Communauté

- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-gemini)
- [Reddit r/reactjs](https://reddit.com/r/reactjs)
- [Discord Vite](https://chat.vitejs.dev/)

### Debugging

#### Activer les logs détaillés

Dans `geminiService.ts` :

```typescript
console.log('Prompt envoyé:', prompt);
console.log('Réponse brute:', response);
console.log('Metadata parsée:', parsedMeta);
console.log('Contenu parsé:', markdownContent);
```

#### Inspecter les requêtes réseau

1. Ouvrez DevTools (F12)
2. Onglet Network
3. Filtrez par "Fetch/XHR"
4. Inspectez les requêtes vers `generativelanguage.googleapis.com`

#### Vérifier l'état React

Installez React DevTools :
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Contribuer

Si vous trouvez un bug ou avez une suggestion :

1. Vérifiez que le problème n'est pas déjà connu
2. Créez une issue détaillée avec :
   - Description du problème
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Captures d'écran si applicable
   - Version de Node.js, navigateur, OS

## Changelog

### Version 0.0.0 (Actuelle)

- ✨ Génération de revues tech avec Gemini
- 📅 Vue Timeline
- 📂 Vue Historique
- 📊 Vue Stats
- 🤖 Avis subjectif de l'IA
- 📋 Copie rapide du contenu
- 🔍 Sources vérifiées avec Google Search Grounding

### Roadmap

- [ ] Sauvegarde persistante (LocalStorage/IndexedDB)
- [ ] Export PDF
- [ ] Partage par lien
- [ ] Système de favoris
- [ ] Notifications
- [ ] Mode sombre/clair
- [ ] Recherche avancée
- [ ] Filtres par catégorie
- [ ] Intégration Slack/Email
- [ ] Backend API
- [ ] Authentification utilisateur
- [ ] Multi-langues

---

**Besoin d'aide supplémentaire ?** Consultez les autres sections de la documentation ou ouvrez une issue sur le dépôt du projet.

# Installation et Configuration

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure
- **npm** ou **yarn** (gestionnaire de paquets)
- Un éditeur de code (VS Code recommandé)
- Une clé API Google Gemini (gratuite)

## Démarrage rapide

### 1. Cloner ou télécharger le projet

```bash
# Si vous avez accès au dépôt Git
git clone <url-du-repo>
cd techpulse-ai

# Ou décompressez l'archive ZIP téléchargée
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande installe :
- React 19 et React DOM
- TypeScript
- Vite (bundler ultra-rapide)
- Google Generative AI SDK
- UUID (génération d'identifiants)

### 3. Configuration de l'API

#### Obtenir une clé API Gemini

1. Rendez-vous sur [Google AI Studio](https://ai.google.dev/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Get API Key"
4. Créez un nouveau projet ou sélectionnez-en un existant
5. Copiez votre clé API

#### Configurer le fichier .env.local

Ouvrez le fichier `.env.local` à la racine du projet et ajoutez votre clé :

```env
GEMINI_API_KEY=votre_clé_api_ici
```

**Important :** Ne partagez jamais votre clé API publiquement. Le fichier `.env.local` est déjà dans `.gitignore`.

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

## Scripts disponibles

### Développement

```bash
npm run dev
```
Lance le serveur de développement avec hot-reload.

### Build de production

```bash
npm run build
```
Compile l'application pour la production dans le dossier `dist/`.

### Prévisualisation du build

```bash
npm run preview
```
Prévisualise le build de production localement.

## Structure des fichiers de configuration

### package.json

Définit les dépendances et scripts du projet.

```json
{
  "name": "techpulse-ai:-revue-quotidienne",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### vite.config.ts

Configuration du bundler Vite :

```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      }
    };
});
```

**Points clés :**
- Port 3000 par défaut
- Host 0.0.0.0 pour accès réseau local
- Injection de la clé API via `process.env.API_KEY`

### tsconfig.json

Configuration TypeScript pour React et Vite :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "types": ["node"]
  }
}
```

## Vérification de l'installation

Une fois l'application lancée, vous devriez voir :

1. L'interface TechPulse AI avec 4 onglets
2. Trois revues de démonstration (mock data)
3. Le formulaire de génération fonctionnel

### Test de génération

1. Sélectionnez une date récente
2. Entrez un pseudo (optionnel)
3. Cliquez sur "Générer la revue"
4. Attendez 5-10 secondes
5. La revue générée s'affiche avec sources

Si vous obtenez une erreur "Clé API manquante", vérifiez votre fichier `.env.local`.

## Dépannage

### Erreur : "Cannot find module '@google/genai'"

```bash
npm install @google/genai
```

### Erreur : "GEMINI_API_KEY is not defined"

Vérifiez que :
1. Le fichier `.env.local` existe à la racine
2. La variable est bien nommée `GEMINI_API_KEY`
3. Vous avez redémarré le serveur après modification

### Port 3000 déjà utilisé

Modifiez le port dans `vite.config.ts` :

```typescript
server: {
  port: 3001, // Changez ici
}
```

## Prochaines étapes

Consultez l'[architecture du projet](./03-architecture.md) pour comprendre l'organisation du code.

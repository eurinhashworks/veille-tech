# Déploiement

## Préparation au déploiement

### 1. Build de production

```bash
npm run build
```

Cette commande :
- Compile TypeScript en JavaScript
- Minifie le code
- Optimise les assets
- Génère le dossier `dist/`

### 2. Vérifier le build

```bash
npm run preview
```

Teste le build localement sur http://localhost:4173

### 3. Variables d'environnement

Créez un fichier `.env.production` :

```env
GEMINI_API_KEY=votre_clé_production
```

## Déploiement sur Vercel

### Méthode 1 : Via l'interface web

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre dépôt Git
4. Configurez les variables d'environnement :
   - `GEMINI_API_KEY` : Votre clé API
5. Cliquez sur "Deploy"

### Méthode 2 : Via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Configuration vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

## Déploiement sur Netlify

### Via l'interface web

1. Créez un compte sur [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre dépôt Git
4. Configurez :
   - Build command : `npm run build`
   - Publish directory : `dist`
5. Ajoutez les variables d'environnement
6. Cliquez sur "Deploy site"

### Via CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy

# Déployer en production
netlify deploy --prod
```

### Configuration netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  GEMINI_API_KEY = "your_key_here"
```

## Déploiement sur GitHub Pages

### 1. Installer gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Configurer package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://votre-username.github.io/votre-repo"
}
```

### 3. Configurer vite.config.ts

```typescript
export default defineConfig({
  base: '/votre-repo/',
  // ... reste de la config
});
```

### 4. Déployer

```bash
npm run deploy
```

### 5. Configurer GitHub

1. Allez dans Settings → Pages
2. Source : "gh-pages branch"
3. Sauvegardez

**Note :** GitHub Pages ne supporte pas les variables d'environnement secrètes. Utilisez plutôt Vercel ou Netlify pour les apps avec API keys.

## Déploiement sur un VPS

### Prérequis

- Serveur Linux (Ubuntu recommandé)
- Node.js installé
- Nginx ou Apache
- Nom de domaine (optionnel)

### 1. Préparer le serveur

```bash
# Se connecter au serveur
ssh user@votre-serveur.com

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer Nginx
sudo apt-get install nginx
```

### 2. Déployer l'application

```bash
# Cloner le repo
git clone https://github.com/votre-username/techpulse-ai.git
cd techpulse-ai

# Installer les dépendances
npm install

# Créer le fichier .env.local
echo "GEMINI_API_KEY=votre_clé" > .env.local

# Build
npm run build
```

### 3. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/techpulse
```

Contenu :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    root /home/user/techpulse-ai/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Activer le site :

```bash
sudo ln -s /etc/nginx/sites-available/techpulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. HTTPS avec Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## Déploiement Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

### Déployer

```bash
# Build
docker-compose build

# Lancer
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

## CI/CD avec GitHub Actions

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Configurer les secrets

1. Allez dans Settings → Secrets → Actions
2. Ajoutez :
   - `GEMINI_API_KEY`
   - `VERCEL_TOKEN`
   - `ORG_ID`
   - `PROJECT_ID`

## Optimisations de production

### 1. Compression

Activez Gzip/Brotli dans votre serveur web.

### 2. CDN

Utilisez un CDN comme Cloudflare pour :
- Mise en cache globale
- Protection DDoS
- Optimisation des images

### 3. Monitoring

Installez un outil de monitoring :

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "votre-dsn-sentry",
  environment: "production",
});
```

### 4. Analytics

Ajoutez Google Analytics :

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 5. Cache des assets

Dans `vite.config.ts` :

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gemini: ['@google/genai'],
        }
      }
    }
  }
});
```

## Sécurité en production

### 1. Headers de sécurité

Dans Nginx :

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

### 2. Rate limiting

Limitez les requêtes API :

```typescript
const rateLimiter = new Map();

const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    throw new Error('Too many requests');
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
};
```

### 3. CORS

Si vous avez un backend séparé :

```typescript
app.use(cors({
  origin: 'https://votre-domaine.com',
  credentials: true
}));
```

## Checklist de déploiement

- [ ] Build de production testé localement
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] Compression activée
- [ ] Headers de sécurité configurés
- [ ] Monitoring installé
- [ ] Analytics configuré
- [ ] Sauvegardes automatiques
- [ ] Nom de domaine configuré
- [ ] Tests de charge effectués

## Maintenance

### Mises à jour

```bash
# Mettre à jour les dépendances
npm update

# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix
```

### Sauvegardes

Sauvegardez régulièrement :
- Code source (Git)
- Base de données (si applicable)
- Variables d'environnement
- Configuration serveur

### Logs

Consultez les logs régulièrement :

```bash
# Vercel
vercel logs

# Netlify
netlify logs

# VPS
sudo tail -f /var/log/nginx/access.log
```

## Prochaines étapes

Consultez la [FAQ et Dépannage](./09-faq.md) pour résoudre les problèmes courants.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TechPulse AI : Revue Quotidienne

> Générez, archivez et analysez l'actualité tech quotidienne avec la précision de l'IA.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google)](https://ai.google.dev/)

## Aperçu

TechPulse AI est une application web moderne qui révolutionne la veille technologique en automatisant la création de revues quotidiennes grâce à l'intelligence artificielle Google Gemini.

### Fonctionnalités principales

- **Génération automatique** : L'IA recherche et synthétise les actualités tech du jour
- **Sources vérifiées** : Utilise Google Search Grounding pour des informations fiables
- **Analyse critique** : Chaque revue inclut un avis subjectif et stratégique de l'IA
- **Timeline interactive** : Visualisez vos revues sous forme de fil d'actualité
- **Analytics** : Métriques et statistiques sur vos revues
- **Export facile** : Copiez le contenu pour Word, Notion, Email en un clic

### Catégories couvertes

- Search & Web
- Web & Mobile Development
- Cloud Computing (AWS, Azure, GCP)
- DevOps & Platform Engineering
- Cybersécurité
- Intelligence Artificielle

## Documentation complète

Une documentation détaillée est disponible dans le dossier [`docs/`](./docs/) :

1. [**Vue d'ensemble**](./docs/01-vue-ensemble.md) - Présentation du projet et cas d'usage
2. [**Installation et Configuration**](./docs/02-installation.md) - Guide de démarrage rapide
3. [**Architecture du Projet**](./docs/03-architecture.md) - Structure et modèle de données
4. [**Guide d'Utilisation**](./docs/04-guide-utilisation.md) - Comment utiliser l'application
5. [**API et Services**](./docs/05-api-services.md) - Fonctionnement technique de l'API Gemini
6. [**Composants React**](./docs/06-composants.md) - Documentation des composants
7. [**Personnalisation**](./docs/07-personnalisation.md) - Adapter l'app à vos besoins
8. [**Déploiement**](./docs/08-deploiement.md) - Mettre en production
9. [**FAQ et Dépannage**](./docs/09-faq.md) - Résoudre les problèmes courants

## Démarrage rapide

### Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- Une clé API Google Gemini ([Obtenir gratuitement](https://ai.google.dev/))

### Installation

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd techpulse-ai

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API
# Éditez le fichier .env.local et ajoutez :
# GEMINI_API_KEY=votre_clé_api_ici

# 4. Lancer l'application
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

## Captures d'écran

### Générateur de revues
Interface intuitive pour créer des revues en quelques secondes.

### Timeline
Visualisez toutes vos revues sous forme de fil chronologique.

### Vue détaillée
Contenu structuré avec l'avis de l'IA et sources vérifiées.

## Technologies utilisées

- **Frontend** : React 19, TypeScript
- **Build Tool** : Vite 6.2
- **IA** : Google Gemini 2.5 Flash
- **Styling** : Tailwind CSS (utility classes)
- **Déploiement** : Vercel, Netlify, ou VPS

## Scripts disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Compiler pour la production
npm run preview  # Prévisualiser le build de production
```

## Configuration de l'API

1. Obtenez une clé API gratuite sur [Google AI Studio](https://ai.google.dev/)
2. Créez/éditez le fichier `.env.local` à la racine :
   ```env
   GEMINI_API_KEY=votre_clé_api_ici
   ```
3. Redémarrez le serveur de développement

**Note** : Le plan gratuit offre 60 requêtes/minute, largement suffisant pour un usage personnel.

## Déploiement

### Vercel (Recommandé)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

Consultez le [guide de déploiement complet](./docs/08-deploiement.md) pour plus d'options.

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence privée. Tous droits réservés.

## Support

- [Documentation complète](./docs/)
- [Signaler un bug](../../issues)
- [Proposer une fonctionnalité](../../issues)
- [FAQ et Dépannage](./docs/09-faq.md)

## Liens utiles

- [Google AI Studio](https://ai.studio/apps/drive/1ebuyfGTJeZO90K_XstXRH7P2dZ0IPDlF)
- [Documentation Gemini](https://ai.google.dev/docs)
- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)

## Roadmap

- [ ] Sauvegarde persistante (LocalStorage/IndexedDB)
- [ ] Export PDF des revues
- [ ] Partage par lien unique
- [ ] Système de favoris
- [ ] Mode sombre/clair
- [ ] Intégrations (Slack, Email, Notion)
- [ ] Backend API avec authentification
- [ ] Support multi-langues

---

<div align="center">

**Développé avec passion et propulsé par Google Gemini AI**

[Documentation](./docs/) • [Démarrage rapide](#démarrage-rapide) • [Support](#support)

</div>

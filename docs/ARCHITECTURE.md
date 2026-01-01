# Architecture Technique - EUREKA

EUREKA est une application moderne de veille technologique utilisant l'IA pour générer et analyser du contenu quotidien.

## Pile Technique (Stack)
- **Frontend** : React 19, TypeScript, Tailwind CSS, Framer Motion.
- **Backend / API** : Express.js (Node.js), Prisma ORM.
- **Base de données** : PostgreSQL (Primaire), LocalStorage (Fallback).
- **IA / ML** : Google Gemini API (Génération), TensorFlow.js (Modèles ML locaux).
- **Routage** : React Router v7.

## Structure du Projet
```text
/
├── components/         # Composants UI réutilisables (Header, Button, Toast, etc.)
├── pages/              # Pages principales (Generator, Search, Stats, etc.)
├── services/           # Logique métier et appels API
│   ├── ml/             # Services d'Intelligence Artificielle et Modèles
│   ├── databaseService # Interface directe avec Prisma
│   ├── storageService  # Couche d'abstraction (DB + Fallback LocalStorage)
│   └── apiService      # Gestion de l'API Gemini
├── server/             # Serveur Express et API Endpoints
├── prisma/             # Schéma et migrations de la base de données
└── tests/              # Suite de tests (Unitaires, Intégration, E2E)
```

## Flux de Données Principal
1. **Saisie** : L'utilisateur définit une date et un pseudo dans `Generator.tsx`.
2. **Génération** : `apiService` appelle Gemini pour créer le contenu.
3. **Stockage** : `storageService` sauvegarde la revue via Prisma ou LocalStorage.
4. **Consultation** : L'utilisateur navigue vers `ReviewDetail.tsx` via une URL unique.
5. **Enrichissement ML** : Les services ML analysent l'historique pour proposer des recommandations personnalisées.

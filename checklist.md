# Checklist de Migration Next.js

Ce document sert de suivi pour la migration et la consolidation de l'application vers une architecture Next.js moderne (basée sur Next.js 14+ et l'App Router).

## Phase 0 : Préparation et Analyse [Terminée]

-   [x] **Audit des Dépendances :** Analyser les `package.json` des dossiers `client/` et `server/` pour lister toutes les dépendances frontend et backend.
-   [x] **Contrôle de Version :** Créer une nouvelle branche de travail dédiée à la migration (ex: `feature/nextjs-migration`).
-   [x] **Mise à Jour Initiale des Dépendances Next.js :** Mettre à jour les dépendances principales de Next.js à la racine du projet (`next`, `react`, `react-dom`).
    -   *Note : Mise à jour vers React 19 effectuée, mais a révélé des incompatibilités. Rétrogradation vers React 18 nécessaire.*
-   [x] **Mise en Place de l'App Router :** S'assurer que le projet est configuré pour utiliser l'App Router (création du dossier `app/` et des fichiers de base).

## Phase 1 : Migration du Backend (`server/` -> Next.js API Routes)

L'objectif est de supprimer complètement le dossier `server/` en déplaçant sa logique dans les API Routes de Next.js.

-   [ ] **Migration des Routes API :**
    -   [ ] Identifier toutes les routes définies dans `server/routes.ts` et `server/api/`.
    -   [ ] Recréer chaque endpoint en utilisant les **Route Handlers** de l'App Router (`app/api/.../route.ts`).
-   [ ] **Migration des Middlewares :** (En cours)
    -   [ ] Adapter la logique des middlewares custom (`server/middleware/`) dans un `middleware.ts` à la racine et/ou dans des fonctions utilitaires appelées par les Route Handlers.
-   [ ] **Migration de la Logique Métier et des Services :**
    -   [ ] Déplacer les services (`server/services/`, `server/lib/`) vers un nouveau dossier à la racine, par exemple `lib/server/`.
-   [ ] **Gestion de l'Environnement :** Consolider toutes les variables d'environnement des différents `.env` dans un seul `.env.local` à la racine du projet.

## Phase 2 : Migration du Frontend (`client/` -> Next.js App Router)

L'objectif est de supprimer le dossier `client/` et d'intégrer toute l'interface utilisateur dans l'App Router de Next.js.

-   [ ] **Migration des Pages :**
    -   [ ] Mapper chaque page de `client/pages/` à une route de l'App Router (`app/.../page.tsx`).
-   [ ] **Déplacement des Composants :**
    -   [ ] Copier le contenu du dossier `client/components/` vers un dossier `components/` à la racine du projet.
-   [ ] **Création du Layout Principal :**
    -   [ ] Déplacer la structure globale de l'application (Header, Sidebar, etc.), de `client/App.tsx` vers `app/layout.tsx`.
-   [ ] **Remplacement du Routage :**
    -   [ ] Remplacer les usages de `react-router-dom` par les composants et hooks de Next.js (`<Link>`, `useRouter`).
-   [ ] **Adaptation de l'Appel aux APIs :**
    -   [ ] Modifier le service `client/services/apiService.ts` pour qu'il pointe vers les API Routes Next.js (chemins relatifs `/api/...`).
    -   [ ] **(Optimisation)** Migrer les appels API vers des Server Components ou Server Actions lorsque c'est pertinent.
-   [ ] **Gestion des Assets Statiques :**
    -   [ ] Déplacer le contenu du dossier `client/public/` vers le dossier `public/` à la racine du projet.

## Phase 3 : Nettoyage et Finalisation

-   [ ] **Suppression des Anciens Dossiers :** Supprimer les dossiers `client/` et `server/`.
-   [ ] **Fusion des Dépendances :** Mettre à jour le `package.json` racine avec toutes les dépendances nécessaires et supprimer les obsolètes. Lancer `npm install`.
-   [ ] **Mise à Jour des Scripts :** Modifier les scripts (`dev`, `build`, `start`) dans le `package.json` racine pour utiliser les commandes Next.js.
-   [ ] **Suppression des Fichiers de Configuration :** Supprimer `vite.config.ts`, les `tsconfig.json` de `client/` et `server/`, et tout autre fichier de configuration devenu obsolète.

## Phase 4 : Tests et Validation

-   [ ] **Mise à Jour des Tests :**
    -   [ ] Adapter les tests unitaires, d'intégration et E2E (`tests/`) à la nouvelle structure et aux changements de logique.
-   [ ] **Tests de Régression Manuels :** Effectuer des tests manuels exhaustifs de toute l'application.

## Phase 5 : Mise à Jour du Déploiement

-   [ ] **CI/CD :** Mettre à jour les workflows GitHub Actions (`.github/workflows/`) pour le déploiement de l'application Next.js unifiée.
-   [ ] **Configuration Vercel :** Vérifier et adapter la configuration Vercel si nécessaire.

---

**Statut Global :** `[ ]` En cours `[ ]` Terminé

**Remarques :**
*   Ce plan est basé sur la migration vers Next.js 14+ (App Router).
*   Chaque étape doit être validée avant de passer à la suivante.
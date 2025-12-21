# Architecture Technique - Eureka AI

## Vue d'Ensemble
Eureka AI est une application Full Stack de veille technologique intelligente.

### Stack Technique
- **Frontend**: React 19, TailwindCSS, Vite.
- **Backend**: Express.js, Node.js (TypeScript).
- **Base de Données**: PostgreSQL (via Prisma ORM).
- **IA/ML**:
  - **Generative AI**: Google Gemini Pro (via `@google/genai`).
  - **Machine Learning**: TensorFlow.js (Node), regression linéaire, NLP (Natural).
- **Authentification**: Better-Auth (Sessions en BDD).

## Flux de Données

1.  **Client (React)** :
    - Envoie des requêtes API standard (REST) avec les cookies de session.
    - Interagit uniquement avec `/api/*`.

2.  **Serveur (Express)** :
    - middleware `authMiddleware` vérifie la session.
    - middleware `errorMiddleware` capture les exceptions.
    - middleware `rateLimiter` protège contre les abus.
    - Les contrôleurs (api/*) valident les entrées avec `Zod`.
    - Les services séparent la logique métier (ex: `UserService`, `GeminiService`).

3.  **Intelligence Artificielle** :
    - **Mode Génératif** : Le serveur construit un prompt enrichi et appelle l'API Gemini. La clé API est sécurisée côté serveur.
    - **Mode Analytique** : `TrendPredictionModel` utilise des régressions linéaires locales pour prédire les tendances futures sans appel API externe.

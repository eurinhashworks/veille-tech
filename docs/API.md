# Documentation API

Toutes les routes sont préfixées par `/api`.
Authentification requise pour toutes les routes sauf `/api/visitors`.

## Authentification
Géré par `better-auth`.
- **Session** : Cookie HTTP-Only sécurisé.

## Endpoints Principaux

### 1. Génération IA
- **POST** `/api/generate`
- **Body** :
  ```json
  {
    "date": "YYYY-MM-DD",
    "username": "string (opt)",
    "isPublic": boolean,
    "aiPreferences": { "style": "analytical", ... }
  }
  ```
- **Réponse** : Objet `Review` complet.

### 2. Revues
- **GET** `/api/reviews`
  - Query: `dateFrom`, `dateTo`, `limit`
- **POST** `/api/reviews`
  - Body: `{ review: ReviewObject }` (Validé par Zod)

### 3. Tendances
- **GET** `/api/trends`
  - Query: `daysBack` (default 30), `limit` (default 10)
  - Retourne les prédictions d'impact pour les technologies détectées.

## Gestion des Erreurs
Format standard :
```json
{
  "status": "error",
  "message": "Description...",
  "details": [] // Optionnel (pour validation Zod)
}
```

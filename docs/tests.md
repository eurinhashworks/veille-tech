# Tests & Qualité Logicielle

L'application dispose d'une suite de tests complète couvrant les services, la validation et les flux utilisateurs.

## 1. Tests Unitaires (Vitest)
Ciblent la logique pure des services et la validation des données.

- **Exécution** : `pnpm test`
- **Fichiers** : `tests/unit/*.test.ts`
- **Couverture** :
  - `validation.test.ts` : Schémas Zod.
  - `geminiService.test.ts` : Mock de l'IA Google GenAI.

## 2. Tests de Bout-en-Bout (Playwright)
Simulent un utilisateur réel dans le navigateur Chrome.

- **Exécution** : `npx playwright test`
- **Scénario Principal** (`tests/e2e/main-flow.spec.ts`) :
  1. Chargement de la page d'accueil.
  2. Génération d'une revue.
  3. Redirection vers le détail.
  4. Mise en favori et vérification de la notification Toast.

## 3. Configuration de l'environnement de Test
- **Mock API** : Playwright utilise l'instance de développement locale.
- **Vitest Config** : `vitest.config.ts` inclut des variables d'environnement simulées (API_KEY).

# Intelligence Artificielle & Services ML

EUREKA intègre trois services d'intelligence artificielle qui interagissent avec les données stockées via `storageService`.

## 1. AdaptiveIntelligenceService
Ce service adapte l'expérience utilisateur en fonction de son comportement de recherche et de lecture.

- **Fichier** : `services/ml/adaptiveIntelligenceService.ts`
- **Patterns Détectés** :
  - `focus-ia` : Priorité augmentée si la catégorie IA est dominante dans l'historique.
  - `tech-enthusiast` : Ajustement de la profondeur si des mots-clés techniques sont fréquents.
- **Actions** : Ajuste `contentDepth` (shallow/deep) et `updateFrequency`.

## 2. PersonalizationService
Gère les recommandations personnalisées basées sur le profil utilisateur.

- **Fichier** : `services/ml/personalizationService.ts`
- **Logique** :
  - **Recommandation** : Score chaque revue en fonction des intérêts de l'utilisateur.
  - **Skill Level** : Niveau (0-1) calculé selon la variété des tags favoris.
  - **Tech Stack** : Extrait automatiquement des catégories les plus consultées.

## 3. TrendAnalysisService
Analyse les tendances globales basées sur l'ensemble des revues générées.

- **Fichier** : `services/ml/trendAnalysisService.ts`
- **Logique** : Regroupe les revues par période pour identifier les sujets en forte croissance.

## Modèles de Données ML
Les modèles sont définis dans `services/ml/models/` :
- `UserProfileModel.ts` : Structure du profil utilisateur.
- `TrendPredictionModel.ts` : Modèle pour l'analyse de tendances.
- `AdaptiveIntelligenceModel.ts` : Définition des règles et patterns d'adaptation.

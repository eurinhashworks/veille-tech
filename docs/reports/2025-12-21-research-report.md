# Rapport de Veille Technique - 21 Décembre 2025

Ce rapport synthétise les vulnérabilités, les bonnes pratiques et les opportunités d'outils pour TechPulse AI.

## 🛡️ Sécurité (Security Audit)

**Vulnérabilités du projet (pnpm audit) :**
- **jws** (via `@google/genai > google-auth-library`) : 1 vulnérabilité de sévérité **ÉLEVÉE**.
  - *Action requise* : Mettre à jour `@google/genai` vers la version la plus stable pour résoudre la dépendance `jws`.

**Vulnérabilités de l'écosystème (Recherche Web) :**
- **React (RSC)** : CVE-2025-55182 (React2Shell). Une vulnérabilité RCE critique affectant les composants serveur.
  - *Statut* : Nous utilisons React 19.2.0. Une mise à jour vers **19.2.1+** est impérative.
- **Express / Multer** : CVE-2025-47935 (DoS via Multer).
  - *Recommandation* : Vérifier la version de Multer si utilisée pour l'import de données.

## ⚡ Optimisation & Bonnes Pratiques

- **Vite 6** : Utiliser le nouveau moteur de build pour des temps de compilation réduits.
- **React 19** : Abandonner les `forwardRef` au profit de la transmission directe de `ref` en tant que prop.

## 🚀 Recommandations d'Outils (Veille)

Suite à l'analyse de la liste API Mega-list, voici les meilleures opportunités pour TechPulse AI :

1. **NewsAPI.org** : Pour charger des flux d'actualités bruts en complément de Google Search.
2. **Hugging Face Inference API** : Pour des modèles NLP spécialisés (sentiment analysis, NER) à faible coût.
3. **Zapier/Make API** : Pour automatiser l'export des revues vers d'autres outils.

## 💡 Projet d'Intégration : NewsAPI
L'intégration de NewsAPI permettrait de pré-sélectionner les articles avant de lancer Gemini, réduisant ainsi la consommation de tokens de recherche Grounding.

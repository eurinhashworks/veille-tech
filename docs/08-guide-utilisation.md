# Guide d'Utilisation

## Interface principale

L'application EUREKA est organisée en 4 onglets principaux :

1. **✨ Générateur** : Créer de nouvelles revues
2. **📅 Timeline** : Visualiser les revues en fil chronologique
3. **📂 Historique** : Tableau complet avec recherche
4. **📊 Stats** : Métriques et analytics

## 1. Générer une revue

### Étape par étape

1. **Sélectionner une date**
   - Cliquez sur le champ "Date de la revue"
   - Choisissez la date souhaitée (passée ou présente)
   - L'IA recherchera les actualités de cette journée

2. **Entrer un pseudo (optionnel)**
   - Laissez vide pour "Anonyme"
   - Ou entrez votre nom/pseudo pour attribution

3. **Choisir la visibilité**
   - **🌍 Publique** : Visible par tous (par défaut)
   - **🔒 Privée** : Usage personnel uniquement

4. **Lancer la génération**
   - Cliquez sur "Générer la revue"
   - Attendez 5-10 secondes (l'IA recherche et analyse)
   - La revue s'affiche automatiquement

### Que se passe-t-il pendant la génération ?

1. L'IA utilise Google Search pour trouver les actualités du jour
2. Elle filtre les informations pertinentes (Web, Cloud, DevOps, Sécu, IA)
3. Elle structure le contenu en sections thématiques
4. Elle rédige un avis critique personnel
5. Elle extrait les sources vérifiées

### Gestion des doublons

Si une revue existe déjà pour cette date, elle sera affichée directement sans nouvelle génération.

## 2. Lire une revue

### Structure d'une revue

Chaque revue générée contient :

#### En-tête métadonnées
- **Date** : Date formatée (ex: "Vendredi 08 août 2025")
- **Curateur** : Pseudo de l'auteur
- **Dominante** : Catégorie principale (Cloud, IA, Security, etc.)

#### Bloc "Avis de l'IA"
Un encadré violet avec l'analyse subjective et stratégique de l'IA :
> "Mon analyse : L'annonce d'aujourd'hui confirme que..."

#### Contenu principal
Sections thématiques :
- **Résumé Flash** : Vue d'ensemble en 3 lignes
- **Search & Web** : Actualités moteurs de recherche
- **Web & Mobile Dev** : Frameworks, langages, outils
- **Cloud Computing** : AWS, Azure, GCP, Kubernetes
- **DevOps & Platform Engineering** : CI/CD, IaC, monitoring
- **Cybersécurité** : Vulnérabilités, attaques, correctifs
- **IA & Innovation** : LLM, modèles, recherche
- **Chiffres Clés** : Métriques importantes
- **Insight du jour** : Analyse de marché
- **Impact pour toi** : Actions concrètes
- **À surveiller demain** : Tendances à suivre

#### Sources vérifiées
Liste cliquable des articles sources utilisés par l'IA.

### Actions disponibles

#### Copier le texte
Bouton "Copier texte" en haut à droite :
- Copie l'avis de l'IA + le contenu Markdown
- Prêt à coller dans Word, Notion, Email
- Format propre sans code HTML

#### Retour
Bouton "← Retour" pour revenir à la vue précédente.

## 3. Timeline (Fil d'actualité)

### Vue chronologique

Affiche toutes les revues sous forme de cartes :

```
┌─────────────────────────────────┐
│ Vendredi 08 août 2025           │
│ Par Eurin • Cloud               │
│                                 │
│ AWS lance une nouvelle          │
│ instance Graviton4...           │
│                                 │
│ [27 news] [2.8s] [Voir détail] │
└─────────────────────────────────┘
```

### Informations affichées

- Date formatée avec emoji
- Auteur et catégorie dominante
- Résumé flash (2 lignes)
- Nombre d'actualités
- Temps de génération
- Tags thématiques

### Interaction

Cliquez sur une carte pour afficher la revue complète.

## 4. Historique (Tableau)

### Vue tableau complète

Tableau avec toutes les métadonnées :

| Date | Auteur | Catégorie | Tags | News | Temps | Actions |
|------|--------|-----------|------|------|-------|---------|
| 08/08/25 | Eurin | Cloud | Cloud, K8s | 27 | 2.8s | Voir |

### Fonctionnalités

- **Tri** : Cliquez sur les en-têtes de colonnes
- **Recherche** : Filtrez par date, auteur, tags
- **Pagination** : Naviguez entre les pages
- **Export** : Exportez en CSV (à venir)

### Filtres avancés

- Par catégorie dominante
- Par plage de dates
- Par auteur
- Par nombre d'actualités

## 5. Stats (Analytics)

### Métriques disponibles

#### Vue d'ensemble
- Nombre total de revues générées
- Temps moyen de génération
- Nombre moyen d'actualités par revue
- Catégorie la plus fréquente

#### Graphiques

**Distribution par catégorie**
Camembert montrant la répartition :
- Cloud : 35%
- IA : 28%
- Security : 20%
- DevOps : 12%
- Web : 5%

**Évolution temporelle**
Courbe du nombre de revues par jour/semaine/mois.

**Top tags**
Nuage de mots des tags les plus utilisés.

#### Insights
- Jour de la semaine le plus actif
- Heure de génération préférée
- Tendances émergentes

## Cas d'usage pratiques

### Veille quotidienne personnelle

1. Chaque matin, générez la revue de la veille
2. Lisez le résumé flash (30 secondes)
3. Approfondissez les sections pertinentes
4. Cliquez sur les sources pour en savoir plus

### Newsletter d'équipe

1. Générez la revue hebdomadaire (vendredi)
2. Copiez le contenu
3. Collez dans votre outil de newsletter
4. Ajoutez votre intro personnelle
5. Envoyez à l'équipe

### Préparation de présentation

1. Générez plusieurs revues sur une période
2. Consultez les Stats pour identifier les tendances
3. Extrayez les insights clés
4. Créez vos slides avec les données

### Base de connaissances

1. Générez des revues régulièrement
2. Utilisez l'Historique pour retrouver des infos
3. Recherchez par tags ou catégories
4. Construisez une archive consultable

## Raccourcis clavier

- `Ctrl/Cmd + K` : Focus sur la recherche (Historique)
- `Échap` : Fermer la revue détaillée
- `Ctrl/Cmd + C` : Copier la revue (si ouverte)

## Bonnes pratiques

### Fréquence de génération

- **Quotidienne** : Pour une veille intensive
- **Hebdomadaire** : Pour un résumé des tendances
- **Mensuelle** : Pour une vue macro

### Nommage des pseudos

Utilisez des pseudos cohérents pour faciliter le suivi :
- Votre nom : "Jean Dupont"
- Votre équipe : "Team DevOps"
- Votre projet : "Projet Alpha"

### Organisation des revues

- Marquez les revues importantes en favoris (à venir)
- Ajoutez des notes personnelles (à venir)
- Exportez régulièrement vos archives

## Limitations actuelles

- Génération limitée à 60 requêtes/minute (quota Gemini)
- Pas de modification après génération
- Pas de suppression de revues
- Pas de partage direct par lien

## Prochaines étapes

Consultez la documentation [API et Services](./05-api-services.md) pour comprendre le fonctionnement technique.

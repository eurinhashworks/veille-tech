# Système UI & Expérience Utilisateur

Cette documentation décrit les composants d'interface avancés implémentés pour améliorer l'expérience utilisateur.

## 1. Système de Notifications (Toast)
Le service de Toast permet d'afficher des messages temporaires non intrusifs.

- **Composant** : `components/Toast.tsx`
- **Utilisation** :
  ```tsx
  const { showToast } = useToast();
  showToast('Succès !', 'success'); // Types: success, error, info
  ```
- **Animations** : Gérées par `framer-motion` (entrée par la droite, sortie en fondu).

## 2. États de Chargement (Skeletons)
Utilisés pour réduire la frustration liée aux temps de chargement en affichant une structure "fantôme" de la page.

- **Composant** : `components/Skeleton.tsx`
- **Variantes** :
  - `TimelineSkeleton` : Pour les listes de revues.
  - `ReviewSkeleton` : Pour la page de détail d'une revue.
  - `CardSkeleton` : Pour les petits widgets d'information.

## 3. Transitions de Pages
L'application utilise `AnimatePresence` de Framer Motion pour animer le changement de route.

- **Fichier** : `App.tsx`
- **Logique** : Chaque route est enveloppée dans un `PageWrapper` qui applique un effet de fondu et un léger glissement vertical.

## 4. Gestion des Erreurs (ErrorBoundary)
Un composant `ErrorBoundary` englobe toute l'application pour capturer les erreurs de rendu React et proposer un bouton de rechargement.

- **Fichier** : `components/ErrorBoundary.tsx`

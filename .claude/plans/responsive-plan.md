# Plan — Rendre AFRIKDEV entièrement responsive mobile

## Contexte découvert (différent de la demande initiale)

- **Pas de Tailwind** : le projet utilise du CSS custom sémantique dans `src/App.css` (11 655 lignes) + variables dans `src/index.css`. `package.json` ne contient aucun `tailwindcss`, et `tailwind` est absent de tous les fichiers de config. La demande était « classes Tailwind responsive », mais introduire Tailwind maintenant = refonte totale d'un CSS de 11k lignes + dépendance supplémentaire (contre la contrainte « pas de dépendances externes »).
- **Déjà en place** : menu hamburger + drawer + bottom-nav (JSX complet dans `Navbar.jsx`, breakpoint 768px dans `App.css`), hero mono-colonne < 1024px, tech-cloud déjà en flex wrap (donc automatiquement responsive).

Notre approche = **amélioration ciblée du CSS existant, mobile-first**, en gardant l'identité AFRIKDEV et zéro dépendance.

## Sections à modifier

### 1. Global (`App.css`, ~fin de fichier)
- Ajouter `<meta name="viewport">` si absent dans `index.html`.
- Règle de base bénéfique au mobile : `overflow-wrap: anywhere` sur `.tech-cloud-pill` et les textes longs pour éviter les dépassements à 320px.
- Retirer `-webkit-text-fill-color` écrasant le `color` des grilles… (vérifier — rien trouvé, ignorer).

### 2. Navbar (`App.css`)
- Réduire `height: 70px` → `56px` et padding `0 24px` → `0 12px` sur <640px (laisser plus de place aux icônes).
- Sur <480px : masquer `.lang-selector-btn` (seul le switcher FR|EN du drawer mobile reste), et passer `.nav-auth-btn` en version icône seule si nécessaire.
- `.mobile-drawer` : corriger `margin: 10px 24px` → `margin: 8px 10px` pour ne pas déborder sur petits écrans.
- Sur <640px, garantir que `.mobile-menu-toggle` a une zone de clic ≥ 44px (`width/height: 44px`).

### 3. Hero (`App.css`)
- Règle de base `.badge-pedestal-stage` : `width: 410px` fixe → passer à `width: clamp(260px, 78vw, 410px)` avec `aspect-ratio: 1`, et `.badge-main-image` en `max-width: 100%; height: auto; object-fit: contain`. (Réduit l'image sur mobile selon le requirement.)
- Compenser les cercles concentriques `.badge-radar-ring` (`320px` fixe) → mettre en `width: 78%; aspect-ratio: 1`.
- `< 640px` : `.hero-title` descendant graduellement — `font-size: clamp(1.6rem, 7.2vw, 2.3rem)` (au lieu de 2.3rem fixe à 768px → appliqué aussi <640), réduction du `gap`, `padding: 24px 0 48px`.
- `.hero-cta-group` : passer en `flex-direction: column` + `width: 100%` des boutons pour <480px (empilement propre), `min-height: 48px` sur `.hero-main-btn/.hero-sub-btn`.

### 4. Stats (`App.css`)
- `.hero-stats-bar` : `gap` réduit, padding réduit, et `max-width: 100%` <640px.
- `.stat-number` : `clamp(1.15rem, 5.5vw, 1.55rem)`.
- Les stat-divider restent (alignement centre OK).

### 5. Piliers (`App.css`)
- Vérifier `.pillars-grid-triplet` base : si `repeat(3, 1fr)`, ajouter `@media max-width: 1024px → repeat(1, 1fr)` (ou bien 1 colonne dès <900px). **À lire au moment de l'édition** (bloc 920).
- `.pillar-card` : padding réduit <640px.

### 6. Tech cloud (`App.css`)
- Déjà flex wrap. Ajouter pour <480px : `gap: 6px`, pilhes `font-size: 0.66rem`, et vérifier aucun dépassement horizontal.

## Contraintes
- Conserver `:root` CSS variables et identité AFRIKDEV (bleu cyan, or, emerald).
- Zéro dépendance supplémentaire.
- Animations : désactiver le transform `translateY(-12px)` du `.compose-btn` et la rotation radar sur <480px si janky (option, faible priorité).
- Tester à 320 / 375 / 425 / 640 / 768 via DevTools responsive + `npm run dev` (URL localhost:5173).

## Livrables
- Modifications uniquement dans `src/App.css` (et vérif `index.html`).
- Aucun changement JSX requis (le markup hamburger/drawer existe déjà).
- Résumé des ajustements par breakpoint.

## Risques / à confirmer
- Pas de contre-indication à rompre les breakpoints existants (1024/768/640/500) — on ajoute, on ne remplace pas.
- Le font-size `2.3rem` à 768px devient `clamp(...)` — léger changement visuel sur tablet, cohérent avec mobile-first.

# VNET Consult — Refonte du site

Ce fichier est le contexte persistant du projet pour Claude Code. À lire en premier, à mettre à jour au fil des décisions.

## Statut actuel

Phase d'exploration design terminée. Cinq maquettes HTML statiques ont été produites pour comparer des directions visuelles. La direction retenue est `maquette-5-illustrations.html` : hybride dark engineering avec illustrations SVG d'architecture sur les service cards.

Le site actuel en production est `https://www.vnetconsult.be/` — template IT-consultant générique sans identité. À remplacer intégralement.

## Le client / l'utilisateur

Olivier Malfroidt — fondateur de VNET Consult, ingénieur en infrastructure cloud et on-prem, développeur. Spécialités : architecture Azure, migrations Microsoft 365 & Entra, intégration IA (Copilot, Azure OpenAI), formations & séminaires. Marché : Belgique et Luxembourg, PME et grandes organisations.

Tonalité de voix souhaitée : engineering-first, sans buzzwords, honnête. Anti-corporate-speak. Le ton de la maquette retenue est la référence (« Pas de discours commercial — juste de l'ingénierie qui tient en production »).

## Design system

### Palette
- `--bg`            `#07090f`  Fond principal (dark)
- `--bg-2`          `#0e1220`  Surfaces cards
- `--bg-3`          `#131829`  Surfaces hover
- `--fg`            `#eef1f8`  Texte principal
- `--fg-dim`        `#8a92a7`  Texte secondaire
- `--fg-faint`      `#5a6178`  Texte tertiaire / labels
- `--line`          `rgba(255,255,255,0.07)` Bordures faibles
- `--line-strong`   `rgba(255,255,255,0.14)` Bordures fortes
- `--cyan`          `#4cc9f0`  Accent primaire
- `--violet`        `#8b5cf6`  Accent secondaire
- `--grad`          `linear-gradient(135deg, #4cc9f0 0%, #8b5cf6 100%)` Gradient signature

Palette restreinte volontairement à deux teintes vives. Ne pas ajouter de troisième couleur sans très bonne raison.

### Typographie
- `Inter` (400/500/600/700/800/900) : corps, titres, UI
- `JetBrains Mono` (400/500) : eyebrows, tags, code, labels techniques (`// section`, `01 / cloud-azure`)
- Pas de serif. Pas de display font additionnel.

### Composants visuels signature
- Fond canvas animé : graphe de nœuds dérivants + flux de particules colorées sur courbes de Bézier. Réagit à la souris (lignes violettes vers le curseur).
- Service cards avec illustrations SVG architecturales (200px), grille subtile en fond, bordure gradient au hover.
- Pills avec badge gradient (`NEW`).
- Stats avec gradient text sur les chiffres.
- Mini-canvas dans le bloc À propos qui rejoue le langage graphique à petite échelle.

### Animation
- Pulses CSS (`pulse-fade`) sur dots des illustrations
- Lignes pointillées animées (`dash-flow`) pour les flux
- Orbite lente (`orbit-rotate`) pour la card M365
- Gradient text qui pulse lentement sur les mots-clés du hero
- Background canvas : ~22000px² par nœud, 14-trail particles

## Stack technique recommandé

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Astro 5** | Statique, ultra-rapide, islands pour les animations interactives, parfait pour SEO |
| CSS | **Tailwind CSS 4** | Design system cohérent, build minifié |
| Composants | Astro components + quelques islands React/Solid si besoin pour animations interactives | Garder l'interactivité côté client minimale |
| Contenu | **Content Collections Astro** (Markdown + frontmatter) | Pour blog et études de cas |
| Form contact | Web3Forms ou Formspree | Pas de backend |
| Booking | **Cal.com** intégré (iframe ou widget) | Self-hosted possible plus tard |
| Analytics | **Plausible** ou **Umami** | RGPD-friendly, pas de bandeau cookie nécessaire |
| Hosting | **Cloudflare Pages** | Gratuit, déploiement Git automatique, edge global |
| Domain | `vnetconsult.be` (existant) | Migrer DNS quand prêt |
| i18n | Astro i18n natif | FR par défaut, EN en seconde langue |

Pas de CMS pour démarrer. Le contenu en Markdown dans le repo suffit pour blog + études de cas. Si Olivier veut éventuellement déléguer la rédaction, ajouter **Decap CMS** ou **Tina** plus tard.

## Structure cible du site

```
/                          Accueil (= maquette-5-illustrations)
/services/cloud-azure
/services/microsoft-365
/services/intelligence-artificielle
/services/formations
/approche                  Méthode en 4 temps, valeurs
/cas-clients               Index études de cas
/cas-clients/[slug]        Étude de cas détaillée
/journal                   Index blog technique
/journal/[slug]            Article
/a-propos                  Manifeste + parcours Olivier
/contact                   Form + Cal.com embed
/mentions-legales
/sitemap.xml, /robots.txt, /rss.xml
```

Sitemap auto-généré, RSS pour le journal, OpenGraph par page.

## Pages à construire (priorité)

1. **P0 (MVP déployable)** : Accueil, Services × 4 (versions courtes), À propos, Contact, Mentions légales. → Permet de remplacer l'actuel.
2. **P1** : Pages services détaillées avec contenu approfondi, 2-3 études de cas, blog avec 3 articles d'amorçage.
3. **P2** : EN translation, RSS, sitemap dynamique, OG images automatiques, schema.org.

## Contenu à écrire

Hors scope de la session courante mais à anticiper :
- Manifeste / À propos (texte long, signé)
- 4 pages services détaillées (chacune ~500-800 mots, problèmes types, livrables, FAQ)
- 2-3 études de cas anonymisées (problème → architecture → résultat mesurable)
- 3 articles de blog d'amorçage : un sur Terraform/Azure, un sur Entra Conditional Access, un sur Azure OpenAI/RAG
- Bio + photo réelle d'Olivier (remplacer l'avatar `OM` actuel)
- Au moins 3 logos clients réels (avec accord) ou témoignages

## Conventions de code

- TypeScript strict
- ESLint + Prettier, config standard
- Composants en `kebab-case.astro`, exports `PascalCase`
- Tailwind : pas de classes utilitaires inline > 6, extraire en composant si besoin
- CSS vars Tailwind : toutes les couleurs ci-dessus en `theme.colors` (pas de hardcoded hex dans le code)
- SVG illustrations en `src/components/illustrations/*.astro` (un par service)
- Animations canvas en `src/scripts/*.ts` (network-bg, flow-particles)
- Pas de framework UI lourd (pas de Material, pas de MUI)
- Git : commits sémantiques (feat:, fix:, chore:, docs:, refactor:)

## Référence design canonique

`maquette-5-illustrations.html` à la racine du projet. C'est la **source de vérité visuelle**. Toute décision de design doit être cohérente avec ce qu'elle propose. Les autres maquettes (1-4) sont conservées pour archive mais ne servent plus de référence.

## Premier prompt suggéré pour Claude Code

> Scaffolde un projet Astro 5 + Tailwind 4 dans ce dossier. Utilise `maquette-5-illustrations.html` comme référence design canonique. Commence par : (1) `npm create astro@latest .` avec template minimal, (2) intégrer Tailwind, (3) créer la palette et la typo dans `tailwind.config` selon les CSS vars du CLAUDE.md, (4) extraire le hero, les stats, les services et le footer en composants Astro, (5) extraire les 4 illustrations SVG en `src/components/illustrations/*.astro`, (6) extraire le canvas de fond en `src/scripts/network-bg.ts` chargé via une island. Ne touche pas encore au routing multi-pages, on cadre une page d'accueil propre d'abord.

## Décisions ouvertes

- [ ] Garder ou non l'animation gradient sur les mots-clés du hero (« ingénieur », « discipline »)
- [ ] Mode clair optionnel ou rester en dark only ? (recommandé : dark only pour l'identité)
- [ ] EN dès le MVP ou plus tard ? (recommandé : plus tard)
- [ ] Logo final (le SVG actuel à 3 nœuds est un placeholder fonctionnel mais perfectible)
- [ ] Photographie réelle d'Olivier vs avatar gradient

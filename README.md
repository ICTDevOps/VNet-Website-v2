# VNET Consult — site web (v2)

Refonte du site `vnetconsult.be`. Astro 6 + Tailwind 4, dark, hybride engineering avec illustrations SVG d'architecture sur les service cards.

Pour le contexte projet complet (palette, typo, structure cible, design system, décisions ouvertes), voir [`CLAUDE.md`](./CLAUDE.md).
La maquette HTML de référence est [`maquette-5-illustrations.html`](./maquette-5-illustrations.html).

## Structure

```
src/
├── components/
│   ├── BackgroundFX.astro       # canvas + glows, monte network-bg en island
│   ├── Nav.astro / Hero.astro / Stats.astro / Logos.astro
│   ├── Services.astro           # consomme les 4 illustrations
│   ├── Process.astro / About.astro / CTA.astro / Footer.astro
│   └── illustrations/
│       ├── AzureHubSpoke.astro
│       ├── M365Identity.astro
│       ├── RAGPipeline.astro
│       └── LearningPath.astro
├── layouts/Layout.astro         # html shell + Google Fonts
├── scripts/
│   ├── network-bg.ts            # fond animé global
│   └── about-network.ts         # mini-canvas du bloc À propos
├── pages/index.astro            # composition de la home
└── styles/global.css            # tokens (@theme), keyframes, helpers
```

## Commandes

| Commande          | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installer les dépendances                    |
| `npm run dev`     | Lancer le dev server sur `localhost:4321`    |
| `npm run build`   | Build statique dans `./dist/`                |
| `npm run preview` | Prévisualiser le build localement            |
| `npm run astro`   | CLI Astro (`astro add`, `astro check`, etc.) |

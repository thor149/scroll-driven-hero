# ITZ FIZZ — Scroll-Driven Hero

A single-screen, scroll-driven hero inspired by [the reference](https://paraschaturvedi.github.io/car-scroll-animation). An orange sports coupe travels across the headline, leaving a green trail that turns the letters into dark ink.

- **Live page:** https://thor149.github.io/scroll-driven-hero/
- **Repository:** https://github.com/thor149/scroll-driven-hero

## Preview

| On load | Mid-scroll | End of scroll |
| --- | --- | --- |
| ![On load](docs/preview-hero.png) | ![Mid-scroll](docs/preview-drive.png) | ![End of scroll](docs/preview-finale.png) |

## Assignment requirements

- The hero fills the first viewport and stays sticky during a short scroll journey.
- The letter-spaced headline reveals with a fade and upward stagger on load. All four statistics appear below it with staggered entrances and number count-ups.
- Car movement is controlled by scroll progress, using GSAP ScrollTrigger with a short `scrub: 0.35` interpolation. The car never drives on an autoplay timer.
- The green trail, inked letters, subtle card parallax, and bottom progress line follow the same animation timeline. Scrolling backward reverses the scene. Restart drive returns to the beginning.
- Layered shadows, lighting gradients, a quiet background grid, and restrained perspective tilt on metric cards add depth. Tilt is enabled only for fine pointers with hover support.
- Layout measurements are cached at setup and ScrollTrigger refresh. Scroll updates use transforms and change letter classes only when a threshold is crossed; they do not read layout every frame.
- Intro, scroll, and pointer effects use separate elements to avoid competing transforms. Event listeners and animations are cleaned up on unmount or motion-preference changes.
- Reduced motion shows a static completed scene, final metric values, and no extra scrolling. Text and statistics remain available without JavaScript. Controls have visible keyboard focus and count-up text has stable screen-reader values.
- Responsive layouts include a four-card desktop row, a mobile two-by-two grid, and compact landscape spacing.

The load reveal follows the written assignment. The reference's car, green trail, and headline interaction remain the central visual idea.

## Stack and structure

Next.js 15, React 19, Tailwind CSS 4, HTML/CSS/TypeScript, and GSAP. The car is a lightweight inline SVG; the depth effects use CSS perspective rather than an additional 3D engine.

```text
src/components/Scene.tsx       Intro, scroll, tilt, and restart interactions
src/components/CarTopView.tsx  Instance-safe inline SVG sports coupe
src/app/globals.css           Responsive layout, lighting, depth, and motion preferences
src/data/stats.ts             Metric content and colors
src/lib/gsap.ts               GSAP registration
```

## Run locally

```bash
npm ci
npm run dev
```

## Validate and build

```bash
npx tsc --noEmit
npm run build
```

The production build exports static files into `out/`. To reproduce the GitHub Pages path locally:

```bash
NEXT_PUBLIC_BASE_PATH=/scroll-driven-hero npm run build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`. GitHub Actions installs dependencies, builds with the repository base path, and deploys `out/` to GitHub Pages. For a fork, select **Settings → Pages → Source: GitHub Actions**.

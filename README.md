# Scroll-Driven Hero — ITZ FIZZ

A recreation of the single-screen hero animation from
[paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation),
built with **Next.js**, **React**, **Tailwind CSS** and **GSAP ScrollTrigger**.

- **Live demo:** https://thor149.github.io/scroll-driven-hero/
- **Repository:** https://github.com/thor149/scroll-driven-hero

## Preview

| On load | Mid-scroll | End of scroll |
| --- | --- | --- |
| ![On load](docs/preview-hero.png) | ![Mid-scroll](docs/preview-drive.png) | ![End of scroll](docs/preview-finale.png) |

Everything lives on **one screen**. The headline sits on the road band, the four stat
boxes float above and below it, and the only thing that moves is the car — driving left
to right, painting the green trail, revealing the headline letters one by one and
bringing each stat box into view as it passes.

## Functional requirements

**1. Hero section layout**

- The hero occupies the first screen (above the fold), built on a `100svh` sticky stage.
- Letter-spaced headline `W E L C O M E   I T Z F I Z Z`, split into per-letter elements.
- Four impact metrics with percentages and short descriptions, placed around the band
  (two above, two below) exactly as in the reference.

**2. Initial load animation**

- On load the page shows exactly what the reference does: the road band and the car,
  with the headline letters and the stat boxes still hidden — they belong to the car.
- The band and car fade up gently as the page settles, then everything else is driven
  entirely by scroll.

**3. Scroll-based animation (core feature)**

- The car's position is driven purely by scroll progress through a `ScrollTrigger`,
  so it is tied to scroll and never autoplays.
- `scrub: true` binds the car rigidly to scroll position. There is no smoothing delay,
  so the car can never drift behind the viewport or rubber-band back after the scroll
  stops.
- The green trail is a full-width bar whose `scaleX` is locked to the car's leading edge.
- Each headline letter fades in as solid ink the moment the car's leading edge fully
  covers it — the reference's signature move.
- Each stat box fades and slides in as the car reaches its column, and stays visible.
- The car's stopping point is derived from the measured layout rather than a fixed
  offset, so it always drives far enough for the final letter to clear the bodywork
  while keeping most of the car on screen.

**4. Motion & performance**

- Only `transform` and `opacity` are animated (`translate`, `scale`). The trail is a
  `scaleX` on a full-width element, so scrolling triggers no layout or reflow.
- The headline letters and stat boxes are measured **once** (on mount, on resize, and
  again once web fonts resolve) and compared against precomputed pixel offsets inside the
  scroll callback — no `getBoundingClientRect()` per frame.
- State changes are guarded, so DOM writes only happen when a letter actually flips
  rather than on every scroll tick.
- Transient reads during a ScrollTrigger refresh are suppressed with a `refreshInit`
  guard, so resizes can't produce a wrong intermediate frame.
- `overscroll-behavior-y: none` stops the trackpad/macOS rubber-band bounce that would
  otherwise drag the viewport when scrolling past the end of the pinned scene.
- `prefers-reduced-motion` is respected: the intro is skipped and a static, fully
  readable frame is shown.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, static export) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 + ScrollTrigger (`@gsap/react`) |
| Assets | Inline SVG (the car is drawn in code — no image requests) |
| Hosting | GitHub Pages (GitHub Actions) |

Bootstrap and WordPress were listed as optional extras; they were skipped in favour of a
single, framework-native implementation.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

Production build (static export to `out/`):

```bash
npm run build
npm run preview   # serves the exported site
```

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx        # Inter font, metadata
│  ├─ page.tsx          # renders the scene
│  ├─ globals.css       # Tailwind theme, box placement, pre-animation states
│  └─ icon.svg          # favicon
├─ components/
│  ├─ Scene.tsx         # the single screen: band, headline, car, stat boxes
│  └─ CarTopView.tsx    # inline SVG top-view car
├─ data/
│  └─ stats.ts          # the four metrics and their placement
└─ lib/
   └─ gsap.ts           # single GSAP + ScrollTrigger registration point
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static export
(`output: "export"`) with `NEXT_PUBLIC_BASE_PATH` set to the repository name and publishes
the `out/` directory to GitHub Pages.

To deploy a fork, enable **Settings → Pages → Source: GitHub Actions** — no other change
is required.

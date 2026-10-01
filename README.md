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
to right, painting the green trail and flipping the headline letters to solid ink as it
passes them.

## Functional requirements

**1. Hero section layout**

- The hero occupies the first screen (above the fold), built on a `100svh` sticky stage.
- Letter-spaced headline `W E L C O M E   I T Z F I Z Z`, split into per-letter elements.
- Four impact metrics with percentages and short descriptions, placed around the band
  (two above, two below) exactly as in the reference.

**2. Initial load animation**

- The headline letters fade and rise out of a clipped mask, staggered left to right
  (`power4.out`, 45 ms apart).
- The four stat boxes slide up and fade in one-by-one with a subtle 180 ms delay between
  them, so the load reads as premium rather than abrupt.

**3. Scroll-based animation (core feature)**

- The car's position is driven purely by scroll progress through a `ScrollTrigger`
  with `scrub`, so it is tied to scroll and never autoplays.
- `scrub: 0.5` interpolates between scroll positions, giving the motion an eased,
  fluid feel instead of snapping to discrete scroll events.
- The green trail is a full-width bar whose `scaleX` is locked to the car's leading edge.
- Each headline letter flips from light gray to solid dark the moment the car covers it,
  with a small `back.out` pop — the reference's signature move.
- Each stat box gives a short scale pulse as the car drives beneath it.

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

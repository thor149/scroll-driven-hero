"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { STATS } from "@/data/stats";
import CarTopView from "./CarTopView";

const HEADLINE = "WELCOME ITZFIZZ";

export default function Scene() {
  const root = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const car = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const rootEl = root.current!;
    const bandEl = band.current!;
    const carEl = car.current!;
    const letters = gsap.utils.toArray<HTMLElement>(".headline-letter", rootEl);
    const cards = gsap.utils.toArray<HTMLElement>(".stat-box", rootEl);
    const floats = gsap.utils.toArray<HTMLElement>(".stat-float", rootEl);
    const numbers = gsap.utils.toArray<HTMLElement>("[data-counter]", rootEl);
    const setTrail = gsap.quickSetter(trail.current!, "scaleX");
    const setProgress = gsap.quickSetter(progress.current!, "scaleX");
    const painted = letters.map(() => false);
    const measurements = { width: 0, carWidth: 0, letterX: [] as number[], lastRight: 0 };

    // Measure only on setup/refresh. Intro transforms live inside static letter slots.
    const measure = () => {
      const rect = bandEl.getBoundingClientRect();
      measurements.width = rect.width;
      measurements.carWidth = carEl.offsetWidth;
      measurements.letterX = letters.map((letter) => {
        const slot = letter.parentElement!.getBoundingClientRect();
        return slot.left - rect.left + slot.width / 2;
      });
      measurements.lastRight = letters.at(-1)!.parentElement!.getBoundingClientRect().right - rect.left;
    };
    const endX = () => Math.min(
      Math.max(measurements.lastRight + measurements.carWidth * 0.06, measurements.width - measurements.carWidth),
      measurements.width - measurements.carWidth * 0.22
    );
    const paint = () => {
      const center = Number(gsap.getProperty(carEl, "x")) + measurements.carWidth / 2;
      setTrail(gsap.utils.clamp(0, 1, center / measurements.width));
      letters.forEach((letter, index) => {
        const hit = center >= measurements.letterX[index];
        if (hit !== painted[index]) {
          painted[index] = hit;
          letter.classList.toggle("is-painted", hit);
        }
      });
    };
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      const reduced = context.conditions!.reduced;
      let disposed = false;
      measure();
      if (reduced) {
        gsap.set(carEl, { x: endX() });
        setTrail(1);
        setProgress(1);
        letters.forEach((letter) => letter.classList.add("is-painted"));
        return () => { disposed = true; letters.forEach((letter) => letter.classList.remove("is-painted")); };
      }

      // Separate load animation from scroll and pointer transforms to avoid competing tweens.
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.from("[data-intro]", { opacity: 0, y: 14, duration: 0.7, stagger: 0.08 })
        .from(letters, { opacity: 0, yPercent: 110, duration: 0.85, stagger: 0.035 }, 0.15)
        .from(cards, { opacity: 0, y: 24, duration: 0.85, stagger: 0.12 }, 0.45);
      numbers.forEach((number, index) => {
        const counter = { value: 0 };
        intro.to(counter, {
          value: STATS[index].value, duration: 1.1,
          onUpdate: () => { number.textContent = String(Math.round(counter.value)); },
        }, 0.5 + index * 0.12);
      });

      const drive = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl, start: "top top", end: "bottom bottom",
          scrub: 0.35, invalidateOnRefresh: true,
          onRefreshInit: measure,
          onRefresh: (self) => { paint(); setProgress(self.animation?.progress() ?? self.progress); },
        },
        onUpdate: () => { paint(); setProgress(drive.progress()); },
      });
      drive.fromTo(carEl, { x: () => -measurements.carWidth * 0.72 }, { x: endX, duration: 1, ease: "none" }, 0)
        .fromTo(floats, { y: 0 }, { y: (index) => index % 2 ? -8 : 8, duration: 1, ease: "none" }, 0);
      paint();
      document.fonts?.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
      return () => {
        disposed = true;
        intro.kill();
        drive.scrollTrigger?.kill();
        drive.kill();
        numbers.forEach((number, index) => { number.textContent = String(STATS[index].value); });
        letters.forEach((letter, index) => { letter.classList.remove("is-painted"); painted[index] = false; });
      };
    });

    // Tilt runs only with a fine pointer; bounding boxes are cached on pointer entry.
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cleanups = cards.map((card) => {
        const surface = card.querySelector<HTMLElement>(".stat-surface")!;
        const rotateX = gsap.quickTo(surface, "rotationX", { duration: 0.45, ease: "power3.out" });
        const rotateY = gsap.quickTo(surface, "rotationY", { duration: 0.45, ease: "power3.out" });
        let rect: DOMRect | undefined;
        const enter = () => { rect = card.getBoundingClientRect(); };
        const move = (event: PointerEvent) => {
          if (!rect) return;
          rotateX(gsap.utils.clamp(-5, 5, ((event.clientY - rect.top) / rect.height - 0.5) * -10));
          rotateY(gsap.utils.clamp(-5, 5, ((event.clientX - rect.left) / rect.width - 0.5) * 10));
        };
        const leave = () => { rect = undefined; rotateX(0); rotateY(0); };
        const invalidate = () => { if (rect) leave(); };
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        window.addEventListener("scroll", invalidate, { passive: true });
        window.addEventListener("resize", invalidate);
        return () => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
          window.removeEventListener("scroll", invalidate);
          window.removeEventListener("resize", invalidate);
          rotateX.tween.kill(); rotateY.tween.kill();
          gsap.set(surface, { clearProps: "transform" });
        };
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    });
    return () => mm.revert();
  }, { scope: root });

  const restart = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });

  return (
    <main ref={root} className="scene relative h-[220svh]">
      <section className="stage sticky top-0 h-svh overflow-hidden" aria-label="Scroll-driven motion showcase">
        <header className="scene-header" data-intro>
          <a className="wordmark" href="#" aria-label="ITZ FIZZ — back to start">ITZ<span>FIZZ</span><i aria-hidden="true" /></a>
          <span className="header-note">Small moves. Big impact.</span>
        </header>
        <div className="scene-caption" data-intro>
          <span className="eyebrow"><span aria-hidden="true">01 /</span> MOTION MEETS IMPACT</span>
          <p>A little momentum changes everything.</p>
        </div>

        <div ref={band} className="road-band bg-road absolute inset-x-0 overflow-hidden">
          <div ref={trail} className="trail absolute inset-0" />
          <div className="road-sheen absolute inset-0" aria-hidden="true" />
          <h1 className="headline absolute inset-0 flex items-center font-bold leading-none" aria-label="WELCOME ITZ FIZZ">
            {HEADLINE.split("").map((char, index) => char === " " ? (
              <span key={index} className="headline-space" aria-hidden="true" />
            ) : (
              <span key={index} className="letter-slot flex overflow-hidden" aria-hidden="true">
                <span className="headline-letter inline-block">{char}</span>
              </span>
            ))}
          </h1>
          <div ref={car} className="car absolute inset-y-0 left-0 z-20 flex items-center will-change-transform">
            <CarTopView className="w-auto" style={{ height: "100%" }} />
          </div>
        </div>

        <div className="metrics" aria-label="Impact metrics">
          {STATS.map((stat, index) => (
            <div key={stat.value} className="stat-box" style={{ "--stat-accent": stat.accent, "--stat-ink": stat.ink } as CSSProperties}>
              <div className="stat-float">
                <div className="stat-surface">
                  <span className="stat-index" aria-hidden="true">0{index + 1}<span>↗</span></span>
                  <span className="stat-value"><span className="sr-only">{stat.value}%</span><span aria-hidden="true"><span data-counter>{stat.value}</span><span className="percent">%</span></span></span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="scene-footer" data-intro>
          <span className="scroll-cue"><span aria-hidden="true">↓</span> Scroll to drive</span>
          <button className="restart" onClick={restart}>Restart drive <span aria-hidden="true">↗</span></button>
        </footer>
        <div className="progress-track" aria-hidden="true"><div ref={progress} className="drive-progress" /></div>
      </section>
    </main>
  );
}

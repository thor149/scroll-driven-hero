"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { STATS } from "@/data/stats";
import CarTopView from "./CarTopView";

const HEADLINE = "WELCOME ITZFIZZ";

export default function Scene() {
  const root = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const car = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current!;
      const screenEl = screen.current!;
      const stageEl = rootEl.querySelector<HTMLElement>("[data-stage]")!;
      const bandEl = band.current!;
      const trailEl = trail.current!;
      const carEl = car.current!;

      const letterEls = gsap.utils.toArray<HTMLElement>(".headline-letter", bandEl);
      const boxEls = gsap.utils.toArray<HTMLElement>(".stat-box", screenEl);
      const setTrail = gsap.quickSetter(trailEl, "scaleX") as (value: number) => void;

      const painted = letterEls.map(() => false);
      const boxShown = boxEls.map(() => false);
      const measurements = {
        bandW: 0,
        carW: 0,
        letterX: [] as number[],
        letterRight: 0,
        boxX: [] as number[],
      };
      let refreshing = false;

      const measure = () => {
        const bandRect = bandEl.getBoundingClientRect();
        measurements.bandW = bandRect.width || window.innerWidth;
        measurements.carW = carEl.getBoundingClientRect().width;
        measurements.letterX = letterEls.map((el) => {
          const rect = el.getBoundingClientRect();
          return rect.left - bandRect.left + rect.width / 2;
        });
        const lastLetter = letterEls[letterEls.length - 1];
        measurements.letterRight = lastLetter
          ? lastLetter.getBoundingClientRect().right - bandRect.left
          : measurements.bandW * 0.7;
        measurements.boxX = boxEls.map((el) => {
          const rect = el.getBoundingClientRect();
          return rect.left - bandRect.left + rect.width / 2;
        });
      };

      // The car drives far enough that its front (left) edge clears the final
      // letter, so the whole headline is revealed and is never left hidden
      // underneath the car body, while still leaving a good part of the car
      // visible on screen at the end of the scroll.
      const endX = () => {
        const clearance = measurements.carW * 0.06;
        const pastLastLetter = measurements.letterRight + clearance;
        return Math.min(
          Math.max(pastLastLetter, measurements.bandW - measurements.carW),
          measurements.bandW - measurements.carW * 0.22
        );
      };

      const updateScene = (x: number) => {
        const { bandW, carW, letterX, boxX } = measurements;
        if (!bandW) return;

        const carCenter = x + carW / 2;
        setTrail(gsap.utils.clamp(0, 1, carCenter / bandW));

        // A letter flips to ink once the car's leading edge has fully covered it.
        letterEls.forEach((el, index) => {
          const threshold = letterX[index];
          const hit = painted[index]
            ? carCenter > threshold - 10
            : carCenter >= threshold + 10;
          if (hit === painted[index]) return;

          painted[index] = hit;
          el.classList.toggle("is-painted", hit);
        });

        // A stat box appears (and stays) once the car has reached its column.
        boxEls.forEach((el, index) => {
          const reached = carCenter >= boxX[index];
          if (reached === boxShown[index]) return;

          boxShown[index] = reached;
          gsap.to(el, {
            autoAlpha: reached ? 1 : 0,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      const handleRefreshInit = () => {
        refreshing = true;
        measure();
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        measure();
        ScrollTrigger.addEventListener("refreshInit", handleRefreshInit);

        // Load reveal: the stage fades in gently. The headline letters and the
        // stat boxes deliberately stay hidden here — they belong to the car,
        // which paints them in as it drives (matching the reference). Only
        // opacity on the container is animated, so it never competes with the
        // car scroll tween below.
        const intro = gsap.fromTo(
          stageEl,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: "power2.out" }
        );

        // The car is bound rigidly to scroll progress (scrub: true) so it can
        // never lag behind or rubber-band against the viewport.
        const tween = gsap.fromTo(
          carEl,
          { x: () => -measurements.carW * 0.72 },
          {
            x: () => endX(),
            ease: "none",
            onUpdate: () => {
              if (refreshing) return;
              updateScene(gsap.getProperty(carEl, "x") as number);
            },
            scrollTrigger: {
              trigger: rootEl,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: () => {
                refreshing = false;
                requestAnimationFrame(() => {
                  updateScene(gsap.getProperty(carEl, "x") as number);
                });
              },
            },
          }
        );

        updateScene(gsap.getProperty(carEl, "x") as number);

        if (document.fonts?.ready) {
          document.fonts.ready.then(() => {
            measure();
            ScrollTrigger.refresh();
          });
        }

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", handleRefreshInit);
          intro.kill();
          tween.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        measure();
        gsap.set(carEl, { x: endX() });
        setTrail(1);
        letterEls.forEach((el) => el.classList.add("is-painted"));
        gsap.set(boxEls, { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="scene relative h-[200vh]">
      <div ref={screen} data-stage className="sticky top-0 h-svh overflow-hidden">
        <div
          ref={band}
          className="bg-road absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden"
          style={{ height: "var(--band-h)" }}
        >
          <div ref={trail} className="trail absolute inset-0" />

          <h1
            className="absolute inset-0 flex items-center pl-[5%] font-bold leading-none"
            style={{ fontSize: "var(--headline-size)" }}
            aria-label="WELCOME ITZ FIZZ"
          >
            {HEADLINE.split("").map((char, index) =>
              char === " " ? (
                <span
                  key={index}
                  className="inline-block"
                  style={{ width: "0.55em" }}
                  aria-hidden="true"
                />
              ) : (
                <span
                  key={index}
                  className="flex overflow-hidden"
                  style={{ height: "1.05em", marginRight: "0.14em" }}
                  aria-hidden="true"
                >
                  <span data-anim="letter" className="headline-letter inline-block">
                    {char}
                  </span>
                </span>
              )
            )}
          </h1>

          <div
            ref={car}
            className="absolute inset-y-0 left-0 z-20 flex items-center will-change-transform"
          >
            <CarTopView className="w-auto" style={{ height: "100%" }} />
          </div>
        </div>

        {STATS.map((stat) => (
          <div
            key={stat.value}
            className="stat-box absolute"
            style={
              {
                "--box-top": stat.desktop.top,
                "--box-left": stat.desktop.left,
                "--box-width": stat.desktop.width,
                "--box-top-sm": stat.mobile.top,
                "--box-left-sm": stat.mobile.left,
                "--box-width-sm": stat.mobile.width,
                backgroundColor: stat.accent,
                color: stat.ink,
              } as React.CSSProperties
            }
          >
            <span
              className="block font-bold leading-none tabular-nums"
              style={{ fontSize: "clamp(1.5rem, 3.2vw, 3.25rem)" }}
            >
              {stat.value}%
            </span>
            <span
              className="mt-[0.45em] block leading-snug"
              style={{ fontSize: "clamp(0.62rem, 0.92vw, 1rem)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

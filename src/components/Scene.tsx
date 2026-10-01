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
      const bandEl = band.current!;
      const trailEl = trail.current!;
      const carEl = car.current!;

      const letterEls = gsap.utils.toArray<HTMLElement>(".headline-letter", bandEl);
      const boxEls = gsap.utils.toArray<HTMLElement>(".stat-box", screenEl);
      const setTrail = gsap.quickSetter(trailEl, "scaleX") as (value: number) => void;

      const painted = letterEls.map(() => false);
      const boxArmed = boxEls.map(() => true);
      const measurements = {
        bandW: 0,
        carW: 0,
        letterX: [] as number[],
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
        measurements.boxX = boxEls.map((el) => {
          const rect = el.getBoundingClientRect();
          return rect.left - bandRect.left + rect.width / 2;
        });
      };

      const updateScene = (x: number) => {
        const { bandW, carW, letterX, boxX } = measurements;
        if (!bandW) return;

        const carCenter = x + carW / 2;
        setTrail(gsap.utils.clamp(0, 1, carCenter / bandW));

        letterEls.forEach((el, index) => {
          const threshold = letterX[index];
          const hit = painted[index]
            ? carCenter > threshold - 10
            : carCenter >= threshold + 10;
          if (hit === painted[index]) return;

          painted[index] = hit;
          el.classList.toggle("is-painted", hit);

          if (hit) {
            gsap.fromTo(
              el,
              { scale: 0.86 },
              { scale: 1, duration: 0.45, ease: "back.out(2.4)", overwrite: "auto" }
            );
          }
        });

        boxEls.forEach((el, index) => {
          const near = Math.abs(carCenter - boxX[index]) < 16;

          if (near && boxArmed[index]) {
            boxArmed[index] = false;
            gsap.fromTo(
              el,
              { scale: 1 },
              {
                scale: 1.05,
                duration: 0.16,
                yoyo: true,
                repeat: 1,
                ease: "power2.out",
                overwrite: "auto",
              }
            );
          } else if (!near && !boxArmed[index]) {
            boxArmed[index] = true;
          }
        });
      };

      const handleRefreshInit = () => {
        refreshing = true;
        measure();
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(screenEl);

        measure();
        ScrollTrigger.addEventListener("refreshInit", handleRefreshInit);

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .to(
            q("[data-anim='letter']"),
            { y: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out", stagger: 0.045 },
            0.15
          )
          .to(
            q("[data-anim='box']"),
            { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.18 },
            0.7
          );

        const tween = gsap.fromTo(
          carEl,
          { x: () => -measurements.carW },
          {
            x: () => measurements.bandW - measurements.carW * 0.55,
            ease: "none",
            onUpdate: () => {
              if (refreshing) return;
              updateScene(gsap.getProperty(carEl, "x") as number);
            },
            scrollTrigger: {
              trigger: rootEl,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
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
        gsap.set(carEl, { x: measurements.bandW - measurements.carW * 0.55 });
        setTrail(1);
        letterEls.forEach((el) => el.classList.add("is-painted"));
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="scene relative h-[200vh]">
      <div ref={screen} className="sticky top-0 h-svh overflow-hidden">
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
            data-anim="box"
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

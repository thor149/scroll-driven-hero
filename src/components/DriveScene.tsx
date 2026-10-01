"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { STATS } from "@/data/stats";
import CarTopView from "./CarTopView";

const WORDMARK = ["ITZ", "FIZZ"];
const CARD_THRESHOLDS = [0.16, 0.38, 0.58, 0.78];
const CARD_HYSTERESIS = 0.06;

export default function DriveScene() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const car = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current!;
      const stageEl = stage.current!;
      const carEl = car.current!;
      const trailEl = trail.current!;
      const railEl = rail.current!;
      const wordmarkEl = wordmark.current!;
      const readoutEl = readout.current!;

      const letterEls = gsap.utils.toArray<HTMLElement>(".ghost-letter", stageEl);
      const cardEls = gsap.utils.toArray<HTMLElement>(".drive-card", stageEl);
      const setTrail = gsap.quickSetter(trailEl, "scaleX") as (value: number) => void;

      const painted = letterEls.map(() => false);
      const cardShown = cardEls.map(() => false);
      const measurements = { vw: 0, carW: 0, letterX: [] as number[] };
      let refreshing = false;

      const measure = () => {
        const stageRect = stageEl.getBoundingClientRect();
        measurements.vw = stageRect.width || window.innerWidth;
        measurements.carW = carEl.getBoundingClientRect().width;
        measurements.letterX = letterEls.map((el) => {
          const elRect = el.getBoundingClientRect();
          return elRect.left - stageRect.left + elRect.width / 2;
        });
      };

      const updateCar = (x: number) => {
        const { vw, carW, letterX } = measurements;
        if (!vw) return;

        const carCenter = x + carW / 2;
        setTrail(gsap.utils.clamp(0, 1, carCenter / vw));

        letterEls.forEach((el, index) => {
          const threshold = letterX[index];
          const hit = painted[index]
            ? carCenter > threshold - 12
            : carCenter >= threshold + 12;
          if (hit === painted[index]) return;

          painted[index] = hit;
          el.classList.toggle("is-painted", hit);

          if (hit) {
            gsap.fromTo(
              el,
              { scale: 0.88 },
              { scale: 1, duration: 0.45, ease: "back.out(2.4)", overwrite: "auto" }
            );
          }
        });
      };

      const updateHud = (progress: number) => {
        cardEls.forEach((el, index) => {
          const showAt = CARD_THRESHOLDS[index];
          const show = cardShown[index]
            ? progress > showAt - CARD_HYSTERESIS
            : progress >= showAt;
          if (show === cardShown[index]) return;

          cardShown[index] = show;
          gsap.to(
            el,
            show
              ? { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }
              : { autoAlpha: 0, y: 24, scale: 0.96, duration: 0.3, ease: "power2.in" }
          );
        });

        gsap.set(railEl, { scaleX: progress });

        const percent = String(Math.round(progress * 100));
        if (readoutEl.textContent !== percent) readoutEl.textContent = percent;
      };

      const handleRefreshInit = () => {
        refreshing = true;
        measure();
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        measure();
        ScrollTrigger.addEventListener("refreshInit", handleRefreshInit);

        const tween = gsap.fromTo(
          carEl,
          { x: () => -measurements.carW },
          {
            x: () => measurements.vw + 12,
            ease: "none",
            onUpdate: () => {
              if (refreshing) return;
              updateCar(gsap.getProperty(carEl, "x") as number);
            },
            scrollTrigger: {
              trigger: rootEl,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => updateHud(self.progress),
              onRefresh: (self) => {
                refreshing = false;
                updateHud(self.progress);
              },
            },
          }
        );

        gsap.from(wordmarkEl, {
          autoAlpha: 0,
          y: 48,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootEl,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        });

        const trigger = tween.scrollTrigger;
        updateHud(trigger ? trigger.progress : 0);
        updateCar(gsap.getProperty(carEl, "x") as number);

        if (document.fonts?.ready) {
          document.fonts.ready.then(() => {
            measure();
            ScrollTrigger.refresh();
          });
        }

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", handleRefreshInit);
          tween.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        measure();
        gsap.set(carEl, { x: measurements.vw * 0.42 });
        setTrail(0.55);
        gsap.set(cardEls, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(railEl, { scaleX: 0.5 });
        readoutEl.textContent = "50";
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative h-[280vh]">
      <div
        ref={stage}
        className="drive-stage sticky top-0 flex h-svh flex-col overflow-hidden"
      >
        <div className="relative z-40 flex items-center justify-between px-5 pt-6 sm:px-10">
          <span className="font-display text-[11px] tracking-[0.35em] text-white/45 sm:text-xs">
            02 / THE DRIVE
          </span>
          <span className="font-display text-[11px] tracking-[0.35em] text-white/45 sm:text-xs">
            PROGRESS{" "}
            <span
              ref={readout}
              className="inline-block w-[3ch] text-right text-lime tabular-nums"
            >
              0
            </span>
            %
          </span>
        </div>

        <div
          ref={rail}
          className="relative z-40 mt-4 h-px w-full origin-left bg-linear-to-r from-lime to-acid"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="relative z-30 mt-[6vh] px-5 sm:px-10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                data-anim="card"
                className="drive-card rounded-2xl p-4 sm:p-5"
                style={{ backgroundColor: stat.accent }}
              >
                <span className="block font-display text-2xl leading-none font-bold text-ink tabular-nums sm:text-3xl">
                  {stat.value}%
                </span>
                <span className="mt-2 block text-[11px] leading-snug font-medium text-ink/70 sm:text-xs">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-auto px-5 sm:px-10">
          <p className="mx-auto max-w-6xl font-display text-[clamp(1.35rem,2.6vw,2.25rem)] font-semibold tracking-tight text-white/[0.13]">
            MOTION, MEASURED.
          </p>
        </div>

        <div className="relative z-20 mt-[3vh] mb-[18vh] sm:mb-[22vh]">
          <div className="road relative h-[var(--road-h)]">
            <div className="road-lane absolute inset-x-0 top-[24%] h-px" />
            <div className="road-lane absolute inset-x-0 bottom-[24%] h-px" />

            <div ref={trail} className="trail absolute inset-0" />

            <div
              ref={wordmark}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            >
              <span
                className="flex items-center gap-[1em] font-display leading-none font-bold"
                style={{ fontSize: "var(--wordmark-size)" }}
              >
                {WORDMARK.map((word) => (
                  <span key={word} className="flex gap-[0.34em]">
                    {word.split("").map((char, index) => (
                      <span
                        key={`${char}-${index}`}
                        className="ghost-letter inline-block"
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </div>

            <div
              ref={car}
              className="absolute inset-y-0 left-0 z-20 flex items-center will-change-transform"
            >
              <CarTopView className="w-auto" style={{ height: "var(--car-h)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { STATS } from "@/data/stats";

const WORDS = ["WELCOME", "ITZ", "FIZZ"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current!;
      const q = gsap.utils.selector(scope);
      const numbers = gsap.utils.toArray<HTMLElement>("[data-count]", scope);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        numbers.forEach((el) => {
          el.textContent = "0";
        });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(q("[data-anim='fade']"), { autoAlpha: 1, duration: 0.6, stagger: 0.1 }, 0.2)
          .to(
            q("[data-anim='letter']"),
            { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.04 },
            0.45
          )
          .to(
            q("[data-anim='rise']"),
            { y: 0, opacity: 1, duration: 0.85, stagger: 0.12 },
            1.15
          );

        numbers.forEach((el, index) => {
          const target = Number(el.dataset.count ?? 0);
          const counter = { value: 0 };

          tl.to(
            counter,
            {
              value: target,
              duration: 1.1,
              ease: "power2.out",
              snap: { value: 1 },
              onUpdate: () => {
                el.textContent = String(counter.value);
              },
            },
            1.2 + index * 0.12
          );
        });

        gsap.to(q("[data-hero-inner]"), {
          yPercent: -12,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "bottom 30%",
            scrub: 0.5,
          },
        });

        gsap.to(q("[data-hero-cue]"), {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "35% top",
            scrub: 0.4,
          },
        });

        gsap.fromTo(
          q("[data-cue-dot]"),
          { y: -26, autoAlpha: 0 },
          {
            y: 26,
            autoAlpha: 1,
            duration: 1.4,
            ease: "sine.inOut",
            repeat: -1,
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <header className="relative z-20 flex items-center justify-between px-5 pt-6 sm:px-10">
        <span data-anim="fade" className="font-display text-sm font-semibold tracking-[0.3em]">
          ITZ FIZZ<span className="text-lime">.</span>
        </span>
        <span
          data-anim="fade"
          className="hidden text-[11px] tracking-[0.3em] text-white/40 sm:block"
        >
          GSAP SCROLLTRIGGER × NEXT.JS
        </span>
      </header>

      <div
        data-hero-inner
        className="relative z-10 flex flex-1 flex-col justify-center px-5 py-14 sm:px-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p
            data-anim="fade"
            className="mb-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.4em] text-lime/90 sm:text-xs"
          >
            <span className="h-px w-8 bg-lime/70" />
            SCROLL-DRIVEN EXPERIENCE
          </p>

          <h1 className="flex flex-wrap items-baseline gap-x-[0.5em] gap-y-1 font-display text-[clamp(2.6rem,7.4vw,6.75rem)] leading-[0.95] font-bold tracking-tight">
            {WORDS.map((word) => (
              <span key={word} className="flex gap-[0.14em] overflow-hidden pb-[0.06em]">
                {word.split("").map((char, index) => (
                  <span key={`${char}-${index}`} data-anim="letter" className="inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p
            data-anim="rise"
            className="mt-7 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base"
          >
            A hero that moves with you. Every frame is driven by scroll position —
            eased, interpolated and built on transforms only.
          </p>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
            {STATS.map((stat) => (
              <li
                key={stat.label}
                data-anim="rise"
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-white/25 sm:p-5"
              >
                <span className="flex items-baseline gap-1">
                  <span
                    data-count={stat.value}
                    className="font-display text-3xl font-bold tabular-nums sm:text-4xl"
                    style={{ color: stat.accent }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="font-display text-lg font-semibold sm:text-xl"
                    style={{ color: stat.accent }}
                  >
                    %
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-snug text-white/50 sm:text-sm">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        data-hero-cue
        className="relative z-10 mb-5 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.4em] text-white/35">SCROLL TO DRIVE</span>
        <span className="relative block h-14 w-px overflow-hidden bg-white/10">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span data-cue-dot className="block h-3 w-1 rounded-full bg-lime" />
          </span>
        </span>
      </div>

      <div className="road relative z-0 h-16 shrink-0 sm:h-20" aria-hidden="true">
        <div className="road-lane absolute inset-x-0 top-1/2 h-px" />
      </div>
    </section>
  );
}

import { REPO_URL } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-5 py-14 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.3em]">
            ITZ FIZZ<span className="text-lime">.</span>
          </p>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-white/40">
            Scroll-driven hero built with Next.js, Tailwind CSS and GSAP
            ScrollTrigger. Motion runs on transforms and is interpolated from
            scroll progress.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-white/50">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-lime"
          >
            GitHub
          </a>
          <a href="#top" className="transition-colors hover:text-lime">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}

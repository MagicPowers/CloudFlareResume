"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useSite } from "@/lib/site-state";

/**
 * Lenis momentum scroll. Disabled entirely in recruiter mode and for anyone
 * who has asked their OS for reduced motion — in both cases native scroll is
 * the correct answer.
 */
export function SmoothScroll() {
  const { recruiterMode } = useSite();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || recruiterMode) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Let anchor links and the command palette drive the same scroller.
    const onScrollTo = (e: Event) => {
      const detail = (e as CustomEvent<{ target: string; offset?: number }>).detail;
      const el = document.querySelector(detail.target);
      if (el) lenis.scrollTo(el as HTMLElement, { offset: detail.offset ?? -80 });
    };
    window.addEventListener("dp:scroll-to", onScrollTo);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("dp:scroll-to", onScrollTo);
      lenis.destroy();
    };
  }, [recruiterMode]);

  return null;
}

/** Scrolls to a selector through Lenis when it's running, natively when it isn't. */
export function scrollToSection(selector: string, offset = -80) {
  const el = document.querySelector(selector);
  if (!el) return;
  window.dispatchEvent(
    new CustomEvent("dp:scroll-to", { detail: { target: selector, offset } }),
  );
  // Fallback for when Lenis isn't mounted (recruiter / reduced motion).
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || document.documentElement.dataset.recruiter === "on") {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "auto" });
  }
}

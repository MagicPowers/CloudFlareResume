"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { Command, Eye, EyeOff, TerminalSquare } from "lucide-react";
import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { useIsApplePlatform, useSite } from "@/lib/site-state";
import { scrollToSection } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";

export function Nav() {
  const { setPaletteOpen, setTerminalOpen, recruiterMode, setRecruiterMode } = useSite();
  const { scrollY } = useScroll();
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState<string>("");
  const isMac = useIsApplePlatform();

  useMotionValueEvent(scrollY, "change", (v) => setStuck(v > 40));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        animate={{
          backgroundColor: stuck ? "rgba(8,8,10,0.72)" : "rgba(8,8,10,0)",
          borderBottomColor: stuck ? "rgba(38,38,46,1)" : "rgba(38,38,46,0)",
          backdropFilter: stuck ? "blur(16px)" : "blur(0px)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="border-b"
      >
        <nav className="container-page flex h-16 items-center justify-between gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="relative grid size-8 place-items-center rounded-md border border-line bg-surface-2 font-mono text-[11px] font-medium tracking-tight text-accent">
              {profile.initials}
              <span className="absolute inset-0 rounded-md ring-1 ring-accent/0 transition group-hover:ring-accent/40" />
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:block">
              {profile.name}
            </span>
          </button>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {sections
              .filter((s) => s.nav)
              .map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToSection(`#${s.id}`)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
                      active === s.id
                        ? "text-fg"
                        : "text-fg-dim hover:text-fg",
                    )}
                  >
                    {active === s.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-surface-2 ring-1 ring-line"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{s.label}</span>
                  </button>
                </li>
              ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => setRecruiterMode(!recruiterMode)}
              title={
                recruiterMode
                  ? "Recruiter mode is on — click for the full experience"
                  : "Recruiter mode: dense, no animation, everything on one screen"
              }
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] transition",
                recruiterMode
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line bg-surface-2 text-fg-dim hover:text-fg",
              )}
            >
              {recruiterMode ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              <span className="hidden sm:inline">Recruiter</span>
            </button>

            <button
              onClick={() => setTerminalOpen(true)}
              title="Open the terminal (` key)"
              className="hidden size-8 place-items-center rounded-full border border-line bg-surface-2 text-fg-dim transition hover:text-fg sm:grid"
            >
              <TerminalSquare className="size-3.5" />
            </button>

            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-8 items-center gap-2 rounded-full border border-line bg-surface-2 pl-3 pr-1.5 text-[12px] text-fg-dim transition hover:text-fg"
            >
              <Command className="size-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border border-line bg-ink px-1.5 py-0.5 font-mono text-[10px] md:inline">
                {isMac ? "⌘" : "Ctrl"}K
              </kbd>
            </button>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {recruiterMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-accent/20 bg-accent/[0.06]"
          >
            <p className="container-page py-2 font-mono text-[11px] text-accent/90">
              Recruiter mode — animation off, density up.{" "}
              <a href="/cv" className="underline underline-offset-2">
                Printable one-page CV
              </a>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

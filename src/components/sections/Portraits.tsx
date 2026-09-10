"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { portraits } from "@/data/portraits";
import { roles } from "@/data/experience";
import { yearOf, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { useSite } from "@/lib/site-state";

/** The role held in a given year, if any. */
function roleInYear(year: number) {
  return roles.find((r) => {
    const start = yearOf(r.start);
    const end = yearOf(r.end);
    return year >= start && year <= end;
  });
}

export function Portraits() {
  const { recruiterMode } = useSite();
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.5 });

  const current = portraits[index];
  const role = roleInYear(current.year);

  const stop = useCallback(() => setTouched(true), []);

  // Walk forward on its own until someone takes the handle. It's a scrubber —
  // people need to see it move once to realise they can drag it.
  useEffect(() => {
    if (!inView || touched || recruiterMode) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Slow enough to read the story that goes with each one.
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1 < portraits.length ? i + 1 : i));
    }, 3200);
    return () => window.clearInterval(id);
  }, [inView, touched, recruiterMode]);

  return (
    <section id="portraits" className="container-page scroll-mt-24 py-24 sm:py-36">
      <SectionHeader
        index="03"
        eyebrow="A decade, from the neck up"
        title={
          <>
            Eleven years of headshots,
            <span className="italic text-fg-dim"> and one very committed beard</span>
          </>
        }
        lede="Every professional photo taken of me since graduating, in order. Drag the handle. The beard is doing a lot of narrative work here — and at one point, some genuine good."
        className="mb-12"
      />

      <div ref={wrapRef} className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        {/* Portrait */}
        <Reveal direction="none" className="relative">
          <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-line bg-surface-2">
            {portraits.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.src}
                src={p.src}
                alt={`David Power, ${p.year}`}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === index ? "opacity-100" : "opacity-0",
                )}
                style={{ objectPosition: p.focus ?? "50% 20%" }}
              />
            ))}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={current.src}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-2"
                >
                  <span className="font-display text-5xl leading-none tracking-tight tabular-nums text-fg">
                    {current.year}
                  </span>
                  {current.month && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-dim">
                      {current.month}
                    </span>
                  )}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                {index + 1} / {portraits.length}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Caption + control */}
        <Reveal delay={0.08} className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.src}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                {role ? (
                  <p className="eyebrow" style={{ color: role.accent }}>
                    {role.title} · {role.company}
                  </p>
                ) : (
                  <p className="eyebrow">Between chapters</p>
                )}
                {current.tag && (
                  <span className="rounded-full border border-accent/35 bg-accent/[0.08] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {current.tag}
                  </span>
                )}
              </div>

              <p className="max-w-[34ch] text-balance font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.2] tracking-[-0.015em]">
                {current.note}
              </p>

              {current.story && (
                <p className="mt-4 max-w-[52ch] text-[14.5px] leading-relaxed text-fg-dim">
                  {current.story}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Scrubber. A real range input, so keyboard, touch and screen
              readers all work without me reimplementing any of it. */}
          <div className="mt-10">
            <label htmlFor="portrait-scrubber" className="sr-only">
              Choose a year between {portraits[0].year} and{" "}
              {portraits[portraits.length - 1].year}
            </label>
            <input
              id="portrait-scrubber"
              type="range"
              min={0}
              max={portraits.length - 1}
              step={1}
              value={index}
              onChange={(e) => {
                stop();
                setIndex(Number(e.target.value));
              }}
              onPointerDown={stop}
              onKeyDown={stop}
              aria-valuetext={`${current.year}`}
              className="scrubber w-full"
              style={
                {
                  "--fill": `${(index / (portraits.length - 1)) * 100}%`,
                } as React.CSSProperties
              }
            />

            <div className="mt-3 flex justify-between">
              {portraits.map((p, i) => {
                // Two shots can share a year. Label the first, mark the rest
                // with a dot, so the axis never reads "25 25".
                const repeat = i > 0 && portraits[i - 1].year === p.year;
                return (
                  <button
                    key={p.src}
                    onClick={() => {
                      stop();
                      setIndex(i);
                    }}
                    aria-label={`Show ${p.month ? `${p.month} ` : ""}${p.year}`}
                    className={cn(
                      "font-mono text-[10.5px] tabular-nums transition-colors",
                      i === index ? "text-accent" : "text-fg-faint hover:text-fg-dim",
                    )}
                  >
                    {repeat ? "·" : `’${String(p.year).slice(2)}`}
                  </button>
                );
              })}
            </div>

            <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-faint">
              {touched ? "Drag or use arrow keys" : "Playing — grab the handle"}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

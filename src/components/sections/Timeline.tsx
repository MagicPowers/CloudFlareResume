"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Minus, MoveHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import { timelineSorted, KIND_LABEL, type Milestone } from "@/data/timeline";
import { photosByEra } from "@/data/gallery";
import { formatMonth, toDate, clamp, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSite } from "@/lib/site-state";

const START_YEAR = 2011;
const END_YEAR = new Date().getFullYear() + 1;
const YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

const MIN_ZOOM = 240;
const MAX_ZOOM = 780;
const EDGE_PAD = 260;

const KIND_DOT: Record<Milestone["kind"], string> = {
  role: "◆",
  ship: "▲",
  study: "●",
  life: "✦",
  team: "■",
};

function useViewport() {
  const [size, setSize] = useState({ w: 1440, h: 900 });
  useLayoutEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function MilestoneCard({
  m,
  above,
  active,
}: {
  m: Milestone;
  above: boolean;
  active: boolean;
}) {
  const photos = photosByEra(m.era).slice(0, 2);

  return (
    <article
      className={cn(
        "w-[260px] rounded-xl border bg-surface/85 p-4 backdrop-blur-md transition-all duration-500",
        active
          ? "border-[var(--c)]/45 shadow-[0_0_0_1px_var(--c-a),0_18px_50px_-24px_var(--c-a)]"
          : "border-line",
        m.major && "w-[300px]",
      )}
      style={
        {
          "--c": m.colour,
          "--c-a": `${m.colour}33`,
        } as React.CSSProperties
      }
    >
      <header className="flex items-center gap-2">
        <span className="font-mono text-[10px]" style={{ color: m.colour }}>
          {KIND_DOT[m.kind]}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
          {KIND_LABEL[m.kind]}
        </span>
        <span className="ml-auto font-mono text-[10px] text-fg-faint">
          {formatMonth(m.at)}
        </span>
      </header>

      <h3 className="mt-2.5 text-balance font-display text-[19px] leading-tight tracking-tight">
        {m.title}
      </h3>
      {m.org && (
        <p className="mt-1 text-[12px]" style={{ color: m.colour }}>
          {m.org}
        </p>
      )}
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-fg-dim">{m.detail}</p>

      {photos.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {photos.map((p) => (
            <div
              key={p.src}
              className="relative aspect-4/3 overflow-hidden rounded-md border border-line"
            >
              <Image
                src={p.src}
                alt={p.caption ?? m.title}
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 h-8 w-px -translate-x-1/2",
          above ? "top-full" : "bottom-full",
        )}
        style={{ background: `linear-gradient(${above ? "180deg" : "0deg"}, ${m.colour}, transparent)` }}
      />
    </article>
  );
}

/* ------------------------------------------------------------------ */

function HorizontalTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { w: vw, h: vh } = useViewport();
  const [zoom, setZoom] = useState(420);
  const [activeIdx, setActiveIdx] = useState(0);

  const span = END_YEAR - START_YEAR;
  const trackWidth = span * zoom + EDGE_PAD * 2;
  const distance = Math.max(trackWidth - vw, 1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0005,
  });

  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progressScale = useTransform(smooth, [0, 1], [0, 1]);

  const startMs = new Date(START_YEAR, 0, 1).getTime();
  const endMs = new Date(END_YEAR, 0, 1).getTime();

  const positionOf = useCallback(
    (at: string) => {
      const t = toDate(at).getTime();
      return EDGE_PAD + ((t - startMs) / (endMs - startMs)) * (span * zoom);
    },
    [endMs, span, startMs, zoom],
  );

  const placed = useMemo(() => {
    // Alternate above and below the spine, always choosing whichever lane the
    // previous card is furthest from, so neighbouring cards never collide.
    const lastUsed = { above: -Infinity, below: -Infinity };
    const result: { m: Milestone; left: number; above: boolean }[] = [];

    for (const m of timelineSorted) {
      const left = positionOf(m.at);
      const above = left - lastUsed.above > left - lastUsed.below;
      if (above) lastUsed.above = left;
      else lastUsed.below = left;
      result.push({ m, left, above });
    }
    return result;
  }, [positionOf]);

  useEffect(() => {
    const unsub = smooth.on("change", (v) => {
      const centre = v * distance + vw / 2;
      let best = 0;
      let bestDist = Infinity;
      placed.forEach(({ left }, i) => {
        const d = Math.abs(left - centre);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIdx(best);
    });
    return () => unsub();
  }, [smooth, distance, vw, placed]);

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${distance + vh}px` }}
    >
      <div className="sticky top-0 isolate h-[100svh] overflow-hidden">
        {/* Ambient wash tinted by the active chapter */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-700"
          style={{
            background: `radial-gradient(60% 55% at 50% 55%, ${placed[activeIdx]?.m.colour}12, transparent 70%)`,
          }}
        />

        <div className="container-page flex h-32 items-end justify-between pb-4 pt-[calc(var(--nav-h)+1rem)]">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">Timeline</span>
            <motion.span
              key={placed[activeIdx]?.m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-2xl tracking-tight"
              style={{ color: placed[activeIdx]?.m.colour }}
            >
              {formatMonth(placed[activeIdx]?.m.at ?? "2011-09")}
            </motion.span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint sm:flex">
              <MoveHorizontal className="size-3.5" />
              Scroll to travel
            </span>
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface-2 p-1">
              <button
                onClick={() => setZoom((z) => clamp(z - 120, MIN_ZOOM, MAX_ZOOM))}
                disabled={zoom <= MIN_ZOOM}
                aria-label="Zoom out"
                className="grid size-6 place-items-center rounded-full text-fg-dim transition hover:text-fg disabled:opacity-30"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-14 text-center font-mono text-[10px] text-fg-faint">
                {Math.round((zoom / 420) * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => clamp(z + 120, MIN_ZOOM, MAX_ZOOM))}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zoom in"
                className="grid size-6 place-items-center rounded-full text-fg-dim transition hover:text-fg disabled:opacity-30"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-[calc(100svh-8rem)]">
          <motion.div
            style={{ x, width: trackWidth }}
            className="absolute inset-y-0 left-0"
          >
            {/* The spine */}
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line" />

            {/* Year ticks */}
            {YEARS.map((year) => {
              const left = positionOf(`${year}-01`);
              return (
                <div
                  key={year}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left }}
                >
                  <div className="h-3 w-px -translate-y-1/2 bg-line-soft" />
                  <span className="absolute left-0 top-3 -translate-x-1/2 font-mono text-[10px] text-fg-faint">
                    {year}
                  </span>
                </div>
              );
            })}

            {/* Milestones */}
            {placed.map(({ m, left, above }, i) => (
              <div
                key={m.id}
                className="absolute top-1/2 -translate-x-1/2"
                style={{ left }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500",
                    m.major ? "size-3" : "size-2",
                    activeIdx === i ? "scale-150" : "scale-100",
                  )}
                  style={{
                    background: m.colour,
                    boxShadow: activeIdx === i ? `0 0 22px 4px ${m.colour}55` : "none",
                  }}
                />
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2",
                    above ? "bottom-8" : "top-8",
                  )}
                >
                  <motion.div
                    animate={{
                      opacity: activeIdx === i ? 1 : 0.42,
                      y: activeIdx === i ? 0 : above ? 6 : -6,
                      filter: activeIdx === i ? "blur(0px)" : "blur(1.5px)",
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    <MilestoneCard m={m} above={above} active={activeIdx === i} />
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress rail */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-line">
          <motion.div
            style={{ scaleX: progressScale }}
            className="h-full origin-left bg-accent"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function VerticalTimeline() {
  return (
    <ol className="container-page relative mt-12 border-l border-line pl-6 sm:pl-10">
      {timelineSorted.map((m) => (
        <li key={m.id} className="relative pb-9">
          <span
            aria-hidden
            className={cn(
              "absolute -left-[1.6rem] top-1.5 rounded-full ring-4 ring-ink sm:-left-[2.6rem]",
              m.major ? "size-2.5" : "size-1.5",
            )}
            style={{ background: m.colour }}
          />
          <p className="font-mono text-[11px] text-fg-faint">
            {formatMonth(m.at)} · {KIND_LABEL[m.kind]}
          </p>
          <h3 className="mt-1 font-display text-xl tracking-tight">{m.title}</h3>
          {m.org && (
            <p className="text-[12.5px]" style={{ color: m.colour }}>
              {m.org}
            </p>
          )}
          <p className="mt-2 max-w-[60ch] text-[14px] leading-relaxed text-fg-dim">
            {m.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */

export function Timeline() {
  const { recruiterMode } = useSite();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const horizontal = wide && !recruiterMode;

  return (
    <section id="timeline" className="scroll-mt-24 py-24 sm:py-36">
      <div className="container-page">
        <SectionHeader
          index="02"
          eyebrow="The long view"
          title={
            <>
              From a soldering iron in Science Gallery
              <span className="italic text-fg-dim"> to 5,000 users on a plane of their own</span>
            </>
          }
          lede={
            horizontal
              ? "Scroll to travel through fifteen years. Zoom in for the detail, out for the shape of it."
              : "Fifteen years, in order."
          }
          className="mb-8"
        />
      </div>

      {horizontal ? <HorizontalTimeline /> : <VerticalTimeline />}
    </section>
  );
}

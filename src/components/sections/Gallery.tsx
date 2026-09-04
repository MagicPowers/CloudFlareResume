"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, FolderOpen, X } from "lucide-react";
import { eras, photos, type EraId } from "@/data/gallery";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

function EmptyState() {
  return (
    <Reveal className="rounded-xl border border-dashed border-line bg-surface/50 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <FolderOpen className="mx-auto size-7 text-fg-faint" />
        <h3 className="mt-4 font-display text-2xl tracking-tight">
          The gallery is ready and waiting
        </h3>
        <p className="mx-auto mt-3 max-w-[52ch] text-[14px] leading-relaxed text-fg-dim">
          Drop images into the era folders below and run{" "}
          <code className="rounded bg-ink px-1.5 py-0.5 font-mono text-[12px] text-accent">
            npm run photos
          </code>
          . They appear here, in the timeline cards, and in the lightbox — with
          dimensions baked in so nothing jumps.
        </p>

        <ul className="mx-auto mt-7 grid max-w-xl gap-px overflow-hidden rounded-lg border border-line bg-line text-left sm:grid-cols-2">
          {eras.map((e) => (
            <li key={e.id} className="bg-surface px-3.5 py-2.5">
              <p className="font-mono text-[11px]" style={{ color: e.colour }}>
                public/photos/{e.id}/
              </p>
              <p className="mt-0.5 text-[12px] text-fg-faint">
                {e.label} · {e.years}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<EraId | "all">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const available = useMemo(
    () => eras.filter((e) => photos.some((p) => p.era === e.id)),
    [],
  );

  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.era === filter)),
    [filter],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((i) => {
        if (i === null) return i;
        return (i + dir + visible.length) % visible.length;
      });
    },
    [visible.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  const current = lightbox !== null ? visible[lightbox] : null;
  const currentEra = current ? eras.find((e) => e.id === current.era) : null;

  return (
    <section id="gallery" className="container-page scroll-mt-24 py-24 sm:py-36">
      <SectionHeader
        index="05"
        eyebrow="Receipts"
        title={
          <>
            Fifteen years,
            <span className="italic text-fg-dim"> with photographic evidence</span>
          </>
        }
        lede="Offsites, launches, whiteboards, bikes and at least one anatomy museum."
        className="mb-10"
      />

      {photos.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Reveal className="no-print mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[12.5px] transition",
                filter === "all"
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-line bg-surface-2 text-fg-dim hover:text-fg",
              )}
            >
              All <span className="ml-1 text-fg-faint">{photos.length}</span>
            </button>
            {available.map((e) => {
              const count = photos.filter((p) => p.era === e.id).length;
              const active = filter === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setFilter(e.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12.5px] transition",
                    active
                      ? "bg-surface-2 text-fg"
                      : "border-line bg-surface-2 text-fg-dim hover:text-fg",
                  )}
                  style={active ? { borderColor: `${e.colour}80`, color: e.colour } : undefined}
                >
                  {e.label} <span className="ml-1 opacity-60">{count}</span>
                </button>
              );
            })}
          </Reveal>

          <motion.div layout className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
            <AnimatePresence mode="popLayout">
              {visible.map((photo, i) => {
                const era = eras.find((e) => e.id === photo.era);
                return (
                  <motion.button
                    key={photo.src}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setLightbox(i)}
                    className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-line bg-surface-2"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption ?? `${era?.label ?? "Photo"}`}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="h-auto w-full transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span
                        className="block font-mono text-[9.5px] uppercase tracking-[0.14em]"
                        style={{ color: era?.colour }}
                      >
                        {era?.label}
                      </span>
                      {photo.caption && (
                        <span className="mt-0.5 block text-[12px] leading-snug text-fg">
                          {photo.caption}
                        </span>
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink/96 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: currentEra?.colour }}
                >
                  {currentEra?.label} · {currentEra?.years}
                </p>
                {current.caption && (
                  <p className="mt-1 text-[14px] text-fg">{current.caption}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tabular-nums text-fg-faint">
                  {(lightbox ?? 0) + 1} / {visible.length}
                </span>
                <button
                  onClick={() => setLightbox(null)}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-full border border-line text-fg-dim transition hover:text-fg"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div
              className="relative flex-1 px-4 pb-16"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative size-full"
              >
                <Image
                  src={current.src}
                  alt={current.caption ?? "Photo"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>

              <button
                onClick={() => step(-1)}
                aria-label="Previous"
                className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/80 text-fg-dim backdrop-blur transition hover:text-fg"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next"
                className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/80 text-fg-dim backdrop-blur transition hover:text-fg"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

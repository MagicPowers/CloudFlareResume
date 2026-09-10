"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups } from "@/data/skills";
import { education, certifications } from "@/data/experience";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Skills() {
  const [filter, setFilter] = useState<string>("all");
  const groups =
    filter === "all" ? skillGroups : skillGroups.filter((g) => g.id === filter);
  const activeHint = skillGroups.find((g) => g.id === filter)?.hint;

  return (
    <section id="skills" className="container-page scroll-mt-24 py-24 sm:py-36">
      <SectionHeader
        index="04"
        eyebrow="Capability"
        title={
          <>
            What I use,
            <span className="italic text-fg-dim"> and roughly how long I&rsquo;ve used it</span>
          </>
        }
        lede="Filled dots are the ones I'd happily be interviewed on tomorrow. The rest are honest working knowledge."
        className="mb-10"
      />

      <Reveal className="no-print mb-8 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-[12.5px] transition",
            filter === "all"
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-line bg-surface-2 text-fg-dim hover:text-fg",
          )}
        >
          Everything
        </button>
        {skillGroups.map((g) => (
          <button
            key={g.id}
            onClick={() => setFilter(g.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[12.5px] transition",
              filter === g.id
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-line bg-surface-2 text-fg-dim hover:text-fg",
            )}
          >
            {g.label}
          </button>
        ))}
        <AnimatePresence mode="wait">
          {activeHint && (
            <motion.span
              key={activeHint}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="ml-1 font-mono text-[11px] text-fg-faint"
            >
              {activeHint}
            </motion.span>
          )}
        </AnimatePresence>
      </Reveal>

      <motion.div layout className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface p-5"
            >
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg tracking-tight">{group.label}</h3>
                <span className="font-mono text-[10px] text-fg-faint">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="group/skill flex items-center gap-3 text-[13.5px]"
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full transition",
                        item.core ? "bg-accent" : "bg-fg-faint/40",
                      )}
                    />
                    <span
                      className={cn(
                        "flex-1 transition-colors",
                        item.core ? "text-fg" : "text-fg-dim",
                      )}
                    >
                      {item.name}
                    </span>
                    {item.years && (
                      <span className="flex items-center gap-2">
                        <span className="hidden h-px w-10 bg-line-soft sm:block">
                          <motion.span
                            className="block h-px bg-accent/60"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: Math.min(item.years / 10, 1) }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: "left" }}
                          />
                        </span>
                        <span className="w-8 text-right font-mono text-[10.5px] tabular-nums text-fg-faint">
                          {item.years}y
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Education & certification */}
      <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <p className="eyebrow mb-5">Education</p>
          <ul className="space-y-6">
            {education.map((e) => (
              <li key={e.id} className="border-l border-line pl-5">
                <p className="font-display text-xl tracking-tight">{e.institution}</p>
                <p className="mt-0.5 text-[14px] text-fg-dim">{e.degree}</p>
                <p className="mt-1.5 font-mono text-[11px] text-fg-faint">
                  {e.start.split("-")[0]}–{e.end.split("-")[0]} · {e.grade}
                </p>
                {e.note && (
                  <p className="mt-2 max-w-[52ch] text-[13px] italic leading-relaxed text-fg-dim/80">
                    {e.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow mb-5">Certification</p>
          <ul className="space-y-4">
            {certifications.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-line bg-surface p-4"
              >
                <p className="text-[15px] font-medium">{c.name}</p>
                <p className="mt-1 text-[13px] text-fg-dim">{c.issuer}</p>
                <p className="mt-1.5 font-mono text-[11px] text-accent">{c.year}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { roles, type Role } from "@/data/experience";
import { duration, formatMonth, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { useSite } from "@/lib/site-state";

function RoleRow({ role, index }: { role: Role; index: number }) {
  const { recruiterMode } = useSite();
  const [open, setOpen] = useState(index === 0);
  const expanded = recruiterMode || open;

  return (
    <Reveal as="li" delay={Math.min(index, 4) * 0.04} amount={0.15}>
      <div
        className="group relative border-t border-line transition-colors"
        style={{ ["--role" as string]: role.accent }}
      >
        {/* Accent wash on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--role)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={expanded}
          className="flex w-full items-start gap-4 py-7 text-left sm:gap-8"
        >
          <span className="mt-1.5 w-8 shrink-0 font-mono text-[11px] text-fg-faint">
            {String(roles.length - index).padStart(2, "0")}
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-balance font-display text-[clamp(1.5rem,3.4vw,2.3rem)] leading-tight tracking-[-0.015em]">
                {role.title}
              </span>
              {role.altTitle && (
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                  {role.altTitle}
                </span>
              )}
            </span>

            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-dim">
              <span
                className="font-medium"
                style={{ color: role.accent }}
              >
                {role.company}
              </span>
              <span className="text-fg-faint">·</span>
              <span className="font-mono text-[12px]">
                {formatMonth(role.start)} — {formatMonth(role.end)}
              </span>
              <span className="text-fg-faint">·</span>
              <span className="text-fg-faint">{duration(role.start, role.end)}</span>
            </span>

            <span className="mt-3 block max-w-[62ch] text-balance text-[15px] leading-relaxed text-fg-dim/90">
              {role.headline}
            </span>
          </span>

          <span
            className={cn(
              "no-print mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-fg-faint transition",
              "group-hover:border-fg-faint group-hover:text-fg",
              recruiterMode && "invisible",
            )}
          >
            {expanded ? <Minus className="size-4" /> : <Plus className="size-4" />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-8 pb-10 sm:pl-12 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
                <ul className="space-y-3.5">
                  {role.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3.5 text-[14.5px] leading-relaxed text-fg-dim">
                      <span
                        aria-hidden
                        className="mt-[0.6em] size-1 shrink-0 rounded-full"
                        style={{ background: role.accent }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-6">
                  {role.metrics && (
                    <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line">
                      {role.metrics.map((m) => (
                        <div key={m.label} className="bg-surface px-4 py-3">
                          <dt
                            className="font-display text-2xl leading-none tracking-tight"
                            style={{ color: role.accent }}
                          >
                            {m.value}
                          </dt>
                          <dd className="mt-1.5 text-[11.5px] leading-snug text-fg-faint">
                            {m.label}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div>
                    <p className="eyebrow mb-3">Stack</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {role.stack.map((s) => (
                        <li
                          key={s}
                          className="rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-fg-dim"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[12px] text-fg-faint">
                    {role.location}
                    {role.arrangement ? ` · ${role.arrangement}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="container-page scroll-mt-24 py-24 sm:py-36">
      <SectionHeader
        index="01"
        eyebrow="Experience"
        title={
          <>
            Ten years, four companies,
            <span className="italic text-fg-dim"> one recurring job</span>
          </>
        }
        lede="Find the thing blocking the team, remove it, and make sure it doesn't come back. Occasionally that thing is a 90,000-line legacy module. Occasionally it's a meeting."
        className="mb-14"
      />

      <ul className="border-b border-line">
        {roles.map((role, i) => (
          <RoleRow key={role.id} role={role} index={i} />
        ))}
      </ul>
    </section>
  );
}

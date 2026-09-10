"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Dices, Shield, Sparkles } from "lucide-react";
import {
  abilities,
  character,
  feats,
  inventory,
  savingThrows,
  type Ability,
} from "@/data/skills";
import { abilityModifier, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

type Roll = {
  id: number;
  ability: string;
  die: number;
  modifier: number;
  total: number;
  verdict: string;
};

function verdictFor(die: number, total: number) {
  if (die === 20) return "Natural 20. Critical success.";
  if (die === 1) return "Natural 1. We do not speak of this sprint.";
  if (total >= 22) return "Comfortably clears the DC.";
  if (total >= 15) return "Success.";
  if (total >= 10) return "Success, at a cost.";
  return "Failure. Retro scheduled.";
}

function AbilityBlock({
  ability,
  onRoll,
  rolling,
}: {
  ability: Ability;
  onRoll: (a: Ability) => void;
  rolling: boolean;
}) {
  const mod = abilityModifier(ability.score);

  return (
    <motion.button
      onClick={() => onRoll(ability)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col items-center rounded-xl border border-line bg-surface p-4 text-center transition-colors hover:border-accent/40"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
        {ability.key}
      </span>
      <span
        className={cn(
          "mt-2 font-display text-4xl leading-none tracking-tight transition-colors",
          rolling ? "text-accent" : "text-fg group-hover:text-accent",
        )}
      >
        {ability.score}
      </span>
      <span className="mt-2 rounded-full border border-line bg-ink px-2.5 py-0.5 font-mono text-[11px] text-accent">
        {mod}
      </span>
      <span className="mt-3 text-[12px] font-medium leading-tight">{ability.name}</span>
      <span className="mt-1 text-[11px] leading-snug text-fg-faint">{ability.maps}</span>

      <span className="pointer-events-none absolute inset-x-3 -bottom-2 translate-y-2 rounded-lg border border-accent/30 bg-ink px-3 py-2 text-[11px] leading-snug text-fg-dim opacity-0 shadow-xl transition-all duration-300 group-hover:-bottom-16 group-hover:translate-y-0 group-hover:opacity-100 md:block">
        {ability.evidence}
      </span>
    </motion.button>
  );
}

export function CharacterSheet() {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [rollingKey, setRollingKey] = useState<string | null>(null);
  const [openFeat, setOpenFeat] = useState<string | null>(null);

  const roll = useCallback((ability: Ability) => {
    setRollingKey(ability.key);
    const die = 1 + Math.floor(Math.random() * 20);
    const modifier = Math.floor((ability.score - 10) / 2) + character.proficiencyBonus;
    const total = die + modifier;

    window.setTimeout(() => {
      setRollingKey(null);
      setRolls((prev) =>
        [
          {
            id: Date.now(),
            ability: ability.name,
            die,
            modifier,
            total,
            verdict: verdictFor(die, total),
          },
          ...prev,
        ].slice(0, 4),
      );
    }, 480);
  }, []);

  return (
    <section id="character" className="container-page scroll-mt-24 py-24 sm:py-36">
      <SectionHeader
        index="05"
        eyebrow="For the tabletop crowd"
        title={
          <>
            The same CV,
            <span className="italic text-fg-dim"> rolled in d20</span>
          </>
        }
        lede="I've been a Dungeon Master for years, and it has made me a better manager than most of the courses did. Click an ability to roll against it. Hover for the real-world evidence."
        className="mb-12"
      />

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        {/* Left: the sheet */}
        <div className="space-y-8">
          <Reveal className="rounded-xl border border-line bg-gradient-to-b from-surface-2 to-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-3xl leading-none tracking-tight">
                  {character.name}
                </p>
                <p className="mt-2 text-[13.5px] text-fg-dim">
                  Level {character.level} {character.class}
                  <span className="text-fg-faint"> · {character.multiclass}</span>
                </p>
                <p className="mt-1 text-[12.5px] italic text-accent/85">
                  {character.subclass}
                </p>
              </div>

              <dl className="grid grid-cols-3 gap-2 text-center">
                {[
                  { k: "AC", v: character.armourClass, icon: Shield },
                  { k: "HP", v: `${character.hitPoints.current}/${character.hitPoints.max}` },
                  { k: "PROF", v: `+${character.proficiencyBonus}` },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-lg border border-line bg-ink px-3 py-2"
                  >
                    <dt className="font-mono text-[9.5px] tracking-[0.14em] text-fg-faint">
                      {s.k}
                    </dt>
                    <dd className="mt-0.5 font-mono text-[15px] tabular-nums text-fg">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line pt-4 text-[12.5px] sm:grid-cols-4">
              {[
                ["Background", character.background],
                ["Alignment", character.alignment],
                ["Speed", character.speed],
                ["Inspiration", character.inspiration ? "Yes" : "No"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-fg-faint">
                    {k}
                  </dt>
                  <dd className="mt-0.5 text-fg-dim">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="eyebrow mb-4">Ability scores — click to roll</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {abilities.map((a) => (
                <AbilityBlock
                  key={a.key}
                  ability={a}
                  onRoll={roll}
                  rolling={rollingKey === a.key}
                />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="eyebrow mb-4">Saving throws</p>
            <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line">
              {savingThrows.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-3 bg-surface px-4 py-2.5 text-[13px]"
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      s.proficient ? "bg-accent" : "bg-rose/60",
                    )}
                  />
                  <span className="flex-1 text-fg-dim">{s.name}</span>
                  <span
                    className={cn(
                      "font-mono text-[12px] tabular-nums",
                      s.proficient ? "text-accent" : "text-rose",
                    )}
                  >
                    {s.modifier}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Right: dice tray, feats, inventory */}
        <div className="space-y-8">
          <Reveal delay={0.1} className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Dices
                className={cn(
                  "size-4 text-accent transition-transform",
                  rollingKey && "animate-spin",
                )}
              />
              <p className="eyebrow">Dice tray</p>
            </div>

            {rolls.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-fg-faint">
                No rolls yet. Pick an ability.
              </p>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {rolls.map((r) => (
                    <motion.li
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "rounded-lg border bg-ink px-3.5 py-2.5",
                        r.die === 20
                          ? "border-accent/60"
                          : r.die === 1
                            ? "border-rose/50"
                            : "border-line",
                      )}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13px] text-fg-dim">{r.ability}</span>
                        <span className="font-display text-2xl leading-none tracking-tight text-accent">
                          {r.total}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[10.5px] text-fg-faint">
                        d20 ({r.die}) + {r.modifier} · {r.verdict}
                      </p>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-violet" />
              <p className="eyebrow">Feats & abilities</p>
            </div>
            <ul className="space-y-1.5">
              {feats.map((f) => {
                const open = openFeat === f.name;
                return (
                  <li key={f.name}>
                    <button
                      onClick={() => setOpenFeat(open ? null : f.name)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-left transition",
                        open
                          ? "border-violet/45 bg-violet/[0.07]"
                          : "border-line bg-surface hover:border-fg-faint/50",
                      )}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13.5px] font-medium">{f.name}</span>
                        <span
                          className={cn(
                            "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider",
                            f.type === "Legendary"
                              ? "border-accent/40 text-accent"
                              : "border-line text-fg-faint",
                          )}
                        >
                          {f.type}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12.5px] italic leading-relaxed text-fg-dim">
                        {f.text}
                      </p>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 border-t border-violet/20 pt-3 text-[12.5px] leading-relaxed text-fg-dim">
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-violet">
                                In reality —{" "}
                              </span>
                              {f.real}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">Inventory</p>
            <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line">
              {inventory.map((i) => (
                <li
                  key={i.name}
                  className="flex items-baseline justify-between gap-3 bg-surface px-4 py-2 text-[13px]"
                >
                  <span className="text-fg-dim">{i.name}</span>
                  <span className="font-mono text-[10.5px] italic text-fg-faint">
                    {i.note}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

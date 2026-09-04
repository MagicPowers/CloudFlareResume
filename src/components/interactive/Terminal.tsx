"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { profile } from "@/data/profile";
import { roles, education, certifications } from "@/data/experience";
import { skillGroups, abilities, character } from "@/data/skills";
import { timelineSorted } from "@/data/timeline";
import { sections } from "@/data/sections";
import { rides } from "@/data/cycling";
import { formatMonth, duration, abilityModifier, cn } from "@/lib/utils";
import { useSite } from "@/lib/site-state";
import { scrollToSection } from "@/components/layout/SmoothScroll";

type Tone = "out" | "dim" | "accent" | "warn" | "err" | "cmd";
type Line = { id: number; text: string; tone: Tone };

let lineId = 0;
const line = (text: string, tone: Tone = "out"): Line => ({
  id: lineId++,
  text,
  tone,
});

const TONE_CLASS: Record<Tone, string> = {
  out: "text-fg-dim",
  dim: "text-fg-faint",
  accent: "text-accent",
  warn: "text-amber",
  err: "text-rose",
  cmd: "text-fg",
};

const BANNER = String.raw`
  ___   ___   _   _ ___ ___    ___  _____      _____ ___
 |   \ / _ \ | | | |_ _|   \  | _ \/ _ \ \    / / __| _ \
 | |) | (_) || |_| || || |) | |  _/ (_) \ \/\/ /| _||   /
 |___/ \___/  \___/|___|___/  |_|  \___/ \_/\_/ |___|_|_\
`;

function bootLines(): Line[] {
  return [
    ...BANNER.split("\n").map((l) => line(l, "accent")),
    line(`  ${profile.title} · ${profile.location}`, "dim"),
    line(""),
    line("Type `help` to see what this thing does.", "out"),
    line(""),
  ];
}

export function Terminal() {
  const { terminalOpen, setTerminalOpen, runEffect, recruiterMode, setRecruiterMode } =
    useSite();
  const [lines, setLines] = useState<Line[]>(bootLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = useCallback((...newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const commands = useMemo(() => {
    const registry: Record<
      string,
      { desc: string; run: (args: string[]) => Line[] | void }
    > = {
      help: {
        desc: "List everything this terminal knows",
        run: () => {
          const names = Object.keys(registry).sort();
          const width = Math.max(...names.map((n) => n.length)) + 3;
          return [
            line("Available commands", "accent"),
            line(""),
            ...names.map((n) =>
              line(`  ${n.padEnd(width)}${registry[n].desc}`, "out"),
            ),
            line(""),
            line("  Tab completes · ↑↓ walks history · Esc closes", "dim"),
          ];
        },
      },

      whoami: {
        desc: "The short version",
        run: () => [
          line(profile.name, "accent"),
          line(`${profile.title} at ${profile.company}`),
          line(`${profile.location} · ${profile.citizenship}`, "dim"),
          line(""),
          line(profile.tagline),
        ],
      },

      about: {
        desc: "The slightly longer version",
        run: () => [
          ...profile.summary.flatMap((s) => [line(s), line("")]),
          line(`Currently: ${profile.availability.label}`, "accent"),
          line(profile.availability.detail, "dim"),
        ],
      },

      exp: {
        desc: "Work history. `exp 1` for detail on a role",
        run: (args) => {
          const n = Number(args[0]);
          if (n && roles[n - 1]) {
            const r = roles[n - 1];
            return [
              line(`${r.title} — ${r.company}`, "accent"),
              line(
                `${formatMonth(r.start)} — ${formatMonth(r.end)}  (${duration(r.start, r.end)})  ${r.location}`,
                "dim",
              ),
              line(""),
              ...r.bullets.flatMap((b) => [line(`  • ${b}`), line("")]),
              line(`  stack: ${r.stack.join(", ")}`, "dim"),
            ];
          }
          return [
            line("Work history — run `exp <n>` for the detail", "accent"),
            line(""),
            ...roles.map((r, i) =>
              line(
                `  ${String(i + 1).padStart(2)}  ${`${formatMonth(r.start)}–${formatMonth(r.end)}`.padEnd(20)}${r.title} · ${r.company}`,
              ),
            ),
          ];
        },
      },

      skills: {
        desc: "What I actually use",
        run: () =>
          skillGroups.flatMap((g) => [
            line(g.label, "accent"),
            line(`  ${g.items.map((i) => i.name).join(" · ")}`),
            line(""),
          ]),
      },

      education: {
        desc: "Degrees and certifications",
        run: () => [
          ...education.flatMap((e) => [
            line(e.institution, "accent"),
            line(`  ${e.degree}`),
            line(`  ${e.start.split("-")[0]}–${e.end.split("-")[0]} · ${e.grade}`, "dim"),
            line(""),
          ]),
          ...certifications.map((c) =>
            line(`${c.name} — ${c.issuer}, ${c.year}`, "out"),
          ),
        ],
      },

      timeline: {
        desc: "Every milestone, oldest first",
        run: () => [
          line("Fifteen years, abridged", "accent"),
          line(""),
          ...timelineSorted.map((m) =>
            line(
              `  ${formatMonth(m.at).padEnd(10)} ${m.major ? "◆" : "·"} ${m.title}${m.org ? ` — ${m.org}` : ""}`,
              m.major ? "out" : "dim",
            ),
          ),
        ],
      },

      cycling: {
        desc: "Long rides, in kilometres",
        run: () =>
          rides.flatMap((r) => [
            line(`${r.name} — ${r.distanceKm} km`, "accent"),
            line(`  ${r.waypoints.map((w) => w.name).join(" → ")}`, "dim"),
            line(""),
          ]),
      },

      character: {
        desc: "The d20 version of this CV",
        run: () => [
          line(`${character.name} — Level ${character.level} ${character.class}`, "accent"),
          line(`${character.subclass} · ${character.multiclass}`, "dim"),
          line(""),
          ...abilities.map((a) =>
            line(
              `  ${a.key}  ${String(a.score).padStart(2)}  (${abilityModifier(a.score)})  ${a.name.padEnd(24)}${a.maps}`,
            ),
          ),
        ],
      },

      contact: {
        desc: "How to reach me",
        run: () => [
          line(`email     ${profile.email}`, "accent"),
          line(`phone     ${profile.phone}`),
          line(`linkedin  ${profile.linkedin}`),
          line(`based     ${profile.location}`),
          line(""),
          line("Try `open email` or `open linkedin`.", "dim"),
        ],
      },

      open: {
        desc: "open <email|linkedin|cv>",
        run: (args) => {
          const what = args[0];
          if (what === "email") {
            window.location.href = `mailto:${profile.email}`;
            return [line(`Opening mail client → ${profile.email}`, "accent")];
          }
          if (what === "linkedin") {
            window.open(profile.linkedin, "_blank");
            return [line("Opening LinkedIn…", "accent")];
          }
          if (what === "cv" || what === "resume") {
            window.open("/cv", "_blank");
            return [line("Opening the printable CV…", "accent")];
          }
          return [line("Usage: open <email|linkedin|cv>", "warn")];
        },
      },

      goto: {
        desc: "goto <section> — scroll the page there",
        run: (args) => {
          const target = args[0]?.toLowerCase();
          const match = sections.find((s) => s.id === target);
          if (!match) {
            return [
              line(`No section called “${args[0] ?? ""}”.`, "warn"),
              line(`Try: ${sections.map((s) => s.id).join(", ")}`, "dim"),
            ];
          }
          setTerminalOpen(false);
          window.setTimeout(() => scrollToSection(`#${match.id}`), 220);
          return [line(`→ ${match.label}`, "accent")];
        },
      },

      ls: {
        desc: "List the sections of this site",
        run: () =>
          sections.map((s) => line(`  ${s.id.padEnd(14)}${s.hint}`, "out")),
      },

      roll: {
        desc: "roll [NdM] — defaults to 1d20",
        run: (args) => {
          const spec = args[0] ?? "1d20";
          const m = /^(\d{0,2})d(\d{1,3})$/.exec(spec);
          if (!m) return [line("Usage: roll 1d20 / roll 4d6", "warn")];
          const count = Math.min(Number(m[1] || 1), 20);
          const sides = Math.min(Number(m[2]), 100);
          const dice = Array.from(
            { length: count },
            () => 1 + Math.floor(Math.random() * sides),
          );
          const total = dice.reduce((a, b) => a + b, 0);
          const nat20 = sides === 20 && dice.includes(20);
          if (nat20) runEffect("d20", 3000);
          return [
            line(`🎲 ${spec} → [${dice.join(", ")}]  =  ${total}`, nat20 ? "accent" : "out"),
            ...(nat20 ? [line("Natural 20. The party cheers.", "accent")] : []),
            ...(sides === 20 && dice.includes(1)
              ? [line("Natural 1. Rollback initiated.", "err")]
              : []),
          ];
        },
      },

      neofetch: {
        desc: "System information, such as it is",
        run: () => {
          const yearsShipping = new Date().getFullYear() - 2016;
          return [
            line(`${profile.name.toLowerCase().replace(" ", "@")}`, "accent"),
            line("-".repeat(24), "dim"),
            line(`Role        ${profile.title}`),
            line(`Host        ${profile.company}`),
            line(`Location    ${profile.location}`),
            line(`Uptime      ${yearsShipping} years shipping`),
            line(`Shell       zsh (with far too many aliases)`),
            line(`Editor      IntelliJ IDEA, VS Code`),
            line(`Cloud       AWS`),
            line(`Languages   Java, TypeScript, SQL, Gaeilge, Gàidhlig`),
            line(`Packages    ${roles.length} roles, ${timelineSorted.length} milestones`),
            line(`Hobbies     Cycling, Dungeons & Dragons`),
          ];
        },
      },

      recruiter: {
        desc: "Toggle the dense, animation-free view",
        run: () => {
          setRecruiterMode(!recruiterMode);
          return [
            line(
              recruiterMode
                ? "Recruiter mode off. The animations are back."
                : "Recruiter mode on. Everything, densely, no motion.",
              "accent",
            ),
          ];
        },
      },

      matrix: {
        desc: "Follow the white rabbit",
        run: () => {
          runEffect("matrix", 7000);
          return [line("Wake up, Neo…", "accent")];
        },
      },

      crt: {
        desc: "Turn the cathode ray tube on",
        run: () => {
          runEffect("crt", 9000);
          return [line("Warming up the phosphor…", "accent")];
        },
      },

      date: {
        desc: "Time in Dublin",
        run: () => [
          line(
            new Intl.DateTimeFormat("en-IE", {
              dateStyle: "full",
              timeStyle: "medium",
              timeZone: "Europe/Dublin",
            }).format(new Date()),
          ),
        ],
      },

      sudo: {
        desc: "Nice try",
        run: (args) => {
          if (args.join(" ").includes("rm -rf")) {
            runEffect("crt", 4000);
            return [
              line("rm: it is dangerous to operate recursively on '/'", "err"),
              line("rm: use --no-preserve-root to override this failsafe", "err"),
              line(""),
              line(
                "Also: I once removed 90,000 lines of legacy code on purpose. I know what I'm doing, and this isn't it.",
                "dim",
              ),
            ];
          }
          return [
            line(`${profile.name.split(" ")[0]} is not in the sudoers file.`, "err"),
            line("This incident will be reported. To me. In the retro.", "dim"),
          ];
        },
      },

      history: {
        desc: "Commands you've run this session",
        run: () =>
          history.length
            ? history.map((h, i) => line(`  ${String(i + 1).padStart(3)}  ${h}`, "dim"))
            : [line("Nothing yet.", "dim")],
      },

      clear: {
        desc: "Clear the screen",
        run: () => {
          setLines([]);
          return [];
        },
      },

      exit: {
        desc: "Close the terminal",
        run: () => {
          setTerminalOpen(false);
          return [];
        },
      },
    };
    return registry;
  }, [history, recruiterMode, runEffect, setRecruiterMode, setTerminalOpen]);

  const commandNames = useMemo(() => Object.keys(commands).sort(), [commands]);

  useEffect(() => {
    if (terminalOpen) window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [terminalOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const suggestion = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.includes(" ")) return null;
    return commandNames.find((c) => c.startsWith(trimmed) && c !== trimmed) ?? null;
  }, [input, commandNames]);

  const submit = useCallback(() => {
    const raw = input.trim();
    setInput("");
    setHistoryIdx(-1);
    if (!raw) return;

    setHistory((h) => [...h, raw]);
    push(line(`❯ ${raw}`, "cmd"));

    const [name, ...args] = raw.split(/\s+/);
    const cmd = commands[name.toLowerCase()];

    if (!cmd) {
      const near = commandNames.find((c) => c.startsWith(name.slice(0, 2)));
      push(
        line(`command not found: ${name}`, "err"),
        ...(near ? [line(`Did you mean \`${near}\`?`, "dim")] : []),
        line(""),
      );
      return;
    }

    const out = cmd.run(args);
    if (out?.length) push(...out, line(""));
  }, [input, commands, commandNames, push]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) setInput(suggestion);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(history[next]);
      }
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="panel fixed inset-x-3 bottom-3 z-[95] flex h-[min(70vh,560px)] flex-col overflow-hidden rounded-xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] sm:inset-x-auto sm:right-6 sm:w-[min(680px,calc(100vw-3rem))]"
          onClick={() => inputRef.current?.focus()}
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-line bg-surface-2/70 px-3.5 py-2.5">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-rose/70" />
              <span className="size-2.5 rounded-full bg-amber/70" />
              <span className="size-2.5 rounded-full bg-accent/70" />
            </span>
            <span className="font-mono text-[11px] text-fg-faint">
              david@power — zsh — {lines.length} lines
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTerminalOpen(false);
              }}
              aria-label="Close terminal"
              className="ml-auto grid size-6 place-items-center rounded text-fg-faint transition hover:text-fg"
            >
              <X className="size-3.5" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 font-mono text-[12.5px] leading-[1.55]"
          >
            {lines.map((l) => (
              <pre
                key={l.id}
                className={cn("whitespace-pre-wrap break-words", TONE_CLASS[l.tone])}
              >
                {l.text || "\u00A0"}
              </pre>
            ))}

            <div className="flex items-center gap-2 pt-1">
              <span className="text-accent">❯</span>
              <span className="relative flex-1">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                  data-bare-focus
                  className="w-full bg-transparent text-fg caret-accent outline-none"
                />
                {suggestion && (
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-fg-faint/50">
                    <span className="invisible">{input}</span>
                    <span>{suggestion.slice(input.length)}</span>
                  </span>
                )}
              </span>
            </div>
          </div>

          <footer className="flex shrink-0 items-center gap-4 border-t border-line bg-surface-2/50 px-4 py-2 font-mono text-[10px] text-fg-faint">
            <span>tab completes</span>
            <span>↑↓ history</span>
            <span>ctrl+l clears</span>
            <span className="ml-auto">esc closes</span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

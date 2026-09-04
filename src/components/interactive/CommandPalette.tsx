"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Copy,
  Dices,
  Eye,
  FileText,
  Mail,
  Navigation,
  Phone,
  Sparkles,
  TerminalSquare,
  Wand2,
} from "lucide-react";
import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { useSite } from "@/lib/site-state";
import { scrollToSection } from "@/components/layout/SmoothScroll";

function Item({
  children,
  icon: Icon,
  shortcut,
  onSelect,
  value,
}: {
  children: React.ReactNode;
  icon: React.ElementType;
  shortcut?: string;
  onSelect: () => void;
  value: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] text-fg-dim transition-colors data-[selected=true]:bg-surface-2 data-[selected=true]:text-fg"
    >
      <Icon className="size-4 shrink-0 text-fg-faint transition-colors group-data-[selected=true]:text-accent" />
      <span className="flex-1">{children}</span>
      {shortcut && (
        <kbd className="rounded border border-line bg-ink px-1.5 py-0.5 font-mono text-[10px] text-fg-faint">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    setTerminalOpen,
    recruiterMode,
    setRecruiterMode,
    runEffect,
  } = useSite();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  const run = (fn: () => void) => {
    setPaletteOpen(false);
    window.setTimeout(fn, 120);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copied`);
      window.setTimeout(() => setToast(null), 2200);
    } catch {
      setToast("Clipboard blocked by the browser");
      window.setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <>
      <AnimatePresence>
        {paletteOpen && (
          <Command.Dialog
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            label="Command palette"
            className="fixed inset-0 z-[100]"
            loop
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              onClick={() => setPaletteOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="panel relative mx-auto mt-[12vh] w-[min(600px,92vw)] overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Wand2 className="size-4 text-accent" />
                <Command.Input
                  autoFocus
                  placeholder="Jump to a section, copy a detail, or try something silly…"
                  className="h-14 w-full bg-transparent text-[14.5px] text-fg outline-none placeholder:text-fg-faint"
                />
                <kbd className="rounded border border-line bg-ink px-1.5 py-0.5 font-mono text-[10px] text-fg-faint">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[min(52vh,440px)] overflow-y-auto overscroll-contain p-2">
                <Command.Empty className="px-3 py-8 text-center text-[13px] text-fg-faint">
                  Nothing matches. Try “timeline”, “email” or “matrix”.
                </Command.Empty>

                <Command.Group
                  heading="Navigate"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-fg-faint"
                >
                  {sections.map((s) => (
                    <Item
                      key={s.id}
                      value={`${s.label} ${s.hint}`}
                      icon={Navigation}
                      onSelect={() => run(() => scrollToSection(`#${s.id}`))}
                    >
                      {s.label}
                      <span className="ml-2 text-[12px] text-fg-faint">{s.hint}</span>
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Get in touch"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-fg-faint"
                >
                  <Item
                    value="email david power"
                    icon={Mail}
                    onSelect={() => run(() => (window.location.href = `mailto:${profile.email}`))}
                  >
                    Email {profile.email}
                  </Item>
                  <Item
                    value="copy email address"
                    icon={Copy}
                    onSelect={() => run(() => copy(profile.email, "Email address"))}
                  >
                    Copy email address
                  </Item>
                  <Item
                    value="copy phone number"
                    icon={Phone}
                    onSelect={() => run(() => copy(profile.phone, "Phone number"))}
                  >
                    Copy phone number
                  </Item>
                  <Item
                    value="linkedin profile"
                    icon={ArrowUpRight}
                    onSelect={() => run(() => window.open(profile.linkedin, "_blank"))}
                  >
                    Open LinkedIn
                  </Item>
                </Command.Group>

                <Command.Group
                  heading="Tools"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-fg-faint"
                >
                  <Item
                    value="printable pdf cv resume download"
                    icon={FileText}
                    onSelect={() => run(() => window.open("/cv", "_blank"))}
                  >
                    Open the printable CV
                  </Item>
                  <Item
                    value="recruiter mode dense no animation"
                    icon={Eye}
                    shortcut="⇧R"
                    onSelect={() => run(() => setRecruiterMode(!recruiterMode))}
                  >
                    {recruiterMode ? "Turn off recruiter mode" : "Turn on recruiter mode"}
                  </Item>
                  <Item
                    value="terminal command line shell"
                    icon={TerminalSquare}
                    shortcut="`"
                    onSelect={() => run(() => setTerminalOpen(true))}
                  >
                    Open the terminal
                  </Item>
                </Command.Group>

                <Command.Group
                  heading="For the curious"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-fg-faint"
                >
                  <Item
                    value="roll a d20 dice dnd"
                    icon={Dices}
                    onSelect={() => run(() => runEffect("d20", 3200))}
                  >
                    Roll a d20
                  </Item>
                  <Item
                    value="matrix rain green code"
                    icon={Sparkles}
                    onSelect={() => run(() => runEffect("matrix", 7000))}
                  >
                    Follow the white rabbit
                  </Item>
                  <Item
                    value="crt scanlines retro mode"
                    icon={Sparkles}
                    onSelect={() => run(() => runEffect("crt", 9000))}
                  >
                    Turn the CRT on
                  </Item>
                </Command.Group>
              </Command.List>

              <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-fg-faint">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span className="ml-auto">` for the terminal</span>
              </div>
            </motion.div>
          </Command.Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="panel fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full px-4 py-2 text-[12.5px] text-accent"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

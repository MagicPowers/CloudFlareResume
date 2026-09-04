"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type SiteState = {
  /** Cmd+K palette */
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  /** The summonable terminal */
  terminalOpen: boolean;
  setTerminalOpen: (v: boolean) => void;
  /** Dense, animation-free CV view for people who read CVs for a living */
  recruiterMode: boolean;
  setRecruiterMode: (v: boolean) => void;
  /** Easter eggs, triggered from the terminal or the palette */
  effect: Effect;
  runEffect: (e: Effect, ms?: number) => void;
};

export type Effect = "none" | "matrix" | "confetti" | "crt" | "d20";

const Ctx = createContext<SiteState | null>(null);

export const RECRUITER_STORAGE_KEY = "dp:recruiter-mode";
const RECRUITER_EVENT = "dp:recruiter-change";

/**
 * Recruiter mode lives on <html data-recruiter> rather than in React state.
 * A blocking script in the document head sets it before first paint, so the
 * page never flashes the animated version at someone who turned it off.
 */
const recruiterStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(RECRUITER_EVENT, onChange);
    return () => window.removeEventListener(RECRUITER_EVENT, onChange);
  },
  get() {
    return document.documentElement.dataset.recruiter === "on";
  },
  getServerSnapshot() {
    return false;
  },
  set(value: boolean) {
    document.documentElement.dataset.recruiter = value ? "on" : "off";
    try {
      window.localStorage.setItem(RECRUITER_STORAGE_KEY, value ? "1" : "0");
    } catch {
      // Private browsing. The attribute still applies for this session.
    }
    window.dispatchEvent(new Event(RECRUITER_EVENT));
  },
};

/** Inlined into <head> so the attribute is correct before the first paint. */
export const RECRUITER_BOOT_SCRIPT = `try{var v=localStorage.getItem(${JSON.stringify(
  RECRUITER_STORAGE_KEY,
)});document.documentElement.dataset.recruiter=v==="1"?"on":"off"}catch(e){}`;

export function SiteStateProvider({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [effect, setEffect] = useState<Effect>("none");

  const recruiterMode = useSyncExternalStore(
    recruiterStore.subscribe,
    recruiterStore.get,
    recruiterStore.getServerSnapshot,
  );

  const setRecruiterMode = useCallback((v: boolean) => recruiterStore.set(v), []);

  const runEffect = useCallback((e: Effect, ms = 6000) => {
    setEffect(e);
    if (e !== "none") window.setTimeout(() => setEffect("none"), ms);
  }, []);

  // Global keyboard shortcuts. The palette owns Cmd+K; here we handle the rest.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "Escape") {
        setTerminalOpen(false);
        return;
      }
      if (typing) return;

      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setTerminalOpen((v) => !v);
      }
      if (e.key === "R" && e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        recruiterStore.set(!recruiterStore.get());
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({
      paletteOpen,
      setPaletteOpen,
      terminalOpen,
      setTerminalOpen,
      recruiterMode,
      setRecruiterMode,
      effect,
      runEffect,
    }),
    [paletteOpen, terminalOpen, recruiterMode, effect, setRecruiterMode, runEffect],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside <SiteStateProvider>");
  return ctx;
}

const noopSubscribe = () => () => {};

/** ⌘ on Apple platforms, Ctrl everywhere else. */
export function useIsApplePlatform() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform),
    () => true,
  );
}

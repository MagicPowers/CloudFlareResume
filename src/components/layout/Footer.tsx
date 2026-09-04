"use client";

import { profile } from "@/data/profile";
import { useSite } from "@/lib/site-state";

export function Footer() {
  const { setPaletteOpen, setTerminalOpen } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-2xl tracking-tight">{profile.name}</p>
          <p className="mt-1 text-[12.5px] text-fg-faint">
            {profile.location} · {profile.citizenship} · © {year}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-fg-dim">
          <a href={`mailto:${profile.email}`} className="transition hover:text-fg">
            Email
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-fg"
          >
            LinkedIn
          </a>
          <a href="/cv" className="transition hover:text-fg">
            Printable CV
          </a>
          <button
            onClick={() => setPaletteOpen(true)}
            className="transition hover:text-fg"
          >
            Command palette
          </button>
          <button
            onClick={() => setTerminalOpen(true)}
            className="transition hover:text-fg"
          >
            Terminal
          </button>
        </div>
      </div>

      <div className="container-page pb-8">
        <p className="font-mono text-[10.5px] text-fg-faint/70">
          Built with Next.js, React, Tailwind and a hand-written WebGL shader. Press{" "}
          <kbd className="rounded border border-line px-1 py-0.5">⌘K</kbd> for
          everything, <kbd className="rounded border border-line px-1 py-0.5">`</kbd>{" "}
          for the terminal.
        </p>
      </div>
    </footer>
  );
}

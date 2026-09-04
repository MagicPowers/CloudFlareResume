"use client";

const ITEMS = [
  "Engineering management",
  "Platform separation",
  "AWS & Kubernetes",
  "Developer experience",
  "Zero-downtime migration",
  "Cost optimisation",
  "Agile delivery",
  "Hiring & mentorship",
  "Legacy demolition",
  "Acting CTO",
];

export function Marquee() {
  return (
    <div className="spectacle relative overflow-hidden border-y border-line py-4">
      <div
        className="flex w-max animate-marquee items-center gap-8"
        style={{ ["--marquee-duration" as string]: "48s" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-8" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <span key={item} className="flex items-center gap-8">
                <span className="whitespace-nowrap font-display text-lg tracking-tight text-fg-dim">
                  {item}
                </span>
                <span className="size-1 shrink-0 rotate-45 bg-accent/60" />
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

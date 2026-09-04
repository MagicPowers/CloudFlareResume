import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { roles, education, certifications } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { formatMonth } from "@/lib/utils";
import { PrintBar } from "./PrintBar";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description: `${profile.name} — ${profile.title}. Printable CV.`,
  robots: { index: false, follow: true },
};

const HOBBIES = [
  {
    label: "Tech",
    text: "Consistently curious about what's changed since last quarter, and honest about what hasn't.",
  },
  {
    label: "Gaming & Dungeons and Dragons",
    text: "Avid gamer and enthusiastic Dungeon Master, organising and leading campaigns for team-building and after-work activities.",
  },
  {
    label: "Cycling",
    text: "Long-distance rides across Ireland including Mizen-to-Malin and Dublin-to-Galway charity cycles.",
  },
];

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2.5 mt-6 border-b border-black/25 pb-1 font-sans text-[10.5pt] font-semibold uppercase tracking-[0.14em] text-black print:mt-5">
      {children}
    </h2>
  );
}

export default function CvPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f2] py-10 text-black print:bg-white print:py-0">
      <PrintBar />

      <article className="mx-auto w-[210mm] max-w-[calc(100vw-2rem)] bg-white px-[14mm] py-[13mm] font-sans text-[9.6pt] leading-[1.42] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)] print:w-auto print:max-w-none print:px-0 print:py-0 print:shadow-none">
        {/* Header */}
        <header className="border-b-2 border-black pb-3">
          <h1 className="font-display text-[26pt] leading-none tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-1.5 text-[10.5pt] font-medium">
            {profile.title}{" "}
            <span className="font-normal text-black/60">({profile.subtitle})</span>
          </p>
          <p className="mt-2 text-[8.6pt] text-black/75">
            {profile.location} · {profile.email} · {profile.phone} ·{" "}
            {profile.linkedin.replace("https://", "")} · {profile.citizenship}
          </p>
        </header>

        {/* Profile */}
        <Rule>Profile</Rule>
        <p className="text-black/85">{profile.summary.join(" ")}</p>

        {/* Experience */}
        <Rule>Experience</Rule>
        <div className="space-y-3.5">
          {roles.map((role) => (
            <section key={role.id} className="print-avoid-break">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[10.5pt] font-semibold">
                  {role.title}
                  <span className="font-normal text-black/70"> · {role.company}</span>
                </h3>
                <span className="shrink-0 font-mono text-[8pt] text-black/60">
                  {formatMonth(role.start)} — {formatMonth(role.end)}
                </span>
              </div>
              <p className="mb-1 font-mono text-[7.8pt] uppercase tracking-[0.1em] text-black/50">
                {role.location}
                {role.arrangement ? ` · ${role.arrangement}` : ""}
              </p>
              <ul className="ml-3.5 list-outside list-disc space-y-[3px] text-black/85 marker:text-black/40">
                {role.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Education */}
        <Rule>Education</Rule>
        <div className="space-y-2">
          {education.map((e) => (
            <div key={e.id} className="print-avoid-break">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[10pt] font-semibold">{e.institution}</h3>
                <span className="shrink-0 font-mono text-[8pt] text-black/60">
                  {formatMonth(e.start)} — {formatMonth(e.end)}
                </span>
              </div>
              <p className="text-black/80">
                {e.degree} <span className="text-black/55">· {e.grade}</span>
              </p>
            </div>
          ))}
          {certifications.map((c) => (
            <p key={c.id} className="text-black/80">
              <span className="font-semibold">{c.name}</span> — {c.issuer}, {c.year}
            </p>
          ))}
        </div>

        {/* Skills */}
        <Rule>Skills</Rule>
        <dl className="space-y-1">
          {skillGroups.map((g) => (
            <div key={g.id} className="flex gap-2">
              <dt className="w-[34mm] shrink-0 font-semibold">{g.label}</dt>
              <dd className="text-black/85">
                {g.items.map((i) => i.name).join(", ")}
              </dd>
            </div>
          ))}
        </dl>

        {/* Hobbies */}
        <Rule>Hobbies &amp; Interests</Rule>
        <dl className="space-y-1">
          {HOBBIES.map((h) => (
            <div key={h.label} className="flex gap-2">
              <dt className="w-[34mm] shrink-0 font-semibold">{h.label}</dt>
              <dd className="text-black/85">{h.text}</dd>
            </div>
          ))}
        </dl>

        <footer className="mt-6 border-t border-black/20 pt-2 font-mono text-[7.5pt] text-black/45">
          Full interactive version at {profile.site.replace("https://", "")}
        </footer>
      </article>
    </div>
  );
}

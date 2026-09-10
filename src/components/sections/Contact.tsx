"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { profile } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const LOOKING_FOR = [
  "Engineering Manager or Tech Lead, ideally with both people and platform in scope",
  "A team that is allowed to own its own deploys",
  "Somewhere the hard problem is organisational as often as it is technical",
  "Dublin, hybrid, or remote within Europe",
];

function CopyField({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ElementType;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = href;
    }
  };

  return (
    <div className="group flex items-center gap-4 border-b border-line py-4">
      <Icon className="size-4 shrink-0 text-fg-faint" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
          {label}
        </p>
        <a
          href={href}
          className="mt-1 block truncate text-[16px] text-fg transition-colors hover:text-accent"
        >
          {value}
        </a>
      </div>
      <button
        onClick={copy}
        aria-label={`Copy ${label}`}
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full border transition",
          copied
            ? "border-accent/50 text-accent"
            : "border-line text-fg-faint opacity-0 group-hover:opacity-100 hover:text-fg",
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="container-page scroll-mt-24 py-24 sm:py-36">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeader
            index="08"
            eyebrow="Contact"
            title={
              <>
                Let&rsquo;s talk about
                <span className="italic text-fg-dim"> what needs unblocking</span>
              </>
            }
            lede="I'm currently open to Engineering Manager and Tech Lead roles. If you've got a platform that's tangled up in something it shouldn't be, or a team that can't ship without permission, that's my favourite kind of conversation."
            className="mb-10"
          />

          <Reveal>
            <a
              href={`mailto:${profile.email}?subject=Hello%20David`}
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-[14px] font-medium text-ink transition hover:bg-fg"
            >
              Start a conversation
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:pt-4">
          <div className="rounded-xl border border-line bg-surface p-6">
            <div className="flex items-center gap-2.5">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute size-2 rounded-full bg-accent" />
                <span className="spectacle absolute size-2 animate-pulse-ring rounded-full bg-accent" />
              </span>
              <p className="text-[13px] text-accent">{profile.availability.label}</p>
            </div>
            <p className="mt-1 pl-[1.1rem] text-[12.5px] text-fg-faint">
              {profile.availability.detail}
            </p>

            <div className="mt-6">
              <CopyField
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
                icon={Mail}
              />
              <CopyField
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phoneHref}`}
                icon={Phone}
              />
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 py-4"
              >
                <ArrowUpRight className="size-4 shrink-0 text-fg-faint" />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                    LinkedIn
                  </p>
                  <p className="mt-1 text-[16px] text-fg transition-colors group-hover:text-accent">
                    /in/{profile.linkedinHandle}
                  </p>
                </div>
              </a>
            </div>

            <div className="mt-4 border-t border-line pt-5">
              <p className="eyebrow mb-3">What I&rsquo;m looking for</p>
              <ul className="space-y-2.5">
                {LOOKING_FOR.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="flex gap-3 text-[13px] leading-relaxed text-fg-dim"
                  >
                    <span className="mt-[0.55em] size-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

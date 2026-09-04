"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import { ShaderField } from "./ShaderField";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/components/layout/SmoothScroll";
import { RevealWords } from "@/components/ui/Reveal";

function DublinClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-IE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Europe/Dublin",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono tabular-nums">
      {time ?? "--:--:--"}
      <span className="ml-1.5 text-fg-faint">IST</span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    // `isolate` is load-bearing: without its own stacking context, the -z-10
    // shader layers paint behind the opaque body background and disappear.
    <section
      ref={ref}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28"
    >
      <motion.div style={{ scale }} className="spectacle absolute inset-0 -z-10">
        <ShaderField className="size-full" />
      </motion.div>
      {/* Vertical fade into the page, then a scrim so the copy always has
          contrast no matter what the shader is doing behind it. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(8,8,10,0.75)_0%,rgba(8,8,10,0.22)_28%,rgba(8,8,10,0.50)_72%,rgba(8,8,10,0.96)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(8,8,10,0.82)_0%,rgba(8,8,10,0.45)_38%,rgba(8,8,10,0.05)_72%,transparent_100%)]" />

      <motion.div style={{ y, opacity }} className="container-page relative">
        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12px] text-fg-dim"
        >
          <span className="flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.07] py-1 pl-2.5 pr-3.5">
            <span className="relative grid size-2 place-items-center">
              <span className="absolute size-2 rounded-full bg-accent" />
              <span className="absolute size-2 rounded-full bg-accent animate-pulse-ring spectacle" />
            </span>
            <span className="text-accent">{profile.availability.label}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-fg-faint" />
            {profile.location}
          </span>
          <DublinClock />
        </motion.div>

        {/* Name */}
        <h1 className="max-w-[16ch] font-display text-[clamp(3.5rem,12vw,10.5rem)] font-normal leading-[0.86] tracking-[-0.03em]">
          <span className="sr-only">
            {profile.name} — {profile.title} in {profile.location}
          </span>
          <span aria-hidden>
            <RevealWords text="David" className="block text-fg" trigger="mount" />
            <RevealWords
              text="Power"
              className="block italic text-fg-dim"
              delay={0.12}
              trigger="mount"
            />
          </span>
        </h1>

        <div className="mt-9 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow mb-4">
              {profile.title} · {profile.company}
            </p>
            <p className="max-w-[46ch] text-balance text-[clamp(1.05rem,2.1vw,1.5rem)] leading-[1.45] text-fg-dim">
              {profile.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection("#work")}
                className="group flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[13px] font-medium text-ink transition hover:bg-fg"
              >
                See the work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </button>
              <a
                href="/cv"
                className="group flex items-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-2.5 text-[13px] text-fg-dim backdrop-blur transition hover:border-fg-faint hover:text-fg"
              >
                <Download className="size-4" />
                Download CV
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 px-2 py-2.5 text-[13px] text-fg-dim transition hover:text-fg"
              >
                LinkedIn
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>

          {/* Headline numbers */}
          <motion.dl
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-2"
          >
            {profile.headline.map((stat) => (
              <div key={stat.label} className="bg-surface/70 p-4 backdrop-blur-md">
                <dt className="font-display text-3xl leading-none tracking-tight text-fg">
                  {stat.value}
                  <span className="ml-0.5 font-sans text-sm text-accent">
                    {stat.suffix}
                  </span>
                </dt>
                <dd className="mt-2 text-[11px] leading-snug text-fg-faint">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      <motion.button
        onClick={() => scrollToSection("#work")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="spectacle container-page mt-14 flex items-center gap-3 text-left text-[11px] uppercase tracking-[0.18em] text-fg-faint transition hover:text-fg-dim"
      >
        <span className="relative h-px w-16 overflow-hidden bg-line">
          <motion.span
            className="absolute inset-y-0 left-0 w-1/2 bg-accent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        Scroll
      </motion.button>
    </section>
  );
}

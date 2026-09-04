"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSite } from "@/lib/site-state";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF";

function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const fontSize = 15;
    const columns = Math.ceil(window.innerWidth / fontSize);
    const drops = Array.from({ length: columns }, () =>
      Math.random() * -window.innerHeight,
    );

    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 45) return;
      last = now;

      ctx.fillStyle = "rgba(8, 8, 10, 0.09)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columns; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fontSize;
        const y = drops[i];

        ctx.fillStyle = "#f4f4f1";
        ctx.fillText(char, x, y);
        ctx.fillStyle = "#d4f55c";
        ctx.fillText(char, x, y - fontSize);

        drops[i] += fontSize;
        if (drops[i] > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
      }
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="size-full" />;
}

function D20Overlay() {
  const [value, setValue] = useState(20);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let spins = 0;
    const id = window.setInterval(() => {
      spins += 1;
      setValue(1 + Math.floor(Math.random() * 20));
      if (spins > 16) {
        window.clearInterval(id);
        setSettled(true);
      }
    }, 70);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid size-full place-items-center">
      <motion.div
        initial={{ scale: 0.4, rotate: -120, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="relative grid place-items-center"
      >
        <svg viewBox="0 0 100 100" className="size-56 drop-shadow-[0_0_40px_rgba(212,245,92,0.35)]">
          <polygon
            points="50,4 92,28 92,72 50,96 8,72 8,28"
            fill="#0e0e11"
            stroke={settled && value === 20 ? "#d4f55c" : "#26262e"}
            strokeWidth="1.5"
          />
          <polygon points="50,4 92,28 50,50" fill="#16161b" />
          <polygon points="50,4 8,28 50,50" fill="#1e1e25" />
          <polygon points="92,28 92,72 50,50" fill="#12121a" />
          <polygon points="8,28 8,72 50,50" fill="#181820" />
          <polygon points="50,96 92,72 50,50" fill="#141419" />
          <polygon points="50,96 8,72 50,50" fill="#1a1a22" />
        </svg>
        <span
          className={`absolute font-display text-7xl tabular-nums ${
            settled && value === 20
              ? "text-accent"
              : settled && value === 1
                ? "text-rose"
                : "text-fg"
          }`}
        >
          {value}
        </span>
      </motion.div>

      <AnimatePresence>
        {settled && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 font-mono text-[12px] uppercase tracking-[0.2em] text-fg-faint"
          >
            {value === 20
              ? "Natural twenty"
              : value === 1
                ? "Natural one — rollback"
                : `You rolled ${value}`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EffectLayer() {
  const { effect, runEffect } = useSite();

  return (
    <AnimatePresence>
      {effect !== "none" && (
        <motion.div
          key={effect}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => runEffect("none")}
          className={
            effect === "crt"
              ? "pointer-events-none fixed inset-0 z-[120]"
              : "fixed inset-0 z-[120] cursor-pointer bg-ink/85 backdrop-blur-sm"
          }
        >
          {effect === "matrix" && <MatrixRain />}
          {effect === "d20" && <D20Overlay />}
          {effect === "crt" && (
            <>
              <div
                className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 1px, transparent 3px)",
                }}
              />
              <motion.div
                className="absolute inset-0 bg-accent/[0.04]"
                animate={{ opacity: [0.35, 0.8, 0.45, 0.9, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.85)]" />
            </>
          )}

          {effect !== "crt" && (
            <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              Click anywhere to dismiss
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

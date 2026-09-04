"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  amount = 0.35,
  once = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  amount?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "article";
}) {
  const reduced = useReducedMotion();
  const off = OFFSET[direction];
  const Comp = motion[as];

  if (reduced) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      data-motion-reveal
      className={className}
      initial={{ opacity: 0, x: off.x, y: off.y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Comp>
  );
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.55em", rotateX: -35 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * Word-by-word entrance for display headings.
 *
 * `trigger="mount"` is required above the fold: the words start translated down
 * inside an overflow-hidden mask, so an IntersectionObserver never sees enough
 * of them to fire and they'd sit at opacity 0 forever.
 */
export function RevealWords({
  text,
  className,
  wordClassName,
  delay = 0,
  once = true,
  trigger = "scroll",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  once?: boolean;
  trigger?: "scroll" | "mount";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  const animation =
    trigger === "mount"
      ? { animate: "visible" as const }
      : {
          whileInView: "visible" as const,
          viewport: { once, amount: 0.1 },
        };

  return (
    <span
      className={cn("inline-block", className)}
      style={{ perspective: 800 }}
      data-motion-reveal
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={wordVariants}
            custom={i + delay * 20}
            initial="hidden"
            {...animation}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

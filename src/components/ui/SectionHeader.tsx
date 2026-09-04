import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="font-mono text-[11px] text-accent/70">{index}</span>
        )}
        <span className="eyebrow">{eyebrow}</span>
        <span className="hairline h-px w-12 shrink-0 sm:w-24" />
      </div>

      <h2 className="max-w-[22ch] text-balance font-display text-[clamp(2.1rem,5.5vw,4rem)] leading-[0.98] tracking-[-0.02em]">
        {title}
      </h2>

      {lede && (
        <p
          className={cn(
            "max-w-[58ch] text-balance text-[15px] leading-relaxed text-fg-dim",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}

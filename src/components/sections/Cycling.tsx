"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Bike } from "lucide-react";
import {
  IRELAND_BOUNDS,
  IRELAND_NORTH,
  IRELAND_REPUBLIC,
  rides,
  type LatLon,
} from "@/data/cycling";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const { latMin, latMax, lonMin, lonMax } = IRELAND_BOUNDS;
const LAT_MID = (latMin + latMax) / 2;
const LON_SCALE = Math.cos((LAT_MID * Math.PI) / 180);

const VB_W = (lonMax - lonMin) * LON_SCALE * 100;
const VB_H = (latMax - latMin) * 100;

function project([lat, lon]: LatLon): [number, number] {
  return [(lon - lonMin) * LON_SCALE * 100, (latMax - lat) * 100];
}

/** Straight polyline — right for a coastline that already has enough points. */
function polyPath(points: [number, number][], closed = false): string {
  if (points.length < 2) return "";
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(" ");
  return closed ? `${d} Z` : d;
}

/** Catmull-Rom through the points, converted to cubic béziers. Keeps roads road-shaped. */
function smoothPath(points: [number, number][], closed = false): string {
  if (points.length < 2) return "";
  const pts = closed ? [...points, points[0]] : points;
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return closed ? `${d} Z` : d;
}

export function Cycling() {
  const [activeId, setActiveId] = useState(rides[0].id);
  const [hovered, setHovered] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const inView = useInView(wrapRef, { amount: 0.35 });

  const ride = rides.find((r) => r.id === activeId)!;

  const republicPath = useMemo(
    () => polyPath(IRELAND_REPUBLIC.map(project), true),
    [],
  );
  const northPath = useMemo(() => polyPath(IRELAND_NORTH.map(project), true), []);

  const routePath = useMemo(
    () => smoothPath(ride.waypoints.map((w) => project(w.at))),
    [ride],
  );

  // Send a rider along the route while the section is on screen.
  useEffect(() => {
    if (!inView) return;
    const path = pathRef.current;
    if (!path) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const length = path.getTotalLength();
    let raf = 0;
    const start = performance.now();
    const DURATION = 7000;

    const tick = (now: number) => {
      const t = ((now - start) % DURATION) / DURATION;
      // Ease in and out of each lap so the rider doesn't snap at the seam.
      const eased = t < 0.94 ? t / 0.94 : 1;
      const pt = path.getPointAtLength(eased * length);
      setMarker({ x: pt.x, y: pt.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, routePath]);

  return (
    <section id="cycling" className="container-page scroll-mt-24 py-24 sm:py-36">
      <SectionHeader
        index="06"
        eyebrow="Away from the keyboard"
        title={
          <>
            Two ends of an island,
            <span className="italic text-fg-dim"> under my own steam</span>
          </>
        }
        lede="Long-distance cycling is the closest thing I've found to project management you can feel in your legs. Plan the route, ration the effort, keep going when the weather turns."
        className="mb-12"
      />

      <div ref={wrapRef} className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        {/* Controls */}
        <div className="order-2 space-y-6 lg:order-1">
          <div className="flex flex-wrap gap-2">
            {rides.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] transition",
                  r.id === activeId
                    ? "bg-surface-2"
                    : "border-line bg-surface-2/50 text-fg-dim hover:text-fg",
                )}
                style={
                  r.id === activeId
                    ? { borderColor: `${r.colour}80`, color: r.colour }
                    : undefined
                }
              >
                {r.name}
              </button>
            ))}
          </div>

          <motion.div
            key={ride.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow">{ride.subtitle}</p>
            <p className="mt-3 flex items-baseline gap-2">
              <span
                className="font-display text-6xl leading-none tracking-tight"
                style={{ color: ride.colour }}
              >
                {ride.distanceKm}
              </span>
              <span className="font-mono text-sm text-fg-faint">km</span>
            </p>
            <p className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-fg-dim">
              {ride.blurb}
            </p>

            <ol className="mt-6 flex flex-wrap gap-x-1.5 gap-y-2">
              {ride.waypoints.map((w, i) => (
                <li key={w.name} className="flex items-center gap-1.5">
                  <span
                    onMouseEnter={() => setHovered(w.name)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "cursor-default rounded px-1.5 py-0.5 font-mono text-[11px] transition-colors",
                      w.major ? "text-fg" : "text-fg-faint",
                      hovered === w.name && "bg-surface-2 text-fg",
                    )}
                  >
                    {w.name}
                  </span>
                  {i < ride.waypoints.length - 1 && (
                    <span className="text-fg-faint/40">·</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* Map */}
        <Reveal className="order-1 lg:order-2" direction="none">
          <div className="relative mx-auto max-w-[500px]">
            <svg
              viewBox={`-26 -10 ${VB_W + 60} ${VB_H + 20}`}
              className="w-full overflow-visible"
              role="img"
              aria-label={`Map of Ireland showing the ${ride.name} cycling route`}
            >
              <defs>
                <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12121a" />
                  <stop offset="100%" stopColor="#0b0b0f" />
                </linearGradient>
                <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="1.6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* The island — two rings, so the border reads as a hairline */}
              <motion.g
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <path d={republicPath} fill="url(#sea)" stroke="#33333f" strokeWidth={0.35} />
                <path
                  d={northPath}
                  fill="url(#sea)"
                  stroke="#33333f"
                  strokeWidth={0.35}
                  strokeDasharray="1.2 1.2"
                />
              </motion.g>

              {/* Route */}
              <motion.path
                ref={pathRef}
                key={`${ride.id}-route`}
                d={routePath}
                fill="none"
                stroke={ride.colour}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Waypoints */}
              {ride.waypoints.map((w) => {
                const [x, y] = project(w.at);
                const isHovered = hovered === w.name;
                const label = w.major || isHovered;
                // Labels on the western half sit to the left so they stay on the map.
                const flip = x > VB_W * 0.62;
                return (
                  <g key={w.name}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 3 : w.major ? 2 : 1.1}
                      fill={w.major ? ride.colour : "#0b0b0f"}
                      stroke={ride.colour}
                      strokeWidth={0.7}
                      className="transition-all duration-300"
                    />
                    {label && (
                      <text
                        x={flip ? x - 4.5 : x + 4.5}
                        y={y + 2.2}
                        textAnchor={flip ? "end" : "start"}
                        fill={isHovered ? "#f4f4f1" : "#c2c2be"}
                        fontSize={6.5}
                        letterSpacing={0.15}
                        fontFamily="var(--font-mono)"
                        paintOrder="stroke"
                        stroke="#08080a"
                        strokeWidth={1.8}
                        strokeLinejoin="round"
                        className="transition-colors"
                      >
                        {w.name}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* The rider */}
              {marker && (
                <g transform={`translate(${marker.x} ${marker.y})`}>
                  <circle r={2.6} fill={ride.colour} opacity={0.18} />
                  <circle r={1.15} fill={ride.colour} filter="url(#glow)" />
                </g>
              )}
            </svg>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-fg-faint">
              <Bike className="size-3.5" style={{ color: ride.colour }} />
              <span className="font-mono uppercase tracking-[0.14em]">
                {ride.name} · {ride.distanceKm} km
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

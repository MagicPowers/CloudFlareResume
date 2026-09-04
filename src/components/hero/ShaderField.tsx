"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;      // 0..1, smoothed
uniform float uIntensity;  // 0..1 fade-in

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  // Four octaves, not five — the fifth only adds grain the eye reads as noise.
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;

  float t = uTime * 0.055;

  // Pull the field gently toward the cursor.
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  p += (m - p) * 0.06;

  vec2 sp = p * 1.15;

  // Domain warping — two rounds gives the slow aurora drift.
  vec2 q = vec2(fbm(sp + vec2(0.0, t)), fbm(sp + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(
    fbm(sp + 3.4 * q + vec2(1.7, 9.2) + 0.19 * t),
    fbm(sp + 3.4 * q + vec2(8.3, 2.8) - 0.14 * t)
  );
  float f = fbm(sp + 3.2 * r);

  vec3 ink    = vec3(0.031, 0.031, 0.039);
  vec3 violet = vec3(0.486, 0.420, 1.000);
  vec3 teal   = vec3(0.306, 0.804, 0.769);
  vec3 lime   = vec3(0.831, 0.961, 0.361);

  vec3 col = ink;
  col = mix(col, violet, clamp(f * 1.4 + 0.40, 0.0, 1.0) * 0.30);
  col = mix(col, teal,   clamp(length(q) * 1.0, 0.0, 1.0) * 0.16);
  col = mix(col, lime,   clamp(r.x * r.y * 3.2, 0.0, 1.0) * 0.17);

  // Filament highlights along the ridges of the warp. Kept sharp and faint —
  // this is the detail you notice on the second look, not the first.
  float ridge = 1.0 - abs(f * 2.0);
  col += lime * pow(clamp(ridge, 0.0, 1.0), 30.0) * 0.20;

  // Cursor bloom.
  float d = length(p - m);
  col += (violet * 0.5 + lime * 0.2) * exp(-d * 2.6) * 0.16;

  // Vignette, and fade the bottom edge into the page background.
  // (Note the explicit 1.0 - smoothstep: GLSL leaves smoothstep undefined when
  // edge0 > edge1, and some drivers return 0, which blacks out the whole field.)
  float vig = 1.0 - smoothstep(0.30, 1.05, length(uv - 0.5));
  col *= 0.35 + 0.65 * vig;
  col *= smoothstep(0.0, 0.30, uv.y) * 0.75 + 0.25;

  col = mix(ink, col, uIntensity);

  // Cheap ordered dither kills banding across the large dark gradient.
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (dither - 0.5) / 255.0;

  fragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ShaderField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // The gradient underneath is the fallback: if anything below bails out, the
    // canvas simply stays transparent and the gradient is what you see.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uIntensity = gl.getUniformLocation(program, "uIntensity");

    // Half-res on phones, capped DPR elsewhere — this shader is fill-rate bound.
    const dpr = () =>
      Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5);

    const resize = () => {
      const scale = dpr();
      const w = Math.floor(canvas.clientWidth * scale);
      const h = Math.floor(canvas.clientHeight * scale);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const target = { x: 0.5, y: 0.55 };
    const smooth = { x: 0.5, y: 0.55 };
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    let intensity = 0;
    let revealed = false;
    const start = performance.now();

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible) return;

      resize();
      if (!revealed) {
        revealed = true;
        canvas.style.opacity = "1";
      }
      smooth.x += (target.x - smooth.x) * 0.045;
      smooth.y += (target.y - smooth.y) * 0.045;
      intensity = Math.min(1, intensity + 0.012);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, smooth.x, smooth.y);
      gl.uniform1f(uIntensity, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_78%,#241d4d_0%,#12242a_40%,#08080a_78%)]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000"
      />
    </div>
  );
}

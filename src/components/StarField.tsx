import { useEffect, useRef } from "react";

type Props = {
  density?: number;
  className?: string;
  /** Connect lines between nearby stars. */
  constellation?: boolean;
};

type Star = { x: number; y: number; r: number; vx: number; vy: number; tw: number };

export function StarField({ density = 0.00012, className, constellation = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let stars: Star[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(40, Math.floor(rect.width * rect.height * density));
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.1 + 0.3,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const readColor = () => {
      const cs = getComputedStyle(document.documentElement);
      // Use the CSS variables from the theme
      const ink = cs.getPropertyValue("--color-end").trim() || "#151B25";
      const line = cs.getPropertyValue("--color-cornflower").trim() || "#AEB8C4";
      return { ink, line };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const { ink, line } = readColor();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        s.tw += 0.02;

        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const f = (1 - Math.sqrt(d2) / 140) * 0.6;
            s.x += (dx / Math.sqrt(d2 || 1)) * f;
            s.y += (dy / Math.sqrt(d2 || 1)) * f;
          }
        }

        if (s.x < 0) s.x = rect.width;
        if (s.x > rect.width) s.x = 0;
        if (s.y < 0) s.y = rect.height;
        if (s.y > rect.height) s.y = 0;

        const alpha = 0.5 + Math.sin(s.tw) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = withAlpha(ink, alpha);
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (constellation) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const a = stars[i];
            const b = stars[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 110 * 110) {
              const op = (1 - Math.sqrt(d2) / 110) * 0.22;
              ctx.strokeStyle = withAlpha(line, op);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    setSize();
    if (!reduce) raf = requestAnimationFrame(draw);
    else {
      draw();
      cancelAnimationFrame(raf);
    }

    window.addEventListener("resize", setSize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [density, constellation]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

function withAlpha(color: string, a: number) {
  if (color.startsWith('hsl')) {
      return color.replace(')', `, ${a})`).replace('hsl', 'hsla');
  }
  const h = color.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

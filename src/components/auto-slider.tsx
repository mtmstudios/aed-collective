import { useEffect, useRef } from "react";

/**
 * Generischer Endlos-Slider mit derselben Mechanik wie der CoverSlider:
 * konstante Drift nach links, Mouseover-Steuerung (linke/rechte Hälfte),
 * Ziehen/Wischen und Pfeile mit sanftem Einlaufen.
 */
export function AutoSlider({
  children,
  className = "",
  itemClassName = "",
  tempo = 0.35,
  hoverFaktor = 4,
  pfeile = true,
  pfeilKlasse = "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]",
}: {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  tempo?: number;
  hoverFaktor?: number;
  pfeile?: boolean;
  pfeilKlasse?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const speed = useRef(tempo);
  const hoverBoost = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const nudge = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;

    const tick = () => {
      if (!dragging.current) {
        offset.current -= speed.current + hoverBoost.current;
      }
      if (Math.abs(nudge.current) > 0.5) {
        const schritt = nudge.current * 0.12;
        offset.current += schritt;
        nudge.current -= schritt;
      } else {
        nudge.current = 0;
      }
      const halb = track.scrollWidth / 2;
      if (halb > 0) {
        if (offset.current <= -halb) offset.current += halb;
        if (offset.current > 0) offset.current -= halb;
      }
      track.style.transform = `translate3d(${offset.current}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const springe = (richtung: -1 | 1) => {
    const track = trackRef.current;
    const breite = (track?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 200;
    nudge.current += richtung * breite;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    if (dragging.current) {
      offset.current += e.clientX - lastX.current;
      lastX.current = e.clientX;
      return;
    }
    const rect = el.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    hoverBoost.current = (rel - 0.5) * hoverFaktor;
  };

  const items = [...children, ...children];

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden touch-pan-y select-none ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        hoverBoost.current = 0;
        dragging.current = false;
      }}
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <div ref={trackRef} className="flex will-change-transform">
        {items.map((kind, i) => (
          <div key={i} className={`shrink-0 ${itemClassName}`} aria-hidden={i >= children.length}>
            {kind}
          </div>
        ))}
      </div>

      {pfeile && (
        <>
          <button
            type="button"
            aria-label="Zurück"
            onClick={() => springe(1)}
            className={`absolute left-4 top-[15%] z-10 transition-opacity hover:opacity-70 ${pfeilKlasse}`}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Weiter"
            onClick={() => springe(-1)}
            className={`absolute right-4 top-[15%] z-10 transition-opacity hover:opacity-70 ${pfeilKlasse}`}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

import { useEffect, useRef } from "react";

/**
 * Horizontaler Cover-Slider: Bilder liegen direkt nebeneinander und laufen
 * nach links. Per Mouseover (linke/rechte Hälfte), Wischen/Ziehen oder über
 * die Pfeile lässt sich die Bewegung steuern.
 */
export function CoverSlider({
  bilder,
  alt = "Cover",
  className = "",
  itemClassName = "w-[clamp(220px,26vw,380px)]",
  zufall = true,
  tempo = 0.35,
  hoverFaktor = 4,
  pfeile = true,
}: {
  bilder: readonly string[];
  alt?: string;
  className?: string;
  itemClassName?: string;
  /** zufällige Driftwechsel (sonst konstant nach links) */
  zufall?: boolean;
  /** Grundgeschwindigkeit in px pro Frame */
  tempo?: number;
  /** Beschleunigung bei Mouseover */
  hoverFaktor?: number;
  pfeile?: boolean;
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
    let laufzeit = 0;

    const tick = () => {
      laufzeit += 1;
      if (zufall && laufzeit % 240 === 0) {
        speed.current = (Math.random() * 0.5 + 0.15) * (Math.random() < 0.5 ? -1 : 1);
      }
      if (!dragging.current) {
        offset.current -= speed.current + hoverBoost.current;
      }
      // sanftes Einlaufen der Pfeil-Sprünge
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
  }, [zufall]);

  const springe = (richtung: -1 | 1) => {
    const track = trackRef.current;
    const breite = (track?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 320;
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
    const rel = (e.clientX - rect.left) / rect.width; // 0..1
    hoverBoost.current = (rel - 0.5) * hoverFaktor;
  };

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
      <div ref={trackRef} className="flex h-full will-change-transform">
        {[...bilder, ...bilder].map((src, i) => (
          <div key={`${src}-${i}`} className={`h-full shrink-0 ${itemClassName}`}>
            <img
              src={src}
              alt={i === 0 ? alt : ""}
              aria-hidden={i === 0 ? undefined : true}
              draggable={false}
              className="h-full w-full object-cover"
              loading={i < 4 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {pfeile && (
        <>
          <button
            type="button"
            aria-label="Vorheriges Bild"
            onClick={() => springe(1)}
            className="absolute left-4 top-[15%] z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-opacity hover:opacity-70"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Nächstes Bild"
            onClick={() => springe(-1)}
            className="absolute right-4 top-[15%] z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-opacity hover:opacity-70"
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

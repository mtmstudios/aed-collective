import { useEffect, useRef } from "react";

/**
 * Horizontaler Cover-Slider: Bilder liegen direkt nebeneinander und driften
 * langsam in zufälliger Richtung. Per Mouseover (linke/rechte Hälfte) oder
 * Wischen/Ziehen lässt sich die Bewegung steuern.
 */
export function CoverSlider({
  bilder,
  alt = "Cover",
  className = "",
  itemClassName = "w-[clamp(220px,26vw,380px)]",
}: {
  bilder: readonly string[];
  alt?: string;
  className?: string;
  itemClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const speed = useRef(0.35);
  const hoverBoost = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    let laufzeit = 0;

    const tick = () => {
      laufzeit += 1;
      // alle ~4 Sekunden neue zufällige Driftgeschwindigkeit/-richtung
      if (laufzeit % 240 === 0) {
        speed.current = (Math.random() * 0.5 + 0.15) * (Math.random() < 0.5 ? -1 : 1);
      }
      if (!dragging.current) {
        offset.current -= speed.current + hoverBoost.current;
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
    hoverBoost.current = (rel - 0.5) * 4;
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
    </div>
  );
}

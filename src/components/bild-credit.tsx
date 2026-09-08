import { bildnachweis } from "@/data/bildnachweise";

/**
 * Unaufdringlicher Fotonachweis: "© Name / Stadt".
 * - variant "overlay": klein und halbtransparent in der Bildecke (für Hero-/Karten-Bilder)
 * - variant "caption": als feine Zeile unter dem Bild
 * Rendert nichts, wenn kein Nachweis hinterlegt ist.
 */
export function BildCredit({
  src,
  text,
  variant = "overlay",
  className = "",
}: {
  src?: string;
  text?: string;
  variant?: "overlay" | "caption";
  className?: string;
}) {
  const nachweis = text ?? bildnachweis(src);
  if (!nachweis) return null;

  if (variant === "caption") {
    return (
      <figcaption className={`mt-2 font-sans text-[11px] text-muted-foreground ${className}`}>
        © {nachweis}
      </figcaption>
    );
  }

  return (
    <span
      className={`pointer-events-none absolute right-2 bottom-2 z-10 font-sans text-[10px] leading-none text-white/70 mix-blend-difference ${className}`}
    >
      © {nachweis}
    </span>
  );
}

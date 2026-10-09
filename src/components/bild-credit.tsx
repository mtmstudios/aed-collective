import { useBildnachweis } from "@/data/bildnachweise";

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
  const ausVerzeichnis = useBildnachweis(src);
  const nachweis = text ?? ausVerzeichnis;
  if (!nachweis) return null;

  if (variant === "caption") {
    return (
      <figcaption className={`mt-2 font-sans text-[11px] text-muted-foreground ${className}`}>
        © {nachweis}
      </figcaption>
    );
  }

  // Bei Wettbewerbsbeiträgen steht im Nachweis das ganze Team – teils über
  // vierhundert Zeichen. Deshalb begrenzt auf zwei Zeilen, vollständig im
  // Titel-Attribut.
  return (
    <span
      title={nachweis}
      className={`pointer-events-none absolute right-2 bottom-2 z-10 line-clamp-2 max-w-[70%] text-right font-sans text-[10px] leading-snug text-white/70 [overflow-wrap:anywhere] mix-blend-difference ${className}`}
    >
      © {nachweis}
    </span>
  );
}

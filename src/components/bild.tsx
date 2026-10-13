import type { ImgHTMLAttributes } from "react";
import { useIstGesperrt } from "@/data/bildnachweise";

/**
 * Bild der Website mit Rechtevorbehalt.
 *
 * Steht ein Bild im Bildverzeichnis auf "ungeklärt" oder "nicht verwendbar",
 * zeigt die Seite an seiner Stelle eine ruhige Fläche mit dem aed-Logo – so
 * lange, bis die Freigabe eingetragen ist. Sonst verhält sich die Komponente
 * wie ein gewöhnliches <img>.
 *
 * Der Platzhalter übernimmt die Layout-Klassen des Bildes, damit an der
 * Seitenstruktur nichts verrutscht. Das Logo selbst bleibt klein und zentriert,
 * statt auf Heldengröße aufgeblasen zu werden.
 */
export function Bild({
  src,
  alt,
  className = "",
  loading,
  decoding,
  draggable,
  fetchPriority,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { src?: string; alt: string }) {
  const gesperrt = useIstGesperrt(src);

  if (gesperrt) {
    return (
      <div
        // Ohne Alternativtext ist das Bild schmückendes Beiwerk, etwa eine
        // Dublette im Laufband – dann bleibt auch der Platzhalter stumm.
        role={alt ? "img" : undefined}
        aria-label={alt ? `${alt} – Abbildung noch nicht freigegeben` : undefined}
        aria-hidden={alt ? undefined : true}
        title="Für dieses Bild sind die Nutzungsrechte noch nicht geklärt."
        className={`${className} flex items-center justify-center bg-muted`}
      >
        <img
          src="/aed-logo.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-auto w-[38%] max-w-[160px] opacity-25"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      draggable={draggable}
      fetchPriority={fetchPriority}
      {...rest}
    />
  );
}

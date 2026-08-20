import { Link } from "@tanstack/react-router";
import type { Projekt } from "@/data/neuland";
import { projektBilder } from "@/data/bilder";

export function projektBild(p: Projekt) {
  return projektBilder[`${p.jahr}/${p.slug}`]?.[0];
}

export function ProjektCard({ projekt, gross = false }: { projekt: Projekt; gross?: boolean }) {
  const bild = projektBild(projekt);

  return (
    <article className="group">
      <Link
        to="/neuland/gewinner/$jahr/$slug"
        params={{ jahr: projekt.jahr, slug: projekt.slug }}
        className="block"
      >
        <div className={`img-zoom bg-muted ${gross ? "aspect-3/2" : "aspect-4/3"}`}>
          {bild ? (
            <img
              src={bild}
              alt={`${projekt.titel} von ${projekt.autor}`}
              loading="lazy"
              decoding="async"
              className="grayscale-hover h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted" aria-hidden="true" />
          )}
        </div>

        <p className="eyebrow mt-4">
          {projekt.preis} · {projekt.jahr}
        </p>
        <h3 className={`mt-2 ${gross ? "display-md" : "display-sm"}`}>{projekt.titel}</h3>
        <p className="meta mt-2">
          {projekt.autor}
          {projekt.hochschule ? ` · ${projekt.hochschule}` : ""}
        </p>
        <p className="meta mt-1 italic">{projekt.kategorie}</p>
      </Link>
    </article>
  );
}

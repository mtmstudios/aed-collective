import { Link } from "@tanstack/react-router";
import type { Projekt } from "@/data/neuland";

export function ProjektCard({ projekt }: { projekt: Projekt }) {
  return (
    <article className="group border border-line bg-card">
      <Link
        to="/neuland/gewinner/$jahr/$slug"
        params={{ jahr: projekt.jahr, slug: projekt.slug }}
        className="flex h-full flex-col"
      >
        <div
          aria-hidden="true"
          className="aspect-4/3 bg-muted transition-colors duration-300 group-hover:bg-brand"
        />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="eyebrow">{projekt.kategorie}</span>
            <span className="text-xs font-medium">{projekt.preis}</span>
          </div>
          <h3 className="mt-4 font-display text-xl leading-tight">{projekt.titel}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {projekt.autor} · {projekt.hochschule}
          </p>
        </div>
      </Link>
    </article>
  );
}

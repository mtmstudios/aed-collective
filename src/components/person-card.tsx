import type { Person } from "@/data/site";
import { PersonDialog, personenBild } from "@/components/person-dialog";

export { personenBild };

export function PersonCard({ person }: { person: Person; basePath?: string }) {
  const bild = personenBild(person.name);

  return (
    <PersonDialog person={person}>
      <article className="group w-full cursor-pointer text-left" role="button" tabIndex={0}>
        <div className="img-zoom aspect-3/4 bg-muted">
          {bild ? (
            <img
              src={bild}
              alt={`Porträt ${person.name}`}
              loading="lazy"
              decoding="async"
              className="grayscale-hover h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted" aria-hidden="true" />
          )}
        </div>

        <h3 className="display-sm mt-4">{person.name}</h3>
        <p className="meta mt-1">{person.rolle}</p>
        <span className="eyebrow mt-3 inline-block link-brand">Mehr erfahren</span>
      </article>
    </PersonDialog>
  );
}

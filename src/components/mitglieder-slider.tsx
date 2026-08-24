import type { Person } from "@/data/site";
import { PersonDialog, personenBild } from "@/components/person-dialog";

function Portraet({ person, kopie }: { person: Person; kopie: boolean }) {
  const bild = personenBild(person.name);

  const karte = (
    <>
      <div className="img-zoom aspect-3/4 w-[168px] bg-muted md:w-[212px]">
        {bild ? (
          <img
            src={bild}
            alt={kopie ? "" : `Porträt ${person.name}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="grayscale-hover h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" aria-hidden="true" />
        )}
      </div>
      <p className="mt-3 w-[168px] font-display text-base leading-tight md:w-[212px] md:text-lg">
        {person.name}
      </p>
      <p className="meta mt-1 w-[168px] md:w-[212px]">{person.rolle}</p>
    </>
  );

  return (
    <div className="mr-5 shrink-0 md:mr-7" aria-hidden={kopie ? true : undefined}>
      {kopie ? (
        <div>{karte}</div>
      ) : (
        <PersonDialog person={person}>
          <div className="group cursor-pointer text-left" role="button" tabIndex={0}>
            {karte}
          </div>
        </PersonDialog>
      )}
    </div>
  );
}

/**
 * „Red Carpet“ der Köpfe des Vereins: Porträts laufen auf hellem Grund vorbei.
 * Die Bewegung hält bei Hover und Tastaturfokus an; ein Klick öffnet das
 * Statement der Person.
 */
export function MitgliederSlider({ items }: { items: readonly Person[] }) {
  // Liste doppelt rendern, damit der Umlauf nahtlos wirkt
  const doppelt = [...items, ...items];

  return (
    <div className="laufband-halt overflow-hidden bg-[oklch(0.968_0_0)] py-10 md:py-12">
      <div className="laufband" style={{ "--laufzeit": "95s" } as React.CSSProperties}>
        {doppelt.map((p, i) => (
          <Portraet key={`${p.name}-${i}`} person={p} kopie={i >= items.length} />
        ))}
      </div>
    </div>
  );
}

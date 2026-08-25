import type { Person } from "@/data/site";
import { PersonDialog, personenBild } from "@/components/person-dialog";
import { AutoSlider } from "@/components/auto-slider";

function Portraet({ person }: { person: Person }) {
  const bild = personenBild(person.name);

  const karte = (
    <>
      <div className="img-zoom aspect-3/4 w-[168px] bg-muted md:w-[212px]">
        {bild ? (
          <img
            src={bild}
            alt={`Porträt ${person.name}`}
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
    <PersonDialog person={person}>
      <article className="group cursor-pointer text-left" role="button" tabIndex={0}>
        {karte}
      </article>
    </PersonDialog>
  );
}

/**
 * „Red Carpet“ der Köpfe des Vereins: Porträts laufen auf hellem Grund vorbei.
 * Gleiche Mechanik wie der Jury-Slider: konstanter Drift, Mouseover-Steuerung,
 * Ziehen/Wischen und Pfeile.
 */
export function MitgliederSlider({ items }: { items: readonly Person[] }) {
  return (
    <div className="bg-[oklch(0.968_0_0)] py-10 md:py-12">
      <AutoSlider
        className=""
        itemClassName="w-[168px] pr-5 md:w-[212px] md:pr-7"
        tempo={0.35}
        hoverFaktor={4}
        pfeilKlasse="text-ink drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)]"
      >
        {items.map((p) => (
          <Portraet key={p.name} person={p} />
        ))}
      </AutoSlider>
    </div>
  );
}

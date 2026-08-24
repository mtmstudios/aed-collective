import type { Foerdermitglied } from "@/data/foerdermitglieder";

/** "Blocher Partners GmbH, Stuttgart | Berlin" -> "Blocher Partners GmbH" */
function firmenname(eintrag: string) {
  const i = eintrag.indexOf(",");
  return (i < 0 ? eintrag : eintrag.slice(0, i)).trim();
}

function Spur({
  items,
  rueckwaerts = false,
  laufzeit,
}: {
  items: readonly Foerdermitglied[];
  rueckwaerts?: boolean;
  laufzeit: string;
}) {
  // Liste doppelt rendern, damit der Umlauf nahtlos wirkt
  const doppelt = [...items, ...items];

  return (
    <div
      className={rueckwaerts ? "laufband-rueck" : "laufband"}
      style={{ "--laufzeit": laufzeit } as React.CSSProperties}
    >
      {doppelt.map((m, i) => {
        const name = firmenname(m.name);
        const kopie = i >= items.length;
        return (
          <span
            key={`${name}-${i}`}
            className="flex shrink-0 items-center"
            aria-hidden={kopie ? true : undefined}
          >
            {m.url && !kopie ? (
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-1 text-white/90 transition-colors hover:text-[var(--brand)]"
              >
                {name}
              </a>
            ) : (
              <span className="px-6 py-1 text-white/90">{name}</span>
            )}
            <span className="text-white/30" aria-hidden="true">
              /
            </span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Prominentes Laufband der Fördermitglieder: zwei gegenläufige Spuren auf
 * schwarzem Grund. Beim Überfahren hält die Bewegung an, damit die Links
 * anklickbar bleiben.
 */
export function MitgliederSlider({ items }: { items: readonly Foerdermitglied[] }) {
  const mitte = Math.ceil(items.length / 2);
  const oben = items.slice(0, mitte);
  const unten = items.slice(mitte);

  return (
    <div className="laufband-halt overflow-hidden bg-black py-10 md:py-14">
      <div className="flex flex-col gap-3 font-display text-2xl leading-tight md:gap-4 md:text-4xl">
        <Spur items={oben} laufzeit="80s" />
        <Spur items={unten} laufzeit="95s" rueckwaerts />
      </div>
    </div>
  );
}

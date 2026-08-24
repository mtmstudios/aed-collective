import type { Logo } from "@/data/logos";

/** "Blocher Partners GmbH, Stuttgart | Berlin" -> "Blocher Partners GmbH" */
function firmenname(eintrag: string) {
  const i = eintrag.indexOf(",");
  return (i < 0 ? eintrag : eintrag.slice(0, i)).trim();
}

function Kachel({ logo, kopie }: { logo: Logo; kopie: boolean }) {
  const name = firmenname(logo.name);
  const inhalt = (
    <img
      src={logo.datei}
      alt={kopie ? "" : name}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="max-h-full max-w-full object-contain"
    />
  );

  const kachel = `flex h-[104px] w-[220px] shrink-0 items-center justify-center px-7 py-6 md:h-[128px] md:w-[268px] ${
    logo.hell ? "bg-[#111]" : "bg-white"
  }`;

  return (
    <div className="mr-4 md:mr-6" aria-hidden={kopie ? true : undefined}>
      {logo.url && !kopie ? (
        <a
          href={logo.url}
          target="_blank"
          rel="noreferrer"
          title={name}
          className={`${kachel} transition-opacity hover:opacity-80`}
        >
          {inhalt}
        </a>
      ) : (
        <div className={kachel}>{inhalt}</div>
      )}
    </div>
  );
}

function Spur({
  items,
  rueckwaerts = false,
  laufzeit,
}: {
  items: readonly Logo[];
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
      {doppelt.map((l, i) => (
        <Kachel key={`${l.name}-${i}`} logo={l} kopie={i >= items.length} />
      ))}
    </div>
  );
}

/**
 * Sponsorenwand der Fördermitglieder: zwei gegenläufige Spuren mit Logokacheln
 * auf dunklem Grund. Die Bewegung hält bei Hover und Tastaturfokus an, damit
 * die Links erreichbar bleiben.
 */
export function MitgliederSlider({ items }: { items: readonly Logo[] }) {
  const mitte = Math.ceil(items.length / 2);
  return (
    <div className="laufband-halt overflow-hidden bg-[#0b0b0b] py-8 md:py-10">
      <div className="flex flex-col gap-4 md:gap-6">
        <Spur items={items.slice(0, mitte)} laufzeit="70s" />
        <Spur items={items.slice(mitte)} laufzeit="85s" rueckwaerts />
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { referenten } from "@/data/site";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/referenten")({
  head: () => ({
    meta: [
      { title: "Referent:innen – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Durchsuchbare Liste aller Referentinnen und Referenten, die beim aed e.V. gesprochen haben – von A bis Z.",
      },
      { property: "og:title", content: "Referent:innen – aed e.V. Stuttgart" },
      { property: "og:description", content: "Alle Referentinnen und Referenten des aed e.V. von A bis Z." },
      { property: "og:url", content: "/referenten" },
    ],
    links: [{ rel: "canonical", href: "/referenten" }],
  }),
  component: ReferentenPage,
});

function nachname(name: string) {
  const teile = name.split(" ");
  return teile[teile.length - 1];
}

function ReferentenPage() {
  const [suche, setSuche] = useState("");

  const gruppen = useMemo(() => {
    const gefiltert = referenten
      .filter((r) => r.toLowerCase().includes(suche.trim().toLowerCase()))
      .sort((a, b) => nachname(a).localeCompare(nachname(b), "de"));
    const map = new Map<string, string[]>();
    for (const r of gefiltert) {
      const b = nachname(r)[0].toUpperCase();
      map.set(b, [...(map.get(b) ?? []), r]);
    }
    return [...map.entries()];
  }, [suche]);

  const buchstaben = gruppen.map(([b]) => b);

  return (
    <>
      <PageHeader
        eyebrow="Archiv"
        titel="Referent:innen"
        intro="Wer bei uns gesprochen hat: Gestalterinnen, Ingenieure, Kuratorinnen und Publizisten aus dem In- und Ausland."
      />

      <div className="shell rule-t py-6">
        <label htmlFor="suche" className="eyebrow">
          Suche
        </label>
        <div className="mt-2 flex max-w-md items-center gap-2 border border-line bg-card px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            id="suche"
            type="search"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            maxLength={80}
            placeholder="Name eingeben"
            className="w-full bg-transparent py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <nav aria-label="Sprungnavigation A–Z" className="mt-6 flex flex-wrap gap-1">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((b) => (
            <a
              key={b}
              href={`#buchstabe-${b}`}
              aria-disabled={!buchstaben.includes(b)}
              className={`flex size-9 items-center justify-center font-display text-sm ${
                buchstaben.includes(b)
                  ? "border border-line hover:bg-foreground hover:text-background"
                  : "pointer-events-none text-muted-foreground/50"
              }`}
            >
              {b}
            </a>
          ))}
        </nav>
      </div>

      <section className="shell pb-24">
        {gruppen.length === 0 && (
          <p className="py-12 text-muted-foreground">Keine Treffer für „{suche}“.</p>
        )}
        {gruppen.map(([buchstabe, namen]) => (
          <div key={buchstabe} id={`buchstabe-${buchstabe}`} className="rule-t scroll-mt-24 py-8">
            <div className="grid gap-6 md:grid-cols-12">
              <h2 className="display-md md:col-span-2">{buchstabe}</h2>
              <ul className="md:col-span-10 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {namen.map((n) => (
                  <li key={n} className="border-b border-line py-2">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

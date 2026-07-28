import { createFileRoute, Link } from "@tanstack/react-router";
import { kennzahlen, projekte, wettbewerbStatus } from "@/data/neuland";
import { ProjektCard } from "@/components/projekt-card";

export const Route = createFileRoute("/neuland/")({
  head: () => ({
    meta: [
      { title: "neuland – Nachwuchswettbewerb des aed e.V." },
      {
        name: "description",
        content:
          "neuland zeichnet herausragende Abschlussarbeiten aus Architektur, Engineering, Produkt-, Kommunikationsdesign und Szenografie in Baden-Württemberg aus.",
      },
      { property: "og:title", content: "neuland – Nachwuchswettbewerb des aed e.V." },
      { property: "og:description", content: "Der Nachwuchswettbewerb für Gestaltung in Baden-Württemberg." },
      { property: "og:url", content: "/neuland" },
    ],
    links: [{ rel: "canonical", href: "/neuland" }],
  }),
  component: NeulandIndex,
});

function tageBis(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function NeulandIndex() {
  const highlights = projekte.filter((p) => p.jahr === "2025" && p.preis === "1. Preis");
  const tage = tageBis(wettbewerbStatus.einsendeschluss);

  return (
    <>
      <section className="shell pt-16 pb-16 md:pt-24">
        <p
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-sm"
          style={{
            background: wettbewerbStatus.offen ? "var(--brand)" : "var(--muted)",
            color: wettbewerbStatus.offen ? "var(--brand-foreground)" : "var(--muted-foreground)",
          }}
        >
          <span aria-hidden="true">●</span>
          {wettbewerbStatus.offen
            ? `Einreichung offen – noch ${tage} Tage bis ${wettbewerbStatus.einsendeschlussLabel}`
            : "Einreichung derzeit geschlossen"}
        </p>
        <h1 className="display-xl mt-8">neuland</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          Du hast deine Abschlussarbeit fertig und findest, sie hat mehr verdient als einen Ordner
          auf der Festplatte? neuland zeichnet die besten Arbeiten aus Baden-Württemberg aus – in
          fünf Kategorien, mit 2.000 € je 1. Preis.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/neuland/teilnahme" className="btn-solid">
            Jetzt einreichen
          </Link>
          <Link to="/neuland/wettbewerb" className="btn-outline">
            Wettbewerb im Detail
          </Link>
        </div>
      </section>

      <section className="shell rule-t py-12" aria-label="Zahlen zum Wettbewerb">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {kennzahlen.map((k) => (
            <div key={k.label}>
              <dt className="sr-only">{k.label}</dt>
              <dd>
                <span className="block font-display text-5xl" style={{ color: "var(--brand-deep)" }}>
                  {k.wert}
                </span>
                <span className="mt-2 block text-sm text-muted-foreground">{k.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell rule-t py-12" aria-labelledby="gewinner-2025">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="gewinner-2025" className="display-md">
            1. Preise 2025
          </h2>
          <Link to="/neuland/gewinner" className="text-sm underline link-brand">
            Alle Jahrgänge
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((p) => (
            <li key={p.slug}>
              <ProjektCard projekt={p} />
            </li>
          ))}
        </ul>
      </section>

      <section className="shell rule-t py-12 pb-24" aria-labelledby="cross">
        <div className="grid gap-8 md:grid-cols-12">
          <h2 id="cross" className="eyebrow md:col-span-3">
            Jung &amp; hungrig
          </h2>
          <div className="md:col-span-9 max-w-2xl">
            <p className="text-lg leading-relaxed">
              neuland ist ein Projekt des aed e.V. – und der Verein hat mehr zu bieten als einen
              Wettbewerb: Vorträge, Exkursionen und Feste, bei denen du genau die Leute triffst, die
              deine Arbeit interessiert. Für Studierende kostet die Mitgliedschaft 30 € im Jahr.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/programm" className="btn-outline">
                Vereinsprogramm ansehen
              </Link>
              <Link to="/mitglied-werden" className="btn-outline">
                Studi-Mitgliedschaft
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

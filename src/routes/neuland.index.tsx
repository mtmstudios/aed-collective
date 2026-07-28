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
          "aed neuland – der interdisziplinäre Nachwuchswettbewerb für Studierende und Absolvent:innen bis 28 Jahre. Fünf Kategorien, 2.000 € je 1. Preis, gefördert von der Karl Schlecht Stiftung.",
      },
      { property: "og:title", content: "neuland – Nachwuchswettbewerb des aed e.V." },
      { property: "og:description", content: "Der interdisziplinäre Nachwuchswettbewerb für junge Gestalter:innen." },
      { property: "og:url", content: "/neuland" },
    ],
    links: [{ rel: "canonical", href: "/neuland" }],
  }),
  component: NeulandIndex,
});

function NeulandIndex() {
  const highlights = projekte.filter((p) => p.jahr === "2025" && p.preis === "1. Preis");

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
          {wettbewerbStatus.offen ? "Einreichung offen" : "Einreichung derzeit geschlossen"}
        </p>
        <h1 className="display-xl mt-8">neuland</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          Du hast eine Abschluss-, Semester- oder freie Arbeit, die mehr verdient hat als einen
          Ordner auf der Festplatte? neuland zeichnet die besten Arbeiten junger Gestalter:innen
          aus – in fünf Kategorien, mit 2.000 € je 1. Preis. Teilnahmeberechtigt sind Studierende
          und Absolvent:innen aller Hochschulen bis 28 Jahre.
        </p>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{wettbewerbStatus.hinweis}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/neuland/wettbewerb" className="btn-solid">
            Wettbewerb im Detail
          </Link>
          <Link to="/neuland/teilnahme" className="btn-outline">
            Teilnahmebedingungen
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
              Wettbewerb: Vorträge, Führungen, Studiobesuche und Feste, bei denen du genau die Leute
              triffst, die deine Arbeit interessiert. Mit der Reihe „jung &amp; hungrig“ besuchen
              wir regelmäßig aufstrebende junge Studios.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/programm" className="btn-outline">
                Vereinsprogramm ansehen
              </Link>
              <Link to="/mitglied-werden" className="btn-outline">
                Mitglied werden
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

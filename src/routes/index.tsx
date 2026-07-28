import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { events, partner } from "@/data/site";
import { kennzahlen, projekte } from "@/data/neuland";
import { EventCard } from "@/components/event-card";
import { LogoGrid } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "aed e.V. – Architecture Engineering Design Stuttgart" },
      {
        name: "description",
        content:
          "Veranstaltungen, Austausch, Förderung: der aed e.V. verbindet Architektur, Engineering und Design in Stuttgart – mit dem Nachwuchswettbewerb neuland.",
      },
      { property: "og:title", content: "aed e.V. – Architecture Engineering Design Stuttgart" },
      {
        property: "og:description",
        content: "Veranstaltungen, Austausch und Förderung für Gestaltung in Stuttgart.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const naechste = [...events]
    .filter((e) => new Date(e.datum) >= new Date("2026-01-01"))
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, 3);
  const highlights = projekte.filter((p) => p.jahr === "2025" && p.preis === "1. Preis").slice(0, 3);

  return (
    <>
      <section className="shell pt-16 pb-20 md:pt-28 md:pb-28">
        <p className="eyebrow">Architecture · Engineering · Design · Stuttgart</p>
        <h1 className="display-xl mt-6 max-w-5xl">Veranstaltungen Austausch Förderung</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          Der aed e.V. bringt seit über zwanzig Jahren Architektinnen, Ingenieure und Designerinnen
          an einen Tisch – in Vorträgen, Exkursionen und Festen, und im Nachwuchswettbewerb neuland.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/programm" className="btn-solid">
            Programm ansehen
          </Link>
          <Link to="/mitglied-werden" className="btn-outline">
            Mitglied werden
          </Link>
        </div>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="programm-titel">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="programm-titel" className="display-md">
            Nächste Veranstaltungen
          </h2>
          <Link to="/programm" className="inline-flex items-center gap-2 text-sm link-brand">
            Alle Termine <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {naechste.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      </section>

      <section className="shell rule-t py-16 md:py-24" aria-labelledby="mission-titel">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="mission-titel" className="eyebrow md:col-span-3">
            Mission
          </h2>
          <div className="md:col-span-9">
            <p className="display-md max-w-4xl">
              „Eine unglaubliche Menge Kreativität stammt aus Stuttgart – man muss sie nur sichtbar
              machen.“
            </p>
            <p className="mt-8 max-w-2xl leading-relaxed text-muted-foreground">
              Wir schaffen Gelegenheiten für Gespräche zwischen Disziplinen, die sich sonst selten
              begegnen. Wir fördern den gestalterischen Nachwuchs der Region und machen sichtbar,
              welche Qualität hier entsteht. Und wir bringen Menschen zusammen, die Verantwortung
              für die gebaute und gestaltete Umwelt übernehmen.
            </p>
            <Link to="/verein" className="mt-8 inline-flex items-center gap-2 text-sm link-brand">
              Über den Verein <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="theme-neuland border-y border-line bg-card" aria-labelledby="neuland-titel">
        <div className="shell py-16 md:py-24">
          <p className="eyebrow" style={{ color: "var(--brand-deep)" }}>
            Nachwuchswettbewerb
          </p>
          <h2 id="neuland-titel" className="display-lg mt-4">
            neuland
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            Der Wettbewerb für Abschlussarbeiten aus Architektur, Engineering, Produkt-,
            Kommunikationsdesign und Szenografie in Baden-Württemberg. Jung &amp; hungrig – und
            ausgezeichnet.
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
            {kennzahlen.map((k) => (
              <div key={k.label}>
                <dt className="sr-only">{k.label}</dt>
                <dd>
                  <span className="block font-display text-4xl" style={{ color: "var(--brand-deep)" }}>
                    {k.wert}
                  </span>
                  <span className="mt-2 block text-sm text-muted-foreground">{k.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {highlights.map((p) => (
              <li key={p.slug} className="border border-line bg-background p-6">
                <span className="eyebrow">{p.kategorie} · 1. Preis 2025</span>
                <h3 className="mt-3 font-display text-lg leading-tight">{p.titel}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.autor}</p>
                <Link
                  to="/neuland/gewinner/$jahr/$slug"
                  params={{ jahr: p.jahr, slug: p.slug }}
                  className="mt-4 inline-block text-sm underline link-brand"
                >
                  Projekt ansehen
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              to="/neuland"
              className="inline-flex min-h-11 items-center rounded-full bg-brand px-6 font-display text-sm text-brand-foreground hover:opacity-85"
            >
              Zum Wettbewerb
            </Link>
            <Link to="/neuland/gewinner" className="btn-outline">
              Gewinner:innen
            </Link>
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-24" aria-labelledby="partner-titel">
        <h2 id="partner-titel" className="display-md">
          Kooperationspartner
        </h2>
        <div className="mt-10">
          <LogoGrid items={partner} />
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Dazu rund 80 Fördermitglieder und über 400 Personenmitglieder.{" "}
          <Link to="/mitglieder" className="underline link-brand">
            Alle Mitglieder
          </Link>
        </p>
      </section>
    </>
  );
}

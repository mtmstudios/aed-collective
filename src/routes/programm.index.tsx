import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { events, eventFormate } from "@/data/site";
import { referenten } from "@/data/referenten";
import { EventCard } from "@/components/event-card";
import { SectionTitle } from "@/components/ui-bits";
import { CoverSlider } from "@/components/cover-slider";

import { coverBilder } from "@/data/cover";

export const Route = createFileRoute("/programm/")({
  head: () => ({
    meta: [
      { title: "Programm – Veranstaltungen des aed e.V." },
      {
        name: "description",
        content:
          "Vorträge, Exkursionen, Werkstattgespräche und Feste des aed e.V. in Stuttgart – kommende Termine und Archiv.",
      },
      { property: "og:title", content: "Programm – Veranstaltungen des aed e.V." },
      { property: "og:description", content: "Alle Veranstaltungen des aed e.V. in Stuttgart." },
      { property: "og:url", content: "/programm" },
    ],
    links: [{ rel: "canonical", href: "/programm" }],
  }),
  component: ProgrammPage,
});

const coverfotos = coverBilder;

function ProgrammPage() {
  const [filter, setFilter] = useState<string>("Alle");
  const [archivOffen, setArchivOffen] = useState(false);
  const [referentenOffen, setReferentenOffen] = useState(false);

  const referentenSortiert = useMemo(
    () =>
      [...referenten].sort((a, b) => {
        const nn = (n: string) => n.split(" ").slice(-1)[0];
        return nn(a.name).localeCompare(nn(b.name), "de");
      }),
    [],
  );

  const { kommend, archiv } = useMemo(() => {
    const heute = new Date().toISOString().slice(0, 10);
    const gefiltert = events.filter((e) => filter === "Alle" || e.format === filter);
    return {
      kommend: gefiltert.filter((e) => e.datum >= heute).sort((a, b) => a.datum.localeCompare(b.datum)),
      archiv: gefiltert.filter((e) => e.datum < heute).sort((a, b) => b.datum.localeCompare(a.datum)),
    };
  }, [filter]);

  return (
    <>
      <section className="bleed relative" aria-labelledby="programm-titel-head">
        <div className="relative h-[clamp(380px,52vh,620px)] w-full overflow-hidden bg-muted">
          <CoverSlider
            bilder={coverfotos}
            alt="Coverfotos vergangener Veranstaltungen des aed e.V."
            className="h-full w-full"
            itemClassName="h-full w-auto aspect-[1/1.414]"
            hoverFaktor={14}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="shell pb-10 md:pb-14">
              <p className="eyebrow text-white/85">Programm</p>
              <h1 id="programm-titel-head" className="display-xl mt-4 text-white">
                Veranstaltungen
              </h1>
              <p className="lead mt-5 max-w-2xl text-white/90">
                Rund 20 Mal im Jahr laden wir zu Vorträgen, Führungen, Studiobesuchen, Filmabenden
                und Festen ein. Weitere Termine kündigen wir über Newsletter, Instagram und unsere
                WhatsApp-Gruppe an.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="shell" aria-label="Filter nach Format">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-line py-5">
          {["Alle", ...eventFormate].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`font-sans text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
                filter === f
                  ? "underline decoration-1 underline-offset-[6px]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="shell py-12 md:py-16" aria-labelledby="kommend-titel">
        <SectionTitle id="kommend-titel" titel="Kommende Termine" />
        {kommend.length === 0 ? (
          <p className="lead mt-8 text-muted-foreground">
            Für dieses Format ist derzeit kein Termin geplant.
          </p>
        ) : (
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            <article className="group">
              <div className="img-zoom aspect-3/2 bg-muted">
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="eyebrow text-muted-foreground">Platzhalter</span>
                </div>
              </div>
              <p className="eyebrow mt-4">Download</p>
              <h3 className="display-sm mt-2">Aktueller Flyer</h3>
              <p className="meta mt-2">Programmheft · aed e.V.</p>
              <p className="mt-3 text-base leading-relaxed">
                Das aktuelle Programmheft mit allen Terminen des Halbjahres – hier folgt in Kürze der
                Download.
              </p>
            </article>
            {kommend.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}
      </section>

      <section className="bleed topic-rule bg-[oklch(0.968_0_0)]" aria-labelledby="jung-hungrig">
        <div className="shell grid gap-8 py-14 md:grid-cols-12 md:py-20">
          <h2 id="jung-hungrig" className="eyebrow-muted md:col-span-3">
            Jung & hungrig
          </h2>
          <div className="md:col-span-9 max-w-2xl">
            <p className="prose-editorial">
              Mit der Reihe „jung & hungrig“ besuchen wir regelmäßig aufstrebende junge Studios –
              Vorträge, Führungen, Studiobesuche und Feste, bei denen du genau die Leute triffst, die
              deine Arbeit interessieren. Ein Format des aed e.V. für die nächste Generation an
              Gestalter:innen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/mitglied-werden" className="btn-outline">
                Mitglied werden
              </Link>
              <Link to="/neuland" className="btn-outline">
                Zum Wettbewerb neuland
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="shell topic-rule py-12 md:py-16" aria-labelledby="archiv-titel">
        <p id="archiv-titel" className="eyebrow">
          Archiv
        </p>
        <button
          type="button"
          onClick={() => setArchivOffen((v) => !v)}
          aria-expanded={archivOffen}
          className="mt-4 flex w-full items-baseline justify-between gap-4 text-left"
        >
          <h2 className="display-md">Letzte Termine</h2>
          <span className="eyebrow shrink-0">
            {archivOffen ? "Schließen" : `${archiv.length} Termine`}
          </span>
        </button>
        {archivOffen && (
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {archiv.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}

        <div className="mt-10 rule-t pt-6">
          <button
            type="button"
            onClick={() => setReferentenOffen((v) => !v)}
            aria-expanded={referentenOffen}
            className="flex w-full items-baseline justify-between gap-4 text-left"
          >
            <h3 id="referenten-titel" className="display-md">
              Referent:innen
            </h3>
            <span className="eyebrow shrink-0">
              {referentenOffen ? "Schließen" : `${referenten.length} Personen`}
            </span>
          </button>
          {referentenOffen && (
            <>
              <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {referentenSortiert.map((r) => (
                  <li key={`${r.name}-${r.org}`} className="border-b border-line pb-2">
                    <span className="block text-base">{r.name}</span>
                    <span className="meta block">
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noreferrer" className="link-underline">
                          {r.org}
                        </a>
                      ) : (
                        r.org
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/referenten" className="eyebrow link-underline mt-8 inline-block">
                Zur vollständigen Referent:innen-Seite
              </Link>
            </>
          )}
        </div>
      </section>

    </>
  );
}

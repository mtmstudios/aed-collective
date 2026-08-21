import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { events, eventFormate } from "@/data/site";
import { EventCard } from "@/components/event-card";
import { PageHeader, SectionTitle } from "@/components/ui-bits";

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

function ProgrammPage() {
  const [filter, setFilter] = useState<string>("Alle");
  const [archivOffen, setArchivOffen] = useState(false);

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
      <section className="bleed relative border-b border-line" aria-labelledby="programm-titel-head">
        <div className="relative h-[clamp(380px,52vh,620px)] w-full overflow-hidden bg-muted">
          <CoverSlider
            bilder={coverfotos}
            alt="Coverfotos vergangener Veranstaltungen des aed e.V."
            className="h-full w-full"
            itemClassName="w-[clamp(200px,22vw,340px)]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
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
            {kommend.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}
      </section>

      <section className="shell border-t border-line py-12 md:py-16" aria-labelledby="archiv-titel">
        <button
          type="button"
          onClick={() => setArchivOffen((v) => !v)}
          aria-expanded={archivOffen}
          className="flex w-full items-baseline justify-between gap-4 text-left"
        >
          <h2 id="archiv-titel" className="display-md">
            Archiv
          </h2>
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
      </section>
    </>
  );
}

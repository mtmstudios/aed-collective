import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { events, eventFormate } from "@/data/site";
import { EventCard } from "@/components/event-card";
import { PageHeader } from "@/components/ui-bits";

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
      <PageHeader
        eyebrow="Programm"
        titel="Veranstaltungen"
        intro="Rund 20 Mal im Jahr laden wir zu Vorträgen, Führungen, Studiobesuchen, Filmabenden und Festen ein. Weitere Termine kündigen wir über Newsletter, Instagram und unsere WhatsApp-Gruppe an."
      />

      <section className="shell bg-background" aria-label="Filter nach Format">
        <div className="flex flex-wrap gap-2 border-y border-line py-4">
          {["Alle", ...eventFormate].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
                filter === f
                  ? "border-foreground bg-foreground text-background"
                  : "border-line hover:border-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="shell band-muted py-12" aria-labelledby="kommend-titel">
        <h2 id="kommend-titel" className="display-lg">
          Kommende Termine
        </h2>
        {kommend.length === 0 ? (
          <p className="mt-6 text-muted-foreground">Für dieses Format ist derzeit kein Termin geplant.</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {kommend.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}
      </section>

      <section className="shell bg-background py-24" aria-labelledby="archiv-titel">
        <div className="flex flex-col items-start gap-6">
          <div className="max-w-2xl">
            <h2 id="archiv-titel" className="display-lg">
              Archiv
            </h2>
            <p className="mt-2 text-muted-foreground">
              Vergangene Vorträge, Exkursionen und Feste zum Nachlesen.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setArchivOffen((v) => !v)}
            aria-expanded={archivOffen}
            className="btn-solid"
          >
            {archivOffen ? "Archiv schließen" : "Ins Archiv schauen"}
            <span aria-hidden="true" className="font-display text-sm">
              {archivOffen ? "−" : "+"}
            </span>
          </button>
        </div>
        {archivOffen && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {archiv.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

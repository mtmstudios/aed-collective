import { createFileRoute } from "@tanstack/react-router";
import { jury2025 } from "@/data/neuland";
import { juryImpressionen } from "@/data/bilder";
import { PersonCard } from "@/components/person-card";
import { PageHeader, SectionTitle } from "@/components/ui-bits";
import { Bild } from "@/components/bild";
import { BildCredit } from "@/components/bild-credit";

export const Route = createFileRoute("/neuland/jury-2025")({
  head: () => ({
    meta: [
      { title: "Jury 2025 (Archiv) – neuland | aed e.V." },
      {
        name: "description",
        content:
          "Archiv: Die 21-köpfige Jury von neuland 2025 aus Architektur, Engineering, Design, Szenografie und Publizistik.",
      },
      { property: "og:title", content: "Jury 2025 (Archiv) – neuland | aed e.V." },
      {
        property: "og:description",
        content: "21 Fachleute entscheiden über die Preise des Wettbewerbs.",
      },
      { property: "og:url", content: "/neuland/jury-2025" },
    ],
    links: [{ rel: "canonical", href: "/neuland/jury-2025" }],
  }),
  component: JuryPage,
});

function JuryPage() {
  return (
    <>
      <PageHeader
        eyebrow="neuland · Archiv"
        titel="Jury 2025"
        intro="Eine unabhängige Jury aus anerkannten Fachleuten aus Architektur, Ingenieurwesen und Design sichtet alle Einreichungen und entscheidet mit einfacher Stimmenmehrheit. Mehrere Mitglieder sind zugleich im Beirat des aed."
      />
      <section className="shell py-12 md:py-16">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {jury2025.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </section>

      {juryImpressionen.length > 0 && (
        <section className="shell topic-rule py-12 md:py-16" aria-labelledby="impressionen">
          <SectionTitle id="impressionen" titel="Impressionen der Jurysitzung" kicker="2025" />
          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>figure]:mb-6 [&>figure]:break-inside-avoid">
            {juryImpressionen.map((b, i) => (
              <figure key={b}>
                <Bild
                  src={b}
                  alt={`Impression aus der Jurysitzung neuland 2025, Bild ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="grayscale-hover w-full bg-muted object-cover"
                />
                <BildCredit src={b} variant="caption" />
              </figure>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

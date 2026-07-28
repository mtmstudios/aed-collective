import { createFileRoute } from "@tanstack/react-router";
import { jury2025 } from "@/data/neuland";
import { PersonCard } from "@/components/person-card";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/jury")({
  head: () => ({
    meta: [
      { title: "Jury – neuland | aed e.V." },
      {
        name: "description",
        content:
          "Die 21-köpfige Jury des Nachwuchswettbewerbs neuland aus Architektur, Engineering, Design, Szenografie und Publizistik.",
      },
      { property: "og:title", content: "Jury – neuland | aed e.V." },
      { property: "og:description", content: "21 Fachleute entscheiden über die Preise des Wettbewerbs." },
      { property: "og:url", content: "/neuland/jury" },
    ],
    links: [{ rel: "canonical", href: "/neuland/jury" }],
  }),
  component: JuryPage,
});

function JuryPage() {
  return (
    <>
      <PageHeader
        eyebrow="neuland"
        titel="Jury"
        intro="Die Jury tagt an einem Tag in Stuttgart, sichtet alle Einreichungen und entscheidet unabhängig. Mehrere Mitglieder sind zugleich im Beirat des aed."
      />
      <section className="shell pb-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jury2025.map((p) => (
            <li key={p.name}>
              <PersonCard person={p} />
            </li>
          ))}
        </ul>
      </section>

      <section className="shell pb-24" aria-labelledby="galerie">
        <h2 id="galerie" className="display-md rule-t pt-8">
          Aus der Jurysitzung
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <li key={i}>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='3'%3E%3Crect width='4' height='3' fill='%23ebebeb'/%3E%3C/svg%3E"
                alt={`Impression aus der Jurysitzung neuland, Bild ${i + 1}`}
                loading="lazy"
                decoding="async"
                width={400}
                height={300}
                className="aspect-4/3 w-full bg-muted object-cover grayscale-hover"
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

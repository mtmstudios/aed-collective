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
        titel="Jury 2025"
        intro="Eine unabhängige Jury aus anerkannten Fachleuten aus Architektur, Ingenieurwesen und Design sichtet alle Einreichungen und entscheidet mit einfacher Stimmenmehrheit. Mehrere Mitglieder sind zugleich im Beirat des aed."
      />
      <section className="shell pb-24">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jury2025.map((p) => (
            <li key={p.name}>
              <PersonCard person={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

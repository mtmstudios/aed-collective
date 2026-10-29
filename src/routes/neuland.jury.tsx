import { createFileRoute } from "@tanstack/react-router";
import { jury2027 } from "@/data/neuland";
import { PersonCard } from "@/components/person-card";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/jury")({
  head: () => ({
    meta: [
      { title: "Jury 2027 – neuland | aed e.V." },
      {
        name: "description",
        content:
          "Die Jury von neuland 2027, dem Nachwuchswettbewerb des aed, aus Architektur, Engineering, Design, Szenografie und Publizistik.",
      },
      { property: "og:title", content: "Jury 2027 – neuland | aed e.V." },
      {
        property: "og:description",
        content: "15 Fachleute entscheiden über die Preise des Wettbewerbs.",
      },
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
        titel="Jury 2027"
        intro="Eine unabhängige Jury aus anerkannten Fachleuten aus Architektur, Ingenieurwesen und Design sichtet alle Einreichungen und entscheidet mit einfacher Stimmenmehrheit. Mehrere Mitglieder sind zugleich im Beirat des aed."
      />
      <section className="shell py-12 md:py-16">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {jury2027.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </section>

    </>
  );
}

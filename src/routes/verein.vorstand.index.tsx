import { createFileRoute } from "@tanstack/react-router";
import { vorstand } from "@/data/site";
import { PersonCard } from "@/components/person-card";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/verein/vorstand/")({
  head: () => ({
    meta: [
      { title: "Vorstand – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Der Vorstand des aed e.V.: Dr. Frank Heinlein, Johanna Neves Pimenta, Sara Dahme, Frank Seeger und Ehrenvorsitzender Werner Sobek.",
      },
      { property: "og:title", content: "Vorstand – aed e.V. Stuttgart" },
      { property: "og:description", content: "Die fünf Personen im Vorstand des aed e.V." },
      { property: "og:url", content: "/verein/vorstand" },
    ],
    links: [{ rel: "canonical", href: "/verein/vorstand" }],
  }),
  component: VorstandPage,
});

function VorstandPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verein"
        titel="Vorstand"
        intro="Der Vorstand führt die Geschäfte des Vereins ehrenamtlich und verantwortet Programm, Kommunikation und Finanzen."
      />
      <section className="shell pb-24">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vorstand.map((p) => (
            <li key={p.name}>
              <PersonCard person={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { jahrgaenge, projekte } from "@/data/neuland";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/gewinner/")({
  head: () => ({
    meta: [
      { title: "Gewinner:innen – neuland | aed e.V." },
      {
        name: "description",
        content:
          "Alle Preisträgerinnen und Preisträger des Nachwuchswettbewerbs neuland seit 2019 – nach Jahrgängen sortiert.",
      },
      { property: "og:title", content: "Gewinner:innen – neuland | aed e.V." },
      { property: "og:description", content: "Die Jahrgänge 2025, 2023, 2021 und 2019 im Überblick." },
      { property: "og:url", content: "/neuland/gewinner" },
    ],
    links: [{ rel: "canonical", href: "/neuland/gewinner" }],
  }),
  component: GewinnerIndex,
});

function GewinnerIndex() {
  return (
    <>
      <PageHeader
        eyebrow="neuland"
        titel="Gewinner:innen"
        intro="Jede prämierte Arbeit hat eine dauerhaft erreichbare Projektseite – ideal zum Verlinken in Bewerbung und Portfolio."
      />
      <section className="shell pb-24">
        <ul className="rule-t">
          {jahrgaenge.map((jahr) => {
            const anzahl = projekte.filter((p) => p.jahr === jahr).length;
            return (
              <li key={jahr}>
                <Link
                  to="/neuland/gewinner/$jahr"
                  params={{ jahr }}
                  className="group flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-8 transition-colors hover:bg-muted"
                >
                  <span className="display-lg group-hover:text-[var(--brand-deep)]">{jahr}</span>
                  <span className="text-sm text-muted-foreground">
                    {anzahl} ausgezeichnete {anzahl === 1 ? "Arbeit" : "Arbeiten"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

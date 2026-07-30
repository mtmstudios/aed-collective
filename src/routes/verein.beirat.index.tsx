import { createFileRoute, Link } from "@tanstack/react-router";
import { beirat } from "@/data/site";
import { PersonCard } from "@/components/person-card";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/verein/beirat/")({
  head: () => ({
    meta: [
      { title: "Beirat – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Der Beirat des aed e.V. mit Stimmen aus Architektur, Engineering, Design, Szenografie und Publizistik.",
      },
      { property: "og:title", content: "Beirat – aed e.V. Stuttgart" },
      { property: "og:description", content: "Zehn Beiratsmitglieder aus allen Disziplinen." },
      { property: "og:url", content: "/verein/beirat" },
    ],
    links: [{ rel: "canonical", href: "/verein/beirat" }],
  }),
  component: BeiratPage,
});

function BeiratPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verein"
        titel="Beirat"
        intro="Der Beirat berät den Vorstand inhaltlich. Viele Mitglieder sind zugleich in der Jury des Nachwuchswettbewerbs neuland aktiv."
      />
      <section className="shell pb-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {beirat.map((p) => (
            <li key={p.name}>
              <PersonCard person={p} />
            </li>
          ))}
        </ul>
      </section>
      <section className="shell pb-24">
        <p className="rule-t pt-8 text-sm text-muted-foreground">
          Mehrere Beiratsmitglieder sitzen auch in der{" "}
          <Link to="/neuland/jury" className="underline link-brand">
            neuland-Jury
          </Link>
          .
        </p>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { foerdermitglieder } from "@/data/foerdermitglieder";
import { LogoGrid, PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/mitglieder")({
  head: () => ({
    meta: [
      { title: "Mitglieder – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Rund 80 Fördermitglieder und über 400 Personenmitglieder tragen den aed e.V. – Büros, Unternehmen und Institutionen aus der Region Stuttgart.",
      },
      { property: "og:title", content: "Mitglieder – aed e.V. Stuttgart" },
      { property: "og:description", content: "Fördermitglieder und Personenmitglieder des aed e.V." },
      { property: "og:url", content: "/mitglieder" },
    ],
    links: [{ rel: "canonical", href: "/mitglieder" }],
  }),
  component: MitgliederPage,
});

function MitgliederPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mitglieder"
        titel="Fördermitglieder"
        intro="Büros, Unternehmen und Institutionen, die den Verein und die Nachwuchsförderung tragen."
      />
      <section className="shell pb-12">
        <LogoGrid items={foerdermitglieder} />
      </section>
      <section className="shell pb-24">
        <div className="rule-t grid gap-6 pt-8 md:grid-cols-2">
          <p className="text-lg leading-relaxed">
            Dazu kommen mehr als <strong>400 Personenmitglieder</strong> – aus Datenschutzgründen
            nennen wir sie nicht namentlich.
          </p>
          <div>
            <Link to="/mitglied-werden" className="btn-solid">
              Mitglied werden
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

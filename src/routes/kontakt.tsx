import { createFileRoute } from "@tanstack/react-router";
import { kontakt } from "@/data/site";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Geschäftsstelle des aed e.V. in der Olgastraße 138, 70180 Stuttgart. Ansprechpartnerin Iris Enderle, Geschäftszeiten 9–18 Uhr.",
      },
      { property: "og:title", content: "Kontakt – aed e.V. Stuttgart" },
      { property: "og:description", content: "Geschäftsstelle, Anfahrt und Ansprechpartnerin des aed e.V." },
      { property: "og:url", content: "/kontakt" },
    ],
    links: [{ rel: "canonical", href: "/kontakt" }],
  }),
  component: KontaktPage,
});

function KontaktPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        titel="Geschäftsstelle"
        intro="Fragen zu Mitgliedschaft, Programm oder zum Wettbewerb neuland? Die Geschäftsstelle hilft weiter."
      />
      <section className="shell pb-16 md:pb-24">
        <div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            <div className="rule-t pt-6">
              <h2 className="eyebrow">Adresse</h2>
              <address className="mt-3 not-italic leading-relaxed">
                {kontakt.name}
                <br />
                {kontakt.strasse}
                <br />
                {kontakt.plz} {kontakt.ort}
              </address>
            </div>
            <div className="rule-t pt-6">
              <h2 className="eyebrow">Ansprechpartnerin</h2>
              <p className="mt-3">{kontakt.geschaeftsstelle}, Geschäftsstelle</p>
              <p className="mt-2">
                <a href={`tel:${kontakt.telefonHref}`} className="underline link-brand">
                  {kontakt.telefon}
                </a>
              </p>
              <p>
                <a href={`mailto:${kontakt.email}`} className="underline link-brand">
                  {kontakt.email}
                </a>
              </p>
            </div>
            <div className="rule-t pt-6">
              <h2 className="eyebrow">Geschäftszeiten</h2>
              <p className="mt-3">{kontakt.zeiten}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

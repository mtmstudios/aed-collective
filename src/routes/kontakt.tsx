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
  const query = encodeURIComponent(`${kontakt.strasse}, ${kontakt.plz} ${kontakt.ort}`);
  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        titel="Geschäftsstelle"
        intro="Fragen zu Mitgliedschaft, Programm oder zum Wettbewerb neuland? Die Geschäftsstelle hilft weiter."
      />
      <section className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-8">
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
          <div className="md:col-span-7">
            <iframe
              title={`Karte: Standort ${kontakt.name}, ${kontakt.strasse}, ${kontakt.ort}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=9.17%2C48.76%2C9.20%2C48.78&layer=mapnik&marker=48.7716%2C9.1855`}
              loading="lazy"
              className="h-[420px] w-full border border-line grayscale-hover"
            />
            <p className="mt-3 text-sm">
              <a
                href={`https://www.openstreetmap.org/search?query=${query}`}
                target="_blank"
                rel="noreferrer"
                className="underline link-brand"
              >
                Route in OpenStreetMap öffnen
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { kontakt } from "@/data/site";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – aed e.V. Stuttgart" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung des aed e.V., Stuttgart." },
      { property: "og:title", content: "Impressum – aed e.V. Stuttgart" },
      { property: "og:description", content: "Anbieterkennzeichnung des aed e.V." },
      { property: "og:url", content: "/impressum" },
    ],
    links: [{ rel: "canonical", href: "/impressum" }],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <>
      <PageHeader eyebrow="Rechtliches" titel="Impressum" />
      <section className="shell max-w-3xl space-y-8 pb-24">
        <div className="rule-t pt-6">
          <h2 className="display-sm">Angaben gemäß § 5 DDG</h2>
          <address className="mt-3 not-italic leading-relaxed">
            aed Verein zur Förderung von Architektur, Engineering und Design in Stuttgart e.V.
            <br />
            Olgastraße 138
            <br />
            70180 Stuttgart
            <br />
            Telefon: +49 160 8894377
            <br />
            E-Mail: info@aed-stuttgart.de
          </address>
        </div>
        <div className="rule-t pt-6">
          <h2 className="display-sm">Vertretungsberechtigter Vorstand</h2>
          <p className="mt-3 leading-relaxed">
            Dr. Frank Heinlein (1. Vorsitzender), Johanna Neves Pimenta (2. Vorsitzende), Sara
            Dahme (Schriftführerin)
          </p>
        </div>
        <div className="rule-t pt-6">
          <h2 className="display-sm">Registereintrag</h2>
          <p className="mt-3 leading-relaxed">
            Eingetragen im Vereinsregister beim Amtsgericht Stuttgart, VR-Nr. 7136.
          </p>
        </div>
        <div className="rule-t pt-6">
          <h2 className="display-sm">Verantwortlich für den Inhalt</h2>
          <p className="mt-3 leading-relaxed">
            Sara Dahme, Frank Heinlein, Johanna Neves Pimenta (Anschrift wie oben).
          </p>
        </div>
        <div className="rule-t pt-6">
          <p className="leading-relaxed text-muted-foreground">
            Haftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
            für die Inhalte externer Links. Für den Inhalt von verlinkten Seiten sind ausschließlich
            deren Betreiber verantwortlich.
          </p>
        </div>
        <div className="rule-t pt-6">
          <p className="leading-relaxed text-muted-foreground">
            Alle Inhalte dieser Website einschließlich der Gestaltung und Programmierung unterliegen
            dem Urheberrecht (Copyright). Alle Rechte vorbehalten, alle Angaben ohne Gewähr,
            Änderungen vorbehalten. Die Verwendung von Text- und Bildmaterial ist nur mit
            ausdrücklicher Genehmigung der jeweiligen Urheberinnen und Urheber gestattet. Eine
            Weiterverwendung bedarf deren vorheriger schriftlicher Zustimmung.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Webdesign: B612 GmbH Konzeptionelles Gestalten
          </p>
        </div>
      </section>
    </>
  );
}

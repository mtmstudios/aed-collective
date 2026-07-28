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
          <h2 className="font-display text-xl">Angaben gemäß § 5 DDG</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {kontakt.name}
            <br />
            {kontakt.strasse}
            <br />
            {kontakt.plz} {kontakt.ort}
            <br />
            Telefon: {kontakt.telefon}
            <br />
            E-Mail: {kontakt.email}
          </address>
        </div>
        <div className="rule-t pt-6">
          <h2 className="font-display text-xl">Vertretungsberechtigter Vorstand</h2>
          <p className="mt-3 leading-relaxed">
            Dr. Frank Heinlein (1. Vorsitzender), Johanna Neves Pimenta (2. Vorsitzende)
          </p>
        </div>
        <div className="rule-t pt-6">
          <h2 className="font-display text-xl">Registereintrag</h2>
          <p className="mt-3 leading-relaxed">
            Eingetragen im Vereinsregister beim Amtsgericht Stuttgart.
          </p>
        </div>
        <div className="rule-t pt-6">
          <h2 className="font-display text-xl">Verantwortlich für den Inhalt</h2>
          <p className="mt-3 leading-relaxed">
            Sara Dahme (Vorstand Kommunikation), Anschrift wie oben.
          </p>
        </div>
        <div className="rule-t pt-6">
          <h2 className="font-display text-xl">Haftung für Inhalte und Links</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten verantwortlich. Für
            Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt
            der Verlinkung waren keine Rechtsverstöße erkennbar.
          </p>
        </div>
        <div className="rule-t pt-6">
          <h2 className="font-display text-xl">Urheberrecht</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Die Rechte an den gezeigten Projektarbeiten liegen bei den jeweiligen Urheberinnen und
            Urhebern. Eine Weiterverwendung bedarf deren Zustimmung.
          </p>
        </div>
      </section>
    </>
  );
}

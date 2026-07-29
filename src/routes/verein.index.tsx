import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/verein/")({
  head: () => ({
    meta: [
      { title: "Der Verein – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Mission, Geschichte und Auszeichnungen des aed e.V.: Veranstaltungen, Austausch und Förderung für Architektur, Engineering und Design.",
      },
      { property: "og:title", content: "Der Verein – aed e.V. Stuttgart" },
      { property: "og:description", content: "Mission, Geschichte und Auszeichnungen des aed e.V." },
      { property: "og:url", content: "/verein" },
    ],
    links: [{ rel: "canonical", href: "/verein" }],
  }),
  component: VereinPage,
});

function VereinPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verein"
        titel="Veranstaltungen – Austausch – Förderung"
        intro="Der aed e.V. ist der Verein für Architecture, Engineering und Design in Stuttgart. Wir verbinden Disziplinen, die gemeinsam die gebaute und gestaltete Umwelt prägen."
      />

      <section className="shell rule-t py-16" aria-labelledby="mission">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="mission" className="eyebrow md:col-span-3">
            Mission
          </h2>
          <div className="md:col-span-9 max-w-3xl space-y-6 text-lg leading-relaxed">
            <p>
              Der aed ist eine von seinen Mitgliedern getragene, gemeinnützige Initiative. Ihr Ziel
              ist es, die große Gestaltungskompetenz in der Region Stuttgart – vom Produkt- und
              Grafikdesign über Multimedia und Engineering bis hin zur Architektur – zu fördern und
              der Öffentlichkeit nahezubringen. Architekt:innen, Grafiker:innen, Designer:innen und
              Ingenieur:innen berichten und diskutieren auf Einladung des aed über aktuelle Projekte
              ebenso wie über grundlegende Fragestellungen.
            </p>
            <p className="text-muted-foreground">
              Insbesondere der studentische Nachwuchs wird gefördert und zur Beschäftigung mit
              anderen Disziplinen angeregt – vor allem über den Nachwuchswettbewerb{" "}
              <Link to="/neuland" className="underline link-brand">
                neuland
              </Link>
              , der 2025 bereits zum zehnten Mal ausgelobt wurde.
            </p>
          </div>
        </div>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="zitat">
        <h2 id="zitat" className="sr-only">
          Zitat
        </h2>
        <blockquote className="display-md max-w-4xl">
          „Eine unglaubliche Menge Kreativität stammt aus Stuttgart, aber das weiß man nicht
          unbedingt, weil niemand darüber spricht.“
        </blockquote>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="geschichte">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="geschichte" className="eyebrow md:col-span-3">
            Geschichte
          </h2>
          <div className="md:col-span-9 max-w-3xl space-y-6 leading-relaxed">
            <p>
              Der „Verein zur Förderung von Architektur, Engineering und Design in Stuttgart e.V.“
              wurde 2004 gegründet – von Alexander Hafner, Dr. Frank Heinlein, Silvia Olp, Ralf
              Schmitz, Prof. Werner Sobek, Prof. Andreas Uebele und Roberto Zwirn. Am 15. Dezember
              2004 trat der Verein im damals noch nicht eröffneten Kunstmuseum Stuttgart erstmals an
              die Öffentlichkeit – mit über 300 Gästen.
            </p>
            <p>
              Aus einer Reihe von Abendveranstaltungen wurden Hunderte von Vorträgen, Exkursionen,
              Baustellenbesuchen und Blicken hinter die Kulissen. Heute versammelt der aed über 400
              Personenmitglieder und rund 80 Fördermitglieder – und mit neuland einen
              Nachwuchswettbewerb, der alle zwei Jahre bundesweit junge Gestalter:innen auszeichnet.
            </p>
          </div>
        </div>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="award">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="award" className="eyebrow md:col-span-3">
            Auszeichnung
          </h2>
          <div className="md:col-span-9">
            <p className="display-md max-w-3xl">German Brand Award 2017</p>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              Der aed wurde mit dem German Brand Award 2017 für herausragende Kulturarbeit als
              Non-Profit-Organisation ausgezeichnet.
            </p>
          </div>
        </div>
      </section>

      <nav className="shell rule-t pt-16" aria-label="Weitere Seiten zum Verein">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            { to: "/verein/vorstand", titel: "Vorstand", text: "Fünf Personen, ein Ehrenvorsitzender" },
            { to: "/verein/beirat", titel: "Beirat", text: "Zehn Stimmen aus allen Disziplinen" },
            { to: "/verein/satzung", titel: "Satzung", text: "Rechtliche Grundlage des Vereins" },
          ].map((i) => (
            <li key={i.to} className="bg-background">
              <Link to={i.to} className="block h-full p-8 transition-colors hover:bg-muted">
                <span className="font-display text-xl">{i.titel}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{i.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

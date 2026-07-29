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

      <section className="shell rule-t py-16 band-muted" aria-labelledby="geschichte">
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


      <section className="shell rule-t py-16" aria-labelledby="vorstand-preview">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-12">
            <h2 id="vorstand-preview" className="display-lg max-w-4xl">
              Vorstand und Ehrenvorsitzender
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Die Köpfe hinter dem aed e.V.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Dr. Frank Heinlein", rolle: "Erster Vorsitzender", email: "frank.heinlein@aed-stuttgart.de" },
            { name: "Johanna Neves Pimenta", rolle: "Zweite Vorsitzende", email: undefined },
            { name: "Sara Dahme", rolle: "Vorstand Kommunikation", email: undefined },
            { name: "Frank Seeger", rolle: "Vorstand Finanzen", email: "info@aed-stuttgart.de" },
          ].map((person) => (
            <article key={person.name} className="group">
              <div
                aria-hidden="true"
                className="flex aspect-4/5 items-center justify-center bg-muted font-display text-5xl text-muted-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
              >
                {person.name
                  .replace(/^(Dr\.|Prof\.)\s+/i, "")
                  .split(" ")
                  .filter(Boolean)
                  .map((t) => t[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="mt-4">
                <h3 className="font-display text-lg leading-tight">{person.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="mt-1 inline-block text-sm underline link-brand"
                  >
                    {person.email}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div role="navigation" className="shell rule-t pt-16 bg-background" aria-label="Weitere Seiten zum Verein">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            { to: "/verein/vorstand", titel: "Vorstand", text: "Fünf Personen, ein Ehrenvorsitzender" },
            { to: "/verein/beirat", titel: "Beirat", text: "Zehn Stimmen aus allen Disziplinen" },
            { to: "/verein/satzung", titel: "Satzung", text: "Rechtliche Grundlage des Vereins" },
          ].map((i) => (
            <li key={i.to} className="bg-background">
              <Link to={i.to} className="flex min-h-[400px] h-full flex-col justify-start p-12 transition-colors hover:bg-muted">
                <span className="font-display text-xl">{i.titel}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{i.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { beirat, vorstand } from "@/data/site";
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
        titel="Veranstaltungen. Austausch. Förderung."
        subtitle="AED e.V."
        size="xl"
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
          {vorstand
            .filter((p) => p.rolle !== "Ehrenvorsitzender")
            .map((person) => (
              <Link key={person.name} to="/verein/vorstand/$slug" params={{ slug: person.slug! }} className="group block">
                <div
                  aria-hidden="true"
                  className="flex aspect-4/5 items-center justify-center bg-card font-display text-5xl text-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
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
                  <h3 className="font-display text-lg leading-tight underline-offset-4 group-hover:underline">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
                  {person.email && (
                    <span className="mt-1 inline-block text-sm text-muted-foreground">{person.email}</span>
                  )}
                </div>
              </Link>
            ))}
        </div>

        <div className="mt-8">
          {vorstand
            .filter((p) => p.rolle === "Ehrenvorsitzender")
            .map((person) => (
              <Link
                key={person.name}
                to="/verein/vorstand/$slug" params={{ slug: person.slug! }}
                className="group block w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
              >
                <div
                  aria-hidden="true"
                  className="flex aspect-4/5 items-center justify-center bg-card font-display text-5xl text-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
                >
                  WS
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-lg leading-tight underline-offset-4 group-hover:underline">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
                  {person.email && (
                    <span className="mt-1 inline-block text-sm text-muted-foreground">{person.email}</span>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="shell rule-t py-16 band-muted" aria-labelledby="beirat-preview">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-12">
            <h2 id="beirat-preview" className="display-lg max-w-4xl">
              Beirat
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Zehn Stimmen aus allen Disziplinen
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {beirat.map((person) => (
            <Link
              key={person.name}
              to="/verein/beirat/$slug" params={{ slug: person.slug! }}
              className="group block"
            >
              <article className="group">
                <div
                  aria-hidden="true"
                  className="flex aspect-4/5 items-center justify-center bg-card font-display text-5xl text-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
                >
                  {person.name
                    .replace(/^(Prof\. Dr\. phil\.|Prof\. Dr\. Dr\. E\.h\. Dr\. h\.c\.|Prof\. Dr\.|Dr\. Dr\.|Prof\.|Dr\.)\s+/i, "")
                    .split(" ")
                    .filter(Boolean)
                    .map((t) => t[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-lg leading-tight">{person.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="satzung-preview">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-12">
            <h2 id="satzung-preview" className="display-lg max-w-4xl">
              Satzung
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Rechtliche Grundlage des Vereins
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/verein/satzung" className="btn-solid">
            Satzung des AED durchlesen
          </Link>
          <a href="/satzung-aed.pdf" download className="btn-outline">
            Satzung als PDF herunterladen
          </a>
        </div>
      </section>
    </>
  );
}

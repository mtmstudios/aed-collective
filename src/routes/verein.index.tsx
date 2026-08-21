import { createFileRoute, Link } from "@tanstack/react-router";
import { beirat, vorstand } from "@/data/site";
import { foerdermitglieder } from "@/data/foerdermitglieder";
import { PageHeader } from "@/components/ui-bits";
import { PersonDialog, initialen, personenBild } from "@/components/person-dialog";

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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {vorstand.map((person) => {
            const isEhren = person.rolle === "Ehrenvorsitzender";
            const bild = personenBild(person.name);
            return (
              <PersonDialog key={person.name} person={person} initials={isEhren ? "WS" : undefined}>
                <div className="group block cursor-pointer" role="button" tabIndex={0}>
                  {bild ? (
                    <img
                      src={bild}
                      alt={`Porträt ${person.name}`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-4/5 w-full bg-muted object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex aspect-4/5 items-center justify-center bg-muted font-display text-5xl text-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
                    >
                      {isEhren ? "WS" : initialen(person.name)}
                    </div>
                  )}
                  <div className="mt-4">
                    <h3 className="font-display text-lg leading-tight underline-offset-4 group-hover:underline">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
                    {person.email && (
                      <span className="mt-1 inline-block text-sm text-muted-foreground">{person.email}</span>
                    )}
                  </div>
                </div>
              </PersonDialog>
            );
          })}

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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {beirat.map((person) => {
            const bild = personenBild(person.name);
            return (
              <PersonDialog key={person.name} person={person}>
                <article className="group block cursor-pointer" role="button" tabIndex={0}>
                  {bild ? (
                    <img
                      src={bild}
                      alt={`Porträt ${person.name}`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-4/5 w-full bg-card object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex aspect-4/5 items-center justify-center bg-card font-display text-5xl text-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
                    >
                      {initialen(person.name)}
                    </div>
                  )}
                  <div className="mt-4">
                    <h3 className="font-display text-lg leading-tight">{person.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
                  </div>
                </article>
              </PersonDialog>
            );
          })}

        </div>
      </section>


      <section className="shell rule-t py-16" aria-labelledby="foerdermitglieder-preview">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-12">
            <h2 id="foerdermitglieder-preview" className="display-lg max-w-4xl">
              Fördermitglieder
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Firmen, Körperschaften &amp; Institutionen
            </p>
          </div>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {foerdermitglieder.map((m) => (
            <li
              key={m.name}
              className="border border-line bg-muted p-4 text-sm leading-snug transition-colors duration-300 hover:bg-brand hover:text-brand-foreground"
            >
              {m.url ? (
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="block">
                  {m.name}
                </a>
              ) : (
                m.name
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="shell rule-t py-16 band-muted" aria-labelledby="satzung-preview">
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

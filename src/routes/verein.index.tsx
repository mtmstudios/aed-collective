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
              Architektinnen, Ingenieure und Designerinnen arbeiten an denselben Fragen – meist
              getrennt voneinander. Der aed e.V. schafft die Gelegenheiten, bei denen sie
              aufeinandertreffen: in Vorträgen, auf Exkursionen, bei Werkstattgesprächen und Festen.
            </p>
            <p className="text-muted-foreground">
              Wir fördern den gestalterischen Nachwuchs der Region, machen herausragende Arbeiten
              sichtbar und geben jungen Gestalterinnen und Gestaltern eine Bühne – seit 2019 vor
              allem über den Wettbewerb{" "}
              <Link to="/neuland" className="underline link-brand">
                neuland
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="zitat">
        <h2 id="zitat" className="sr-only">
          Zitat
        </h2>
        <blockquote className="display-md max-w-4xl">
          „Eine unglaubliche Menge Kreativität stammt aus Stuttgart – man muss sie nur sichtbar
          machen.“
        </blockquote>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="geschichte">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="geschichte" className="eyebrow md:col-span-3">
            Geschichte
          </h2>
          <div className="md:col-span-9 max-w-3xl space-y-6 leading-relaxed">
            <p>
              Gegründet aus dem Gedanken heraus, dass die Region Stuttgart eine außergewöhnliche
              Dichte an gestalterischer und ingenieurtechnischer Kompetenz besitzt, versammelt der
              aed heute über 400 Personenmitglieder und rund 80 Fördermitglieder.
            </p>
            <p>
              Aus einer Reihe von Abendveranstaltungen wurde ein ganzjähriges Programm, aus dem
              Programm ein Netzwerk – und aus dem Netzwerk der Nachwuchswettbewerb neuland, der seit
              2019 alle zwei Jahre Abschlussarbeiten aus Baden-Württemberg auszeichnet.
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
            <p className="display-md max-w-3xl">German Brand Award</p>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              Für die Marken- und Kommunikationsarbeit des Vereins und des Wettbewerbs neuland wurde
              der aed mit dem German Brand Award ausgezeichnet – eine Bestätigung dafür, dass ein
              Design-Verein auch selbst gestalterisch überzeugen muss.
            </p>
          </div>
        </div>
      </section>

      <nav className="shell rule-t py-16" aria-label="Weitere Seiten zum Verein">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            { to: "/verein/vorstand", titel: "Vorstand", text: "Fünf Personen, ein Ehrenvorsitzender" },
            { to: "/verein/beirat", titel: "Beirat", text: "Elf Stimmen aus allen Disziplinen" },
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

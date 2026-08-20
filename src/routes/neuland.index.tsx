import { createFileRoute, Link } from "@tanstack/react-router";
import { kennzahlen, projekte, wettbewerbStatus } from "@/data/neuland";
import { ProjektCard, projektBild } from "@/components/projekt-card";
import { SectionTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/")({
  head: () => ({
    meta: [
      { title: "neuland – Nachwuchswettbewerb des aed e.V." },
      {
        name: "description",
        content:
          "aed neuland – der interdisziplinäre Nachwuchswettbewerb für Studierende und Absolvent:innen bis 28 Jahre. Fünf Kategorien, 2.000 € je 1. Preis, gefördert von der Karl Schlecht Stiftung.",
      },
      { property: "og:title", content: "neuland – Nachwuchswettbewerb des aed e.V." },
      { property: "og:description", content: "Der interdisziplinäre Nachwuchswettbewerb für junge Gestalter:innen." },
      { property: "og:url", content: "/neuland" },
    ],
    links: [{ rel: "canonical", href: "/neuland" }],
  }),
  component: NeulandIndex,
});

function NeulandIndex() {
  const highlights = projekte.filter((p) => p.jahr === "2025" && p.preis === "1. Preis");
  const titelprojekt = highlights.find((p) => projektBild(p));
  const titelbild = titelprojekt ? projektBild(titelprojekt) : undefined;

  return (
    <>
      {/* Titelseite des Ressorts */}
      <section className="bleed border-b border-line">
        <div className="relative h-[clamp(400px,54vh,680px)] w-full overflow-hidden bg-muted md:h-[clamp(460px,66vh,760px)]">
          {titelbild && (
            <img
              src={titelbild}
              alt={`${titelprojekt?.titel} – 1. Preis neuland 2025`}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="shell pb-10 md:pb-14">
              <p className="eyebrow text-white/85">
                {wettbewerbStatus.offen ? "Einreichung offen" : "Jahrgang 2025 abgeschlossen"}
              </p>
              <h1 className="display-xl mt-4 text-white">neuland</h1>
              <p className="lead mt-6 max-w-2xl text-white/90">
                Der interdisziplinäre Nachwuchswettbewerb des aed – für Studierende und
                Absolvent:innen aller Hochschulen bis 28 Jahre.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="prose-editorial">
              Du hast eine Abschluss-, Semester- oder freie Arbeit, die mehr verdient hat als einen
              Ordner auf der Festplatte? neuland zeichnet die besten Arbeiten junger
              Gestalter:innen aus – in fünf Kategorien, mit 2.000 € je 1. Preis, gefördert von der
              Karl Schlecht Stiftung.
            </p>
            <p className="meta mt-5">{wettbewerbStatus.hinweis}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/neuland/wettbewerb" className="btn-solid">
                Wettbewerb im Detail
              </Link>
              <Link to="/neuland/teilnahme" className="btn-outline">
                Teilnahmebedingungen
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-8 self-start md:col-span-5">
            {kennzahlen.map((k) => (
              <div key={k.label}>
                <dt className="sr-only">{k.label}</dt>
                <dd>
                  <span className="block font-display text-5xl leading-none">{k.wert}</span>
                  <span className="eyebrow-muted mt-3 block">{k.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell border-t border-line py-12 md:py-16" aria-labelledby="gewinner-2025">
        <SectionTitle
          id="gewinner-2025"
          titel="Die 1. Preise 2025"
          kicker="Preisträger:innen"
          href="/neuland/gewinner"
          linkText="Alle Jahrgänge"
        />
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((p) => (
            <ProjektCard key={p.slug} projekt={p} />
          ))}
        </div>
      </section>

      <section className="bleed border-t border-line bg-[oklch(0.968_0_0)]" aria-labelledby="cross">
        <div className="shell grid gap-8 py-14 md:grid-cols-12 md:py-20">
          <h2 id="cross" className="eyebrow-muted md:col-span-3">
            Jung &amp; hungrig
          </h2>
          <div className="md:col-span-9 max-w-2xl">
            <p className="prose-editorial">
              neuland ist ein Projekt des aed e.V. – und der Verein hat mehr zu bieten als einen
              Wettbewerb: Vorträge, Führungen, Studiobesuche und Feste, bei denen du genau die Leute
              triffst, die deine Arbeit interessiert. Mit der Reihe „jung &amp; hungrig“ besuchen
              wir regelmäßig aufstrebende junge Studios.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/programm" className="btn-outline">
                Vereinsprogramm
              </Link>
              <Link to="/mitglied-werden" className="btn-outline">
                Mitglied werden
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

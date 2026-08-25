import { createFileRoute, Link } from "@tanstack/react-router";
import { jahrgaenge, jury2025, kennzahlen, projekte, wettbewerbStatus } from "@/data/neuland";
import type { Person } from "@/data/site";
import { ProjektCard, projektBild } from "@/components/projekt-card";
import { PersonDialog, personenBild } from "@/components/person-dialog";
import { SectionTitle } from "@/components/ui-bits";
import { AutoSlider } from "@/components/auto-slider";

import { NeulandSubnav } from "@/routes/neuland";

function JuryKarte({ person }: { person: Person }) {
  const bild = personenBild(person.name);
  return (
    <PersonDialog person={person}>
      <article className="group w-full cursor-pointer text-left" role="button" tabIndex={0}>
        <div className="img-zoom aspect-square bg-muted">
          {bild ? (
            <img
              src={bild}
              alt={`Porträt ${person.name}`}
              loading="lazy"
              decoding="async"
              className="grayscale-hover h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted" aria-hidden="true" />
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-snug">{person.name}</h3>
        <p className="meta mt-1 line-clamp-2 leading-snug">{person.rolle}</p>
      </article>
    </PersonDialog>
  );
}

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
      <section className="bleed relative" aria-labelledby="neuland-titel-head">
        <div className="relative h-[clamp(380px,52vh,620px)] w-full overflow-hidden bg-muted">
          {titelbild && (
            <img
              src={titelbild}
              alt={`${titelprojekt?.titel} – 1. Preis neuland 2025`}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="shell pb-10 md:pb-14">
              <p className="eyebrow text-white/85">
                {wettbewerbStatus.offen ? "Einreichung offen" : "Jahrgang 2025 abgeschlossen"}
              </p>
              <h1 id="neuland-titel-head" className="display-xl mt-4 text-white">neuland</h1>
              <p className="lead mt-5 max-w-2xl text-white/90">
                Der interdisziplinäre Nachwuchswettbewerb des aed – für Studierende und
                Absolvent:innen aller Hochschulen bis 28 Jahre.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NeulandSubnav />

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

      <section className="shell topic-rule py-12 md:py-16" aria-labelledby="gewinner-2025">
        <SectionTitle
          id="gewinner-2025"
          titel="Die 1. Preise"
          kicker="Preisträger:innen 2025"
          href="/neuland/gewinner"
          linkText="Alle Jahrgänge"
        />
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((p) => (
            <ProjektCard key={p.slug} projekt={p} />
          ))}
        </div>
      </section>

      <section className="shell topic-rule py-12 md:py-16" aria-labelledby="jury-2025">
        <SectionTitle
          id="jury-2025"
          titel="Jury 2025"
          kicker="Unabhängige Fachjury"
          href="/neuland/jury"
          linkText="Ganze Jury ansehen"
        />
        <AutoSlider
          className="mt-10"
          itemClassName="w-36 pr-5 sm:w-44"
          pfeilKlasse="text-ink drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)]"
        >
          {jury2025.map((p) => (
            <JuryKarte key={p.name} person={p} />
          ))}
        </AutoSlider>

        <div className="mt-10">
          <Link to="/neuland/jury" className="btn-outline">
            Alle 21 Juroren:innen ansehen
          </Link>
        </div>
      </section>

      <section className="bleed bg-[oklch(0.968_0_0)]" aria-labelledby="archiv-neuland">
        <div className="shell py-14 md:py-20">
          <h2 id="archiv-neuland" className="eyebrow-muted">
            Archiv
          </h2>
          <p className="display-md mt-4">Preisträger:innen vergangener Jahrgänge</p>
          <ul className="mt-8 rule-t">
            {jahrgaenge
              .filter((jahr) => jahr !== "2025")
              .map((jahr) => {
                const anzahl = projekte.filter((p) => p.jahr === jahr).length;
                return (
                  <li key={jahr}>
                    <Link
                      to="/neuland/gewinner/$jahr"
                      params={{ jahr }}
                      className="group flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-6 transition-colors hover:bg-background"
                    >
                      <span className="display-sm group-hover:text-[var(--brand-deep)]">{jahr}</span>
                      <span className="text-sm text-muted-foreground">
                        {anzahl} ausgezeichnete {anzahl === 1 ? "Arbeit" : "Arbeiten"}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
          <div className="mt-8">
            <Link to="/neuland/gewinner" className="btn-outline">
              Alle Jahrgänge
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

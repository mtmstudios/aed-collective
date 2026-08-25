import { createFileRoute, Link } from "@tanstack/react-router";
import { beirat, events, partner, vorstand } from "@/data/site";
import { kennzahlen, projekte } from "@/data/neuland";
import { editorialBilder } from "@/data/bilder";
import { MitgliederSlider } from "@/components/mitglieder-slider";
import { EventCard, formatDatum } from "@/components/event-card";
import { ProjektCard } from "@/components/projekt-card";
import { LogoGrid, SectionTitle } from "@/components/ui-bits";
import { CoverSlider } from "@/components/cover-slider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "aed e.V. – Architecture Engineering Design Stuttgart" },
      {
        name: "description",
        content:
          "Veranstaltungen, Austausch, Förderung: der aed e.V. verbindet Architektur, Engineering und Design in Stuttgart – mit dem Nachwuchswettbewerb neuland.",
      },
      { property: "og:title", content: "aed e.V. – Architecture Engineering Design Stuttgart" },
      {
        property: "og:description",
        content: "Veranstaltungen, Austausch und Förderung für Gestaltung in Stuttgart.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const heute = new Date().toISOString().slice(0, 10);
  const kommende = events
    .filter((e) => e.datum >= heute)
    .sort((a, b) => a.datum.localeCompare(b.datum));
  const vergangene = events
    .filter((e) => e.datum < heute)
    .sort((a, b) => b.datum.localeCompare(a.datum));
  // Erst die anstehenden Termine, danach mit den jüngsten Rückblicken auffüllen
  const liste = [...kommende, ...vergangene];
  const [aufmacher, ...weitere] = liste;
  const nebenan = weitere.slice(0, 2);
  const reihe = weitere.slice(2, 5);
  // Vorstand und Beirat als Gesichter des Vereins, ohne Doppelungen
  const koepfe = [...vorstand, ...beirat].filter(
    (p, i, alle) => alle.findIndex((a) => a.name === p.name) === i,
  );
  const preistraeger = projekte.filter((p) => p.jahr === "2025" && p.preis === "1. Preis").slice(0, 3);

  return (
    <>
      {/* Titelseite: randabfallender Cover-Slider mit Didone-Zeile */}
      <section className="bleed relative" aria-labelledby="cover-titel">
        <div className="relative h-[clamp(420px,62vh,760px)] w-full overflow-hidden bg-muted md:h-[clamp(520px,78vh,860px)]">
          <CoverSlider
            bilder={editorialBilder}
            alt="Impressionen von Veranstaltungen des aed e.V. in Stuttgart"
            className="h-full w-full"
            itemClassName="w-full"
            zufall={false}
            tempo={0.9}
            hoverFaktor={6}
          />

          {/* möglichst schmaler vertikaler Verlauf – nur hinter der Schrift */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">

            <div className="shell pb-10 md:pb-16">
              <p className="eyebrow text-white/85">Architecture · Engineering · Design</p>
              <h1 id="cover-titel" className="display-lg mt-4 max-w-3xl text-white">
                Veranstaltungen, Austausch, Förderung
              </h1>
              <p className="lead mt-5 max-w-xl text-white/90">
                Seit 2004 bringt der aed in Stuttgart zusammen, was sonst getrennt entwirft.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/programm" className="btn-solid !bg-white !text-black hover:!bg-[var(--brand)]">
                  Programm
                </Link>
                <Link to="/mitglied-werden" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-black">
                  Mitglied werden
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aufmacher-Raster: ein großer Termin, zwei begleitende */}
      <section className="shell py-14 md:py-20" aria-labelledby="programm-titel">
        <SectionTitle
          id="programm-titel"
          titel="Im Programm"
          kicker={kommende.length > 0 ? `Nächster Termin: ${formatDatum(kommende[0].datum)}` : undefined}
          href="/programm"
          linkText="Alle Termine"
          noRule
        />
        <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-12">
          {aufmacher && (
            <div className="md:col-span-7">
              <EventCard event={aufmacher} gross />
            </div>
          )}
          <div className="grid gap-10 md:col-span-5">
            {nebenan.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>

        {reihe.length > 0 && (
          <div className="mt-10 grid gap-x-8 gap-y-12 rule-t pt-10 md:grid-cols-3">
            {reihe.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* Die Köpfe des Vereins als Laufband */}
      <section className="bleed topic-rule" aria-labelledby="mitglieder-titel">
        <div className="shell flex flex-wrap items-baseline justify-between gap-3 pt-14 pb-10 md:pt-20">
          <div>
            <p className="eyebrow-muted">Die Köpfe hinter dem aed</p>
            <h2 id="mitglieder-titel" className="display-md mt-2">
              Vorstand und Beirat
            </h2>
          </div>
          <Link to="/verein" className="eyebrow link-underline">
            Zum Verein
          </Link>
        </div>
        <MitgliederSlider items={koepfe} />
        <div className="shell pt-10 pb-14 md:pb-20">
          <p className="meta">
            Getragen von rund 80 Fördermitgliedern und über 400 Personenmitgliedern.{" "}
            <Link to="/mitglieder" className="link-underline">
              Alle Mitglieder
            </Link>
          </p>
        </div>
      </section>

      {/* Manifest: Zitat als Doppelseite */}
      <section className="bleed bg-brand text-brand-foreground" aria-labelledby="mission-titel">
        <div className="shell grid gap-10 py-14 md:grid-cols-12 md:py-20">
          <h2 id="mission-titel" className="eyebrow md:col-span-3">
            Der Verein
          </h2>
          <div className="md:col-span-9">
            <blockquote className="display-md max-w-4xl">
              „Eine unglaubliche Menge Kreativität stammt aus Stuttgart, aber das weiß man nicht
              unbedingt, weil niemand darüber spricht."
            </blockquote>
            <p className="prose-editorial mt-8 max-w-2xl">
              Der aed ist eine von seinen Mitgliedern getragene, gemeinnützige Initiative. Ihr Ziel:
              die große Gestaltungskompetenz der Region Stuttgart – vom Produkt- und Grafikdesign
              über Multimedia und Engineering bis zur Architektur – zu fördern und der Öffentlichkeit
              nahezubringen.
            </p>
            <Link to="/verein" className="eyebrow mt-8 inline-block link-underline">
              Über den Verein
            </Link>
          </div>
        </div>
      </section>

      {/* neuland als eigenes Ressort */}
      <section className="theme-neuland shell py-14 md:py-20" aria-labelledby="neuland-titel">
        <SectionTitle
          id="neuland-titel"
          titel="neuland"
          kicker="Nachwuchswettbewerb"
          href="/neuland/gewinner"
          linkText="Alle Gewinner:innen"
          noRule
        />

        <p className="lead mt-8 max-w-3xl">
          Der interdisziplinäre Wettbewerb für Studierende und Absolvent:innen bis 28 Jahre – in fünf
          Kategorien, gefördert von der Karl Schlecht Stiftung, 2025 zum zehnten Mal ausgelobt.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-ink py-8 md:grid-cols-4">
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

        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {preistraeger.map((p) => (
            <ProjektCard key={`${p.jahr}-${p.slug}`} projekt={p} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/neuland" className="btn-solid">
            Zum Wettbewerb
          </Link>
          <Link to="/neuland/jury" className="btn-outline">
            Die Jury
          </Link>
        </div>
      </section>

      {/* Partner */}
      <section className="shell topic-rule py-14 md:py-20" aria-labelledby="partner-titel">
        <SectionTitle id="partner-titel" titel="Kooperationspartner" />
        <div className="mt-10">
          <LogoGrid items={partner} />
        </div>
        <p className="meta mt-8">
          Dazu rund 80 Fördermitglieder und über 400 Personenmitglieder.{" "}
          <Link to="/mitglieder" className="link-underline">
            Alle Mitglieder
          </Link>
        </p>
      </section>
    </>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { projekte } from "@/data/neuland";
import { projektBilder } from "@/data/bilder";

export const Route = createFileRoute("/neuland/gewinner/$jahr/$slug")({
  loader: ({ params }) => {
    const projekt = projekte.find((p) => p.slug === params.slug && p.jahr === params.jahr);
    if (!projekt) throw notFound();
    return { projekt };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Projekt nicht gefunden – neuland" }, { name: "robots", content: "noindex" }] };
    }
    const { projekt } = loaderData;
    const beschreibung = `${projekt.preis} ${projekt.kategorie} ${projekt.jahr}: ${projekt.titel} von ${projekt.autor}, ${projekt.hochschule}.`;
    const bild = projektBilder[`${projekt.jahr}/${projekt.slug}`]?.[0];
    return {
      meta: [
        { title: `${projekt.titel} – neuland ${projekt.jahr}` },
        { name: "description", content: beschreibung },
        { property: "og:title", content: `${projekt.titel} – neuland ${projekt.jahr}` },
        { property: "og:description", content: beschreibung },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/neuland/gewinner/${params.jahr}/${params.slug}` },
        ...(bild ? [{ property: "og:image", content: bild }] : []),
      ],
      links: [{ rel: "canonical", href: `/neuland/gewinner/${params.jahr}/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: projekt.titel,
            creator: { "@type": "Person", name: projekt.autor },
            dateCreated: projekt.jahr,
            genre: projekt.kategorie,
            description: projekt.beschreibung,
            award: `${projekt.preis} neuland ${projekt.jahr}`,
            ...(bild ? { image: bild } : {}),
          }),
        },
      ],
    };
  },
  component: ProjektDetail,
});

function ProjektDetail() {
  const { projekt } = Route.useLoaderData();
  const bilder = projektBilder[`${projekt.jahr}/${projekt.slug}`] ?? [];
  const [hero, ...galerie] = bilder;

  return (
    <article>
      {/* Aufmacher */}
      <header className="shell pt-10 pb-8 text-center md:pt-16">
        <p className="eyebrow">
          {projekt.kategorie} · {projekt.preis} {projekt.jahr}
        </p>
        <h1 className="display-lg mx-auto mt-5 max-w-4xl">{projekt.titel}</h1>
        <p className="meta mt-5">
          {projekt.autor}
          {projekt.hochschule ? ` · ${projekt.hochschule}` : ""}
        </p>
      </header>

      {hero && (
        <figure className="bleed">
          <img
            src={hero}
            alt={`${projekt.titel} von ${projekt.autor}`}
            className="max-h-[80vh] w-full object-contain"
            fetchPriority="high"
          />
        </figure>
      )}

      {/* Fließtext + Jurystatement */}
      <div className="shell grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          <p className="eyebrow-muted">Über das Projekt</p>
          <div className="prose-editorial mt-5">
            <p>{projekt.beschreibung}</p>
          </div>

          {(projekt.art || projekt.betreuung) && (
            <dl className="mt-10 border-t border-line pt-6">
              {projekt.art && (
                <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line py-3">
                  <dt className="eyebrow-muted w-32 shrink-0">Art der Arbeit</dt>
                  <dd className="flex-1 text-base">{projekt.art}</dd>
                </div>
              )}
              {projekt.betreuung && (
                <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line py-3">
                  <dt className="eyebrow-muted w-32 shrink-0">Betreuung</dt>
                  <dd className="flex-1 text-base">{projekt.betreuung}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        {projekt.jurystatement && (
          <aside className="md:col-span-5">
            <p className="eyebrow-muted">Aus der Jury</p>
            <blockquote className="lead mt-5 border-t-2 border-ink pt-6">
              {projekt.jurystatement}
            </blockquote>
          </aside>
        )}
      </div>

      {/* Bildstrecke */}
      {galerie.length > 0 && (
        <section className="shell border-t border-line py-12" aria-label="Bildstrecke zum Projekt">
          <div className="grid gap-8 md:grid-cols-2">
            {galerie.map((b, i) => (
              <figure key={b} className={galerie.length === 3 && i === 0 ? "md:col-span-2" : ""}>
                <img
                  src={b}
                  alt={`${projekt.titel} – Abbildung ${i + 2}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full bg-muted object-contain"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      <nav className="shell border-t border-line py-10" aria-label="Zurück zur Übersicht">
        <Link
          to="/neuland/gewinner/$jahr"
          params={{ jahr: projekt.jahr }}
          className="eyebrow inline-flex items-center gap-2 link-underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Alle Arbeiten {projekt.jahr}
        </Link>
      </nav>
    </article>
  );
}

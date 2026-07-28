import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { projekte } from "@/data/neuland";

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
    return {
      meta: [
        { title: `${projekt.titel} – neuland ${projekt.jahr}` },
        { name: "description", content: beschreibung },
        { property: "og:title", content: `${projekt.titel} – neuland ${projekt.jahr}` },
        { property: "og:description", content: beschreibung },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/neuland/gewinner/${params.jahr}/${params.slug}` },
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
          }),
        },
      ],
    };
  },
  component: ProjektDetail,
});

function ProjektDetail() {
  const { projekt } = Route.useLoaderData();

  return (
    <article className="shell py-16 md:py-20">
      <Link
        to="/neuland/gewinner/$jahr"
        params={{ jahr: projekt.jahr }}
        className="inline-flex items-center gap-2 text-sm link-brand"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Jahrgang {projekt.jahr}
      </Link>

      <p className="eyebrow mt-8">
        {projekt.kategorie} · {projekt.preis} · {projekt.jahr}
      </p>
      <h1 className="display-lg mt-4 max-w-4xl">{projekt.titel}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {projekt.autor} · {projekt.hochschule}
      </p>

      <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-2">
        {projekt.art && (
          <div>
            <dt className="eyebrow">Art der Arbeit</dt>
            <dd className="mt-1 text-sm leading-relaxed">{projekt.art}</dd>
          </div>
        )}
        {projekt.betreuung && (
          <div>
            <dt className="eyebrow">Betreuung</dt>
            <dd className="mt-1 text-sm leading-relaxed">{projekt.betreuung}</dd>
          </div>
        )}
      </dl>

      <div className="mt-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="eyebrow">Projekt</h2>
          <p className="mt-4 text-lg leading-relaxed">{projekt.beschreibung}</p>
        </div>
        <div className="md:col-span-5">
          <h2 className="eyebrow">Statement der Jury</h2>
          <blockquote className="mt-4 border-l-2 pl-5 leading-relaxed" style={{ borderColor: "var(--brand)" }}>
            {projekt.jurystatement}
          </blockquote>
        </div>
      </div>
    </article>
  );
}

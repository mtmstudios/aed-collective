import { createFileRoute, notFound } from "@tanstack/react-router";
import { jahrgaenge, kategorien, projekte } from "@/data/neuland";
import { ProjektCard } from "@/components/projekt-card";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/gewinner/$jahr/")({
  loader: ({ params }) => {
    if (!jahrgaenge.includes(params.jahr)) throw notFound();
    return { jahr: params.jahr, liste: projekte.filter((p) => p.jahr === params.jahr) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Jahrgang nicht gefunden – neuland" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `Gewinner:innen ${loaderData.jahr} – neuland | aed e.V.` },
        {
          name: "description",
          content: `Die ausgezeichneten Arbeiten des Nachwuchswettbewerbs neuland ${loaderData.jahr} in fünf Kategorien.`,
        },
        { property: "og:title", content: `Gewinner:innen ${loaderData.jahr} – neuland` },
        { property: "og:description", content: `Alle Preisträger:innen des Jahrgangs ${loaderData.jahr}.` },
        { property: "og:url", content: `/neuland/gewinner/${params.jahr}` },
      ],
      links: [{ rel: "canonical", href: `/neuland/gewinner/${params.jahr}` }],
    };
  },
  component: JahrgangPage,
});

function JahrgangPage() {
  const { jahr, liste } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        eyebrow="neuland · Gewinner:innen"
        titel={`Jahrgang ${jahr}`}
        intro={`${liste.length} ausgezeichnete Arbeiten, sortiert nach Kategorien.`}
      />
      <div className="shell pb-24">
        {kategorien.map((k) => {
          const projekteDerKategorie = liste.filter((p) => p.kategorie === k.name);
          if (projekteDerKategorie.length === 0) return null;
          return (
            <section key={k.key} className="rule-t py-10">
              <h2 className="display-md">{k.name}</h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projekteDerKategorie.map((p) => (
                  <li key={p.slug}>
                    <ProjektCard projekt={p} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

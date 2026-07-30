import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { vorstand } from "@/data/site";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/verein/vorstand/$slug")({
  head: ({ params }) => {
    const person = vorstand.find((p) => p.slug === params.slug);
    const title = person ? `${person.name} – ${person.rolle}` : "Vorstand – aed e.V. Stuttgart";
    const description = person
      ? `Statement und Vita von ${person.name}, ${person.rolle} des aed e.V. Stuttgart.`
      : "Vorstand des aed e.V. Stuttgart";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
        { property: "og:url", content: `/verein/vorstand/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/verein/vorstand/${params.slug}` }],
    };
  },
  component: VorstandDetailPage,
});

function initialen(name: string) {
  return name
    .replace(/^(Prof\. Dr\. phil\.|Prof\. Dr\. Dr\. E\.h\. Dr\. h\.c\.|Prof\. Dr\.|Dr\. Dr\.|Prof\.|Dr\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((t) => t[0])
    .slice(0, 2)
    .join("");
}

function VorstandDetailPage() {
  const { slug } = Route.useParams();
  const person = vorstand.find((p) => p.slug === slug);

  if (!person) {
    throw notFound();
  }

  return (
    <>
      <section className="bg-brand text-brand-foreground">
        <div className="shell flex min-h-[50vh] flex-col justify-between py-12 md:min-h-[60vh] md:py-16">
          <Link
            to="/verein"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-foreground/80 transition-colors hover:text-brand-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Zurück zum Verein
          </Link>
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight md:text-6xl lg:text-7xl">
              {person.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg font-medium md:text-xl">{person.rolle}</p>
          </div>
        </div>
      </section>

      <section className="shell rule-t py-16" aria-labelledby="statement">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div
              aria-hidden="true"
              className="flex aspect-4/5 items-center justify-center bg-card font-display text-7xl text-foreground md:text-9xl"
            >
              {initialen(person.name)}
            </div>
          </div>
          <div className="md:col-span-8 max-w-3xl">
            <h2 id="statement" className="eyebrow">
              Statement
            </h2>
            {person.statement ? (
              <div className="mt-6 space-y-6 text-lg leading-relaxed">
                {person.statement
                  .split("\n")
                  .filter(Boolean)
                  .map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
              </div>
            ) : (
              <p className="mt-6 text-muted-foreground">
                Für dieses Vorstandsmitglied liegt noch kein Statement vor.
              </p>
            )}
            {person.email && (
              <a href={`mailto:${person.email}`} className="mt-8 inline-flex text-sm underline link-brand">
                {person.email}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="shell rule-t pb-16 band-muted" aria-labelledby="weitere-vorstaende">
        <h2 id="weitere-vorstaende" className="eyebrow pt-16">
          Weitere Personen
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vorstand
            .filter((p) => p.slug !== slug)
            .map((p) => (
              <li key={p.slug}>
                <Link
                  to="/verein/vorstand/$slug" params={{ slug: p.slug! }}
                  className="group block border border-line bg-card p-4 transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  <span className="font-display text-lg leading-tight">{p.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground group-hover:text-brand-foreground/80">
                    {p.rolle}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
        <div className="mt-8 pb-16">
          <Link to="/verein/vorstand" className="btn-outline">
            Alle Vorstände
          </Link>
        </div>
      </section>
    </>
  );
}

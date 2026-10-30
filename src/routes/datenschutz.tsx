import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { PageHeader } from "@/components/ui-bits";
import { datenschutzKapitel, datenschutzStand } from "@/data/datenschutz";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – aed e.V. Stuttgart" },
      {
        name: "description",
        content: "Informationen zum Umgang mit personenbezogenen Daten beim aed e.V.",
      },
      { property: "og:title", content: "Datenschutz – aed e.V. Stuttgart" },
      { property: "og:description", content: "Datenschutzhinweise des aed e.V." },
      { property: "og:url", content: "/datenschutz" },
    ],
    links: [{ rel: "canonical", href: "/datenschutz" }],
  }),
  component: DatenschutzPage,
});

/**
 * Macht Internetadressen und E-Mail-Adressen im Fließtext anklickbar.
 * Der Text selbst bleibt unverändert – er kommt vom Datenschutzbeauftragten.
 */
function mitLinks(text: string) {
  const teile = text.split(/(https?:\/\/[^\s)]+[^\s).,]|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return teile.map((teil, i) => {
    if (/^https?:\/\//.test(teil)) {
      return (
        <a
          key={i}
          href={teil}
          rel="noopener noreferrer"
          target="_blank"
          className="underline underline-offset-2 [overflow-wrap:anywhere]"
        >
          {teil}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(teil)) {
      return (
        <a key={i} href={`mailto:${teil}`} className="underline underline-offset-2">
          {teil}
        </a>
      );
    }
    return <Fragment key={i}>{teil}</Fragment>;
  });
}

function DatenschutzPage() {
  return (
    <>
      <PageHeader eyebrow="Rechtliches" titel="Datenschutz" />
      <section className="shell max-w-3xl pb-24">
        <p className="meta">Stand: {datenschutzStand}</p>

        {datenschutzKapitel.map((kapitel, nr) => (
          <div key={kapitel.titel} className="rule-t mt-10 pt-6">
            <h2 className="display-sm">
              {nr + 1}. {kapitel.titel}
            </h2>

            {kapitel.teile.map((teil, i) => (
              <div key={`${teil.titel}-${i}`} className="mt-6">
                {teil.titel && <h3 className="font-medium">{teil.titel}</h3>}
                {teil.absaetze.map((absatz, j) => (
                  <p key={j} className="mt-3 leading-relaxed text-muted-foreground">
                    {mitLinks(absatz)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

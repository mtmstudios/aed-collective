import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { downloads } from "@/data/site";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Service & Downloads – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Programme, Flyer, Publikationen, Logo-Paket und Pressekit des aed e.V. zum Herunterladen.",
      },
      { property: "og:title", content: "Service & Downloads – aed e.V. Stuttgart" },
      { property: "og:description", content: "Alle Downloads des aed e.V. an einem Ort." },
      { property: "og:url", content: "/service" },
    ],
    links: [{ rel: "canonical", href: "/service" }],
  }),
  component: ServicePage,
});

function ServicePage() {
  return (
    <>
      <PageHeader
        eyebrow="Service"
        titel="Downloads"
        intro="Unterlagen zum Verein, zum Programm und zur Presse­arbeit – frei verwendbar unter Nennung der Quelle."
      />
      <section className="shell pb-24">
        <ul className="rule-t">
          {downloads.map((d) => (
            <li key={d.titel}>
              <a
                href={d.url}
                className="group flex flex-wrap items-center justify-between gap-4 border-b border-line py-6 transition-colors hover:bg-muted"
              >
                <span className="max-w-2xl">
                  <span className="block font-display text-lg group-hover:text-[var(--brand-deep)]">
                    {d.titel}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{d.beschreibung}</span>
                </span>
                <span className="flex items-center gap-3 text-sm text-muted-foreground">
                  {d.typ}
                  <Download className="size-4" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

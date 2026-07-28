import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { kontakt } from "@/data/site";
import { presseKit } from "@/data/neuland";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/presse")({
  head: () => ({
    meta: [
      { title: "Presse – neuland | aed e.V." },
      {
        name: "description",
        content:
          "Pressekit zum Nachwuchswettbewerb neuland: Pressetexte, Bildmaterial, Logos und Ansprechpartnerin.",
      },
      { property: "og:title", content: "Presse – neuland | aed e.V." },
      { property: "og:description", content: "Pressematerial zum Wettbewerb neuland." },
      { property: "og:url", content: "/neuland/presse" },
    ],
    links: [{ rel: "canonical", href: "/neuland/presse" }],
  }),
  component: PressePage,
});

function PressePage() {
  return (
    <>
      <PageHeader
        eyebrow="neuland"
        titel="Presse"
        intro="Material zur Berichterstattung über den Wettbewerb und die ausgezeichneten Arbeiten. Bildrechte liegen bei den jeweiligen Urheber:innen, Nennung erforderlich."
      />
      <section className="shell pb-16">
        <ul className="border-t border-line">
          {presseKit.map((k) => (
            <li key={k.titel}>
              <a
                href={k.url}
                className="group flex flex-wrap items-center justify-between gap-4 border-b border-line py-6 transition-colors hover:bg-muted"
              >
                <span className="font-display text-lg group-hover:text-[var(--brand-deep)]">{k.titel}</span>
                <span className="flex items-center gap-3 text-sm text-muted-foreground">
                  {k.typ}
                  <Download className="size-4" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="shell pb-24">
        <div className="rule-t pt-8">
          <h2 className="eyebrow">Pressekontakt</h2>
          <p className="mt-3 leading-relaxed">
            {kontakt.geschaeftsstelle}, Geschäftsstelle aed e.V.
            <br />
            <a href={`tel:${kontakt.telefonHref}`} className="underline link-brand">
              {kontakt.telefon}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${kontakt.email}`} className="underline link-brand">
              {kontakt.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

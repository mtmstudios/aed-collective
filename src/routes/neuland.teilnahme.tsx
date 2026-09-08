import { createFileRoute } from "@tanstack/react-router";
import { teilnahmebedingungen } from "@/data/neuland";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/teilnahme")({
  head: () => ({
    meta: [
      { title: "Teilnahmebedingungen – neuland | aed e.V." },
      {
        name: "description",
        content:
          "Teilnahmebedingungen des Nachwuchswettbewerbs neuland: Teilnahmeberechtigung, Einreichung, Fristen, Nutzungsrechte und Preise.",
      },
      { property: "og:title", content: "Teilnahmebedingungen – neuland | aed e.V." },
      { property: "og:description", content: "Alle elf Abschnitte der Teilnahmebedingungen im Überblick." },
      { property: "og:url", content: "/neuland/teilnahme" },
    ],
    links: [{ rel: "canonical", href: "/neuland/teilnahme" }],
  }),
  component: TeilnahmePage,
});

function TeilnahmePage() {
  return (
    <>
      <PageHeader
        eyebrow="neuland"
        titel="Teilnahme"
        intro="Kostenfrei, digital und offen für Studierende und Absolvent:innen aller Hochschulen, Akademien und Universitäten – bis 28 Jahre, disziplinübergreifend."
      />
      <div className="shell pb-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            {teilnahmebedingungen.map((a) => (
              <section key={a.titel} className="rule-t py-6">
                <h2 className="display-sm">{a.titel}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{a.text}</p>
              </section>
            ))}
          </div>
          <aside className="md:col-span-4">
            <div className="sticky top-28 border border-line bg-card p-6">
              <p className="eyebrow">Teilnahme an der Ausschreibung 2026</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Für die Teilnahme am aed-Wettbewerb neuland für 2027 brauchst Du folgende
                Unterlagen: Darstellungen Deiner Arbeit, Titel und Beschreibungen, Kategorie der
                Einreichung und Deine persönlichen Daten.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Um die Einreichung möglichst einfach zu gestalten, haben wir ein
                Einreichungsformular vorbereitet.
              </p>
              <a
                href="mailto:info@aed-stuttgart.de?subject=neuland%202027%20Einreichung"
                className="btn-solid mt-6 w-full"
              >
                Am Wettbewerb neuland 2027 teilnehmen
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

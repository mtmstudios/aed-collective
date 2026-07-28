import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/verein/satzung")({
  head: () => ({
    meta: [
      { title: "Satzung – aed e.V. Stuttgart" },
      { name: "description", content: "Die Satzung des aed e.V. – Zweck, Mitgliedschaft, Organe und Beiträge." },
      { property: "og:title", content: "Satzung – aed e.V. Stuttgart" },
      { property: "og:description", content: "Die aktuelle Fassung der Vereinssatzung des aed e.V." },
      { property: "og:url", content: "/verein/satzung" },
    ],
    links: [{ rel: "canonical", href: "/verein/satzung" }],
  }),
  component: SatzungPage,
});

const paragraphen = [
  {
    titel: "§ 1 Name, Sitz, Geschäftsjahr",
    text: "Der Verein führt den Namen „aed e.V.“ und hat seinen Sitz in Stuttgart. Er ist in das Vereinsregister eingetragen. Das Geschäftsjahr ist das Kalenderjahr.",
  },
  {
    titel: "§ 2 Zweck des Vereins",
    text: "Zweck des Vereins ist die Förderung von Kunst und Kultur sowie von Bildung im Bereich Architektur, Engineering und Design. Der Satzungszweck wird verwirklicht durch Veranstaltungen, Publikationen, Ausstellungen sowie durch die Förderung des gestalterischen Nachwuchses, insbesondere durch den Wettbewerb neuland.",
  },
  {
    titel: "§ 3 Gemeinnützigkeit",
    text: "Der Verein verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke. Er ist selbstlos tätig und verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke. Mittel des Vereins dürfen nur für satzungsmäßige Zwecke verwendet werden.",
  },
  {
    titel: "§ 4 Mitgliedschaft",
    text: "Mitglied können natürliche und juristische Personen werden, die den Vereinszweck unterstützen. Der Verein kennt Personenmitgliedschaften, ermäßigte Mitgliedschaften für Studierende sowie Fördermitgliedschaften für Unternehmen und Institutionen.",
  },
  {
    titel: "§ 5 Beginn und Ende der Mitgliedschaft",
    text: "Über den Aufnahmeantrag entscheidet der Vorstand. Die Mitgliedschaft endet durch Austritt, Ausschluss, Tod oder Auflösung der juristischen Person. Der Austritt ist mit einer Frist von drei Monaten zum Jahresende schriftlich zu erklären.",
  },
  {
    titel: "§ 6 Beiträge",
    text: "Die Höhe der Mitgliedsbeiträge wird von der Mitgliederversammlung in einer Beitragsordnung festgelegt. Die Beiträge sind jährlich im Voraus zu entrichten.",
  },
  {
    titel: "§ 7 Organe",
    text: "Organe des Vereins sind die Mitgliederversammlung und der Vorstand. Zur inhaltlichen Beratung beruft der Vorstand einen Beirat.",
  },
  {
    titel: "§ 8 Vorstand",
    text: "Der Vorstand besteht aus der oder dem 1. Vorsitzenden, der oder dem 2. Vorsitzenden sowie weiteren Vorstandsmitgliedern für Kommunikation und Finanzen. Der Vorstand wird für zwei Jahre gewählt und bleibt bis zur Neuwahl im Amt.",
  },
  {
    titel: "§ 9 Mitgliederversammlung",
    text: "Die ordentliche Mitgliederversammlung findet einmal jährlich statt. Sie beschließt über Jahresbericht, Entlastung des Vorstands, Wahlen, Beitragsordnung und Satzungsänderungen.",
  },
  {
    titel: "§ 10 Auflösung",
    text: "Bei Auflösung des Vereins oder Wegfall steuerbegünstigter Zwecke fällt das Vermögen an eine juristische Person des öffentlichen Rechts oder eine andere steuerbegünstigte Körperschaft zur Verwendung für die Förderung von Kunst, Kultur und Bildung.",
  },
];

function SatzungPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verein"
        titel="Satzung"
        intro="Die Satzung regelt Zweck, Mitgliedschaft und Organe des aed e.V. Maßgeblich ist die beim Vereinsregister hinterlegte Fassung."
      />
      <div className="shell pb-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8 space-y-8">
            {paragraphen.map((p) => (
              <section key={p.titel} className="rule-t pt-6">
                <h2 className="font-display text-xl">{p.titel}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.text}</p>
              </section>
            ))}
          </div>
          <aside className="md:col-span-4">
            <div className="border border-line bg-card p-6">
              <h2 className="eyebrow">Download</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Satzung als PDF, aktuelle Fassung (0,3 MB).
              </p>
              <a href="#" className="btn-outline mt-4 w-full">
                Satzung herunterladen
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

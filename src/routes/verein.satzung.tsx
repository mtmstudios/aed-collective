import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/verein/satzung")({
  head: () => ({
    meta: [
      { title: "Satzung – aed e.V. Stuttgart" },
      { name: "description", content: "Die Satzung des Vereins zur Förderung von Architektur, Engineering und Design in Stuttgart e.V." },
      { property: "og:title", content: "Satzung – aed e.V. Stuttgart" },
      { property: "og:description", content: "Die aktuelle Fassung der Vereinssatzung des aed e.V." },
      { property: "og:url", content: "/verein/satzung" },
    ],
    links: [{ rel: "canonical", href: "/verein/satzung" }],
  }),
  component: SatzungPage,
});

// Originalsatzung der Bestands-Website (beschlossen 16.02.2004, zuletzt geändert 09.12.2014)
const paragraphen = [
  {
    titel: "§ 1 Name, Sitz, Geschäftsjahr",
    text: "Der Verein führt den Namen: Verein zur Förderung von Architektur, Engineering und Design in Stuttgart e.V. Er hat seinen Sitz in Stuttgart und wird im Vereinsregister des Amtsgerichtes Stuttgart eingetragen. Das Kalenderjahr ist das Geschäftsjahr.",
  },
  {
    titel: "§ 2 Zweck des Vereins",
    text: "Der Verein verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke im Sinne des Abschnitts „Steuerbegünstigte Zwecke“ der Abgabenordnung. Dies sind insbesondere: die Unterstützung und Anregung der öffentlichen Wahrnehmung und Diskussion in den Themenbereichen Architektur, Engineering und Design; die Etablierung eines dauerhaften Ausstellungsraumes; die Organisation und Ausrichtung von Ausstellungen und Veranstaltungen; die Schaffung eines öffentlichen Raumes für die interdisziplinäre Diskussion; die Förderung des Nachwuchses durch Ausstellungsflächen und Nachwuchswettbewerbe; Kooperationen mit Organisationen vergleichbarer Zielsetzung. Der Verein ist selbstlos tätig; er verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke.",
  },
  {
    titel: "§ 3 Mitgliedschaft",
    text: "Mitglieder des Vereins können natürliche und juristische Personen werden, die die Ziele des Vereins unterstützen. Über die Aufnahme entscheidet der Vorstand endgültig. Der Beitritt wird per schriftlichem Antrag vollzogen. Von den Mitgliedern werden jährliche Mitgliedsbeiträge erhoben; über deren Höhe entscheidet die Mitgliederversammlung.",
  },
  {
    titel: "§ 4 Erlöschen der Mitgliedschaft",
    text: "Die Mitgliedschaft erlischt durch den Tod eines Mitgliedes oder die Auflösung der juristischen Person, durch schriftliche Austrittserklärung mit einer Kündigungsfrist von drei Monaten zum Ende des Geschäftsjahres oder durch Ausschluss, den der Vorstand mit Zustimmung des Beirates aus wichtigem Grund beschließen kann.",
  },
  {
    titel: "§ 5 Aufbringung und Verwendung der Mittel",
    text: "Die Mittel werden aufgebracht durch Spenden in Geld und anderen Zuwendungen sowie durch Mitgliedsbeiträge. Mittel des Vereins dürfen nur für die satzungsgemäßen Zwecke verwendet werden. Die Mitglieder erhalten keine Gewinnanteile oder sonstige Zuwendungen aus Mitteln des Vereins. Vereinsämter werden grundsätzlich ehrenamtlich ausgeübt.",
  },
  {
    titel: "§ 6 Organe",
    text: "Organe des Vereins sind der Vorstand, der Beirat und die Mitgliederversammlung.",
  },
  {
    titel: "§ 7 Vorstand",
    text: "Der Vorstand besteht aus dem Vorsitzenden, dem stellvertretenden Vorsitzenden, dem Schriftführer und dem Schatzmeister. Die Vorstandsmitglieder werden von der Mitgliederversammlung auf drei Geschäftsjahre gewählt; Wiederwahl ist zulässig. Dem Vorstand obliegt die Vereinsleitung, die Durchführung der Beschlüsse und die Verwaltung des Vermögens. Vorstand im Sinne des § 26 BGB sind der Vorsitzende, der stellvertretende Vorsitzende und der Schriftführer; jeder vertritt den Verein alleine.",
  },
  {
    titel: "§ 8 Beirat",
    text: "Der Beirat besteht aus mindestens 3 und höchstens 10 Mitgliedern, die von der Mitgliederversammlung auf die Dauer von drei Jahren gewählt werden. Wiederwahl ist zulässig. Der Beirat bestellt aus seiner Mitte seinen Vorsitzenden, unterstützt und berät den Vorstand.",
  },
  {
    titel: "§ 9 Mitgliederversammlung",
    text: "Die Mitgliederversammlung wird mindestens einmal jährlich mit vierwöchiger Einladungsfrist einberufen. Aufgaben: Entgegennahme des Verwaltungsberichtes und der Jahresrechnung, Bestellung und Entlastung des Vorstandes, Wahl der Beiratsmitglieder, Festlegung der Mitgliederbeiträge sowie Beschlussfassung über Satzungsänderungen (¾-Mehrheit) oder die Auflösung des Vereins.",
  },
  {
    titel: "§ 10 Auflösung",
    text: "Bei Auflösung oder Aufhebung der Körperschaft oder bei Wegfall steuerbegünstigter Zwecke fällt das Vermögen zu gleichen Teilen der Mia-Seeger-Stiftung in Stuttgart, der Architekturgalerie am Weißenhof, dem Verein zur Förderung des Leichtbaus e.V. und der Vereinigung von Freunden der Universität Stuttgart e.V. zu.",
  },
  {
    titel: "§ 11 Schlussbestimmung",
    text: "Der Verein ist nach Eintragung in das Vereinsregister beim Amtsgericht Stuttgart anzumelden. Dem Vorstand ist das Recht übertragen, etwaige Satzungsänderungen vorzunehmen, die der Registerrichter für erforderlich hält oder das Finanzamt bei der Anerkennung der Gemeinnützigkeit fordert.",
  },
];

function SatzungPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verein"
        titel="Satzung"
        intro="Verein zur Förderung von Architektur, Engineering und Design in Stuttgart e.V. – beschlossen am 16. Februar 2004, zuletzt geändert am 9. Dezember 2014."
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
              <h2 className="eyebrow">Vereinsregister</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Amtsgericht Stuttgart, VR-Nr. 7136
                <br />
                Beschlossen am 16. Februar 2004
                <br />
                Geändert am 21. Dezember 2007 und 9. Dezember 2014
              </p>
              <h2 className="eyebrow mt-6">Gründungsmitglieder</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Alexander Hafner · Dr. Frank Heinlein · Silvia Olp · Ralf Schmitz · Prof. Werner
                Sobek · Prof. Andreas Uebele · Roberto Zwirn
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

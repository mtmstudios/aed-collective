import { createFileRoute } from "@tanstack/react-router";
import { kontakt } from "@/data/site";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – aed e.V. Stuttgart" },
      { name: "description", content: "Informationen zum Umgang mit personenbezogenen Daten beim aed e.V." },
      { property: "og:title", content: "Datenschutz – aed e.V. Stuttgart" },
      { property: "og:description", content: "Datenschutzhinweise des aed e.V." },
      { property: "og:url", content: "/datenschutz" },
    ],
    links: [{ rel: "canonical", href: "/datenschutz" }],
  }),
  component: DatenschutzPage,
});

const abschnitte = [
  {
    titel: "Verantwortliche Stelle",
    text: `${kontakt.name}, ${kontakt.strasse}, ${kontakt.plz} ${kontakt.ort}, ${kontakt.email}`,
  },
  {
    titel: "Erhebung und Verarbeitung",
    text: "Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung der Website, zur Durchführung von Veranstaltungen, zur Mitgliederverwaltung und zum Versand des Newsletters erforderlich ist.",
  },
  {
    titel: "Server-Logfiles",
    text: "Beim Aufruf der Website werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, abgerufene Seite) verarbeitet. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren Betrieb nach Art. 6 Abs. 1 lit. f DSGVO.",
  },
  {
    titel: "Newsletter",
    text: "Für den Newsletter verarbeiten wir E-Mail-Adresse, Vor- und Nachnamen sowie optional das Interesse am Wettbewerb neuland. Die Anmeldung erfolgt im Double-Opt-in-Verfahren, der Versand über einen Dienstleister. Sie können sich jederzeit über den Link in jeder E-Mail abmelden.",
  },
  {
    titel: "Mitgliedsantrag und Wettbewerbseinreichung",
    text: "Die im Formular angegebenen Daten verwenden wir ausschließlich zur Bearbeitung Ihres Anliegens. Eine Weitergabe erfolgt nur an Beteiligte der Durchführung, etwa Jurymitglieder im Rahmen des Wettbewerbs.",
  },
  {
    titel: "Karte",
    text: "Die Kartendarstellung auf der Kontaktseite wird von OpenStreetMap geladen. Dabei wird Ihre IP-Adresse an den Kartendienst übermittelt.",
  },
  {
    titel: "Ihre Rechte",
    text: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde.",
  },
];

function DatenschutzPage() {
  return (
    <>
      <PageHeader eyebrow="Rechtliches" titel="Datenschutz" />
      <section className="shell max-w-3xl space-y-8 pb-24">
        {abschnitte.map((a) => (
          <div key={a.titel} className="rule-t pt-6">
            <h2 className="font-display text-xl">{a.titel}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{a.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}

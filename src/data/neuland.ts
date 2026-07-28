// Inhalte aus dem Crawl von aed-neuland.de (Stand 28.07.2026).
// Kategorien, Kriterien, Preise, Jury und Teilnahmebedingungen sind Originalinhalte des Wettbewerbs 2025.

export { projekte, type Projekt } from "./projekte";

export const wettbewerbStatus = {
  offen: false,
  jahrgang: "2025",
  hinweis:
    "aed neuland 2025 ist abgeschlossen – über 250 Einreichungen, 25 Preisträger:innen. Der nächste Jahrgang wird über Newsletter und Instagram angekündigt.",
};

// Die fünf Kategorien des Wettbewerbs (Original)
export const kategorien = [
  {
    key: "architecture-engineering",
    name: "Architecture + Engineering",
    text: "Entwürfe und Abschlussarbeiten aus Architektur, Ingenieurwesen und Tragwerksplanung – vom Mikrohaus bis zur schwimmenden Infrastruktur.",
  },
  {
    key: "exhibition-interior",
    name: "Exhibition Design + Interior Design",
    text: "Ausstellungsgestaltung und Innenarchitektur – Räume, die vermitteln, orientieren und Haltung zeigen.",
  },
  {
    key: "product-design",
    name: "Product Design",
    text: "Objekte, Systeme und Serien vom Prototyp bis zur Serienreife – nachhaltig gedacht und nutzerzentriert gestaltet.",
  },
  {
    key: "communication-design",
    name: "Communication Design",
    text: "Kampagnen, Publikationen, Leitsysteme und visuelle Identitäten – Kommunikation mit gesellschaftlicher Relevanz.",
  },
  {
    key: "interaction-design",
    name: "Interaction Design",
    text: "Interfaces, Apps, AR/VR und interaktive Installationen – Gestaltung an der Schnittstelle von Mensch und Technologie.",
  },
];

// Die acht Auswahlkriterien (Original aus den Teilnahmebedingungen)
export const kriterien = [
  "Idee",
  "Funktion, Gebrauchswert und Benutzerführung",
  "Technische Realisierbarkeit",
  "Wirtschaftliche Verwertbarkeit",
  "Interdisziplinärer Ansatz",
  "Qualität der Präsentation",
  "Technisch-funktionale Innovation",
  "Berücksichtigung von Nachhaltigkeitsaspekten",
];

// Echte Preisstruktur: je Kategorie ein 1. Preis (2.000 €) + bis zu vier Auszeichnungen
export const preise = [
  {
    platz: "1. Preis",
    dotierung: "2.000 €",
    info: "je Kategorie – gespendet von Atelier Brückner, PHOENIX, Rat für Formgebung, studiokurbos und Werner Sobek",
  },
  {
    platz: "Auszeichnung",
    dotierung: "Urkunde",
    info: "bis zu vier Auszeichnungen je Kategorie, mit Jurystatement und Projektseite",
  },
];

export const sponsoren = [
  { name: "Karl Schlecht Stiftung", rolle: "Hauptförderer" },
  { name: "Atelier Brückner", rolle: "Preisgeldsponsor" },
  { name: "PHOENIX", rolle: "Preisgeldsponsor" },
  { name: "Rat für Formgebung", rolle: "Preisgeldsponsor" },
  { name: "studiokurbos", rolle: "Preisgeldsponsor" },
  { name: "Werner Sobek", rolle: "Preisgeldsponsor" },
];

// Termine des abgeschlossenen Jahrgangs 2025
export const termine = [
  { datum: "31. März 2025", text: "Einsendeschluss" },
  { datum: "Ende April 2025", text: "Jurysitzung in Stuttgart" },
  { datum: "3. Juli 2025", text: "Preisverleihung in der Architektenkammer Baden-Württemberg" },
];

// Teilnahmebedingungen 2025 (Original, redaktionell gekürzt)
export const teilnahmebedingungen = [
  {
    titel: "1. Allgemeines",
    text: "Der aed lobt mit Unterstützung der Karl Schlecht Stiftung und weiterer Förder:innen den „neuland“-Förderpreis aus, einen Nachwuchswettbewerb für junge Gestalter:innen. Ziel ist es, innovative und nachhaltige Gestaltung zu fördern, die sich durch größtmögliche ökonomische wie ökologische Qualität auszeichnet, funktional und nutzerfreundlich ist und höchsten ästhetischen Anforderungen entspricht. Im Mittelpunkt stehen immer der Mensch und der gesellschaftliche Nutzen. Der Wettbewerb ist bewusst disziplinübergreifend und nicht auf bestimmte Fachgebiete oder Hochschulen beschränkt.",
  },
  {
    titel: "2. Preise",
    text: "In jeder der fünf Kategorien gibt es eine:n Gold-Preisträger:in mit einem Preisgeld von 2.000 Euro, gespendet von Atelier Brückner, PHOENIX, Rat für Formgebung, studiokurbos und Werner Sobek. Außerdem gibt es bis zu vier Anerkennungen pro Kategorie. Alle Preisträger:innen werden mit Jurystatements auf der Website vorgestellt – so können Studierende ihre ausgezeichneten Arbeiten in Bewerbungen verlinken.",
  },
  {
    titel: "3. Kategorien",
    text: "Der Förderpreis wird in fünf Kategorien vergeben: Architecture + Engineering, Exhibition Design + Interior Design, Product Design, Communication Design und Interaction Design.",
  },
  {
    titel: "4. Auswahlkriterien",
    text: "Bewertet werden: Idee, Funktion/Gebrauchswert/Benutzerführung, technische Realisierbarkeit, wirtschaftliche Verwertbarkeit, interdisziplinärer Ansatz, Qualität der Präsentation, technisch-funktionale Innovation sowie die Berücksichtigung von Nachhaltigkeitsaspekten.",
  },
  {
    titel: "5. Jury",
    text: "Über die Vergabe entscheidet eine unabhängige Jury aus rund 20 anerkannten Fachleuten aus Architektur, Ingenieurwesen und Design. Die Beratungen sind nicht öffentlich, die Jury entscheidet mit einfacher Stimmenmehrheit. Ihre Entscheidung ist nicht anfechtbar; der Rechtsweg ist ausgeschlossen.",
  },
  {
    titel: "6. Veranstalter und Förderer",
    text: "Veranstalter ist der aed – Verein zur Förderung von Architektur, Engineering und Design in Stuttgart e.V. Hauptförderer ist die Karl Schlecht Stiftung, eine gemeinnützige Stiftung mit Fokus auf „Good Leadership“, die rund 100 Projekte mit jährlich etwa 8 Millionen Euro fördert.",
  },
  {
    titel: "7. Kosten",
    text: "Für die Teilnahme am Nachwuchswettbewerb „neuland“ wird keine Gebühr erhoben.",
  },
  {
    titel: "8. Einzureichende Unterlagen",
    text: "Jede Arbeit wird online registriert; für jede eingereichte Arbeit ist eine separate Anmeldung nötig. Die Bewerbung wird auf maximal zehn Seiten als PDF (max. 10 MB) erklärt. Auf der Titelseite: Name, Anschrift, Hochschule, Titel der Arbeit und Kategorie. Links zu Filmen oder Websites können eingearbeitet werden; Modelle oder weitere Unterlagen sind nicht erforderlich.",
  },
  {
    titel: "9. Teilnahmevoraussetzungen",
    text: "Teilnahmeberechtigt sind Studierende und Absolvent:innen von Hochschulen, Akademien und Universitäten, die zum Einsendeschluss nicht älter als 28 Jahre sind. Eingereicht werden können Abschlussarbeiten ebenso wie Semesterarbeiten und freie Arbeiten.",
  },
  {
    titel: "10. Termine",
    text: "Jahrgang 2025: Einsendeschluss 31. März 2025, Jurysitzung Ende April 2025, Preisverleihung am 3. Juli 2025 in der Architektenkammer Baden-Württemberg.",
  },
  {
    titel: "11. Kontakt",
    text: "aed e.V., Olgastraße 138, 70180 Stuttgart · +49 160 8894377 · info@aed-stuttgart.de",
  },
];

// Die echte Jury 2025 (21 Mitglieder)
export const jury2025 = [
  { name: "Silvia Olp", rolle: "Initiatorin & Management aed neuland, aed Beirat" },
  { name: "Olaf Barski", rolle: "Barski Design, Industriedesigner", link: "https://www.barskidesign.com" },
  { name: "Kai Bierich", rolle: "Architekt" },
  { name: "Prof. Lucio Blandini", rolle: "Bauingenieur / Architekt, ILEK Universität Stuttgart", link: "https://www.ilek.uni-stuttgart.de" },
  { name: "Lutz Dietzold", rolle: "CEO, Rat für Formgebung", link: "https://www.gdc.de" },
  { name: "Prof. Rahel Flechtner", rolle: "Design Research + Interaction Design, HfG Schwäbisch Gmünd" },
  { name: "May-Britt Frank-Grosse", rolle: "Chefredakteurin, baunetz interior|design", link: "https://www.baunetz-id.de" },
  { name: "Dina Gallo", rolle: "Industriedesignerin, TRUMPF Leitung Designmanagement" },
  { name: "Ben Kauffmann", rolle: "Architekt, KTP Architekten", link: "https://www.ktp-architekten.de" },
  { name: "Moritz Kemper", rolle: "UX/UI Principal Designer, PHOENIX", link: "https://www.phoenixdesign.com" },
  { name: "Dr. Petra Kiedaisch", rolle: "Geschäftsführerin, avedition", link: "https://www.avedition.de" },
  { name: "Andreas Kurbos", rolle: "Designer und Geschäftsführer, studiokurbos", link: "https://www.kurbos.com" },
  { name: "Nils Holger Moormann", rolle: "Art Direction", link: "https://nhm-ad.de" },
  { name: "Johanna Neves Pimenta", rolle: "Chefredakteurin, md", link: "https://www.md-mag.com" },
  { name: "Peter Scheerer", rolle: "Kommunikationsdesigner, SEO, SEA", link: "https://www.peterscheerer.com" },
  { name: "Dr. Katrin Schlecht", rolle: "Vorstandsvorsitzende, Karl Schlecht Stiftung", link: "https://www.karlschlechtstiftung.de" },
  { name: "Prof. Jürgen Späth", rolle: "Interaction Designer" },
  { name: "Petra Stephan", rolle: "Chefredakteurin, AIT", link: "https://ait-xia-dialog.de" },
  { name: "Joachim Stumpp", rolle: "Geschäftsführer und Architekt, Material Bank Studio", link: "https://www.materialbank.eu" },
  { name: "Prof. Andreas Uebele", rolle: "Kommunikationsdesigner, büro uebele", link: "https://www.uebele.com" },
  { name: "Lisa Zech", rolle: "Kommunikationsdesignerin, STUDIO LZ", link: "https://studio-lz.de" },
];

export const jahrgaenge = ["2025", "2023", "2021", "2019"];

// Echte Kennzahlen des Jahrgangs 2025
export const kennzahlen = [
  { wert: "250+", label: "Einreichungen 2025" },
  { wert: "25", label: "Preisträger:innen 2025" },
  { wert: "5", label: "Kategorien" },
  { wert: "2.000 €", label: "je 1. Preis" },
];

export const karlSchlechtText =
  "Die Karl Schlecht Stiftung ist eine gemeinnützige Stiftung mit Fokus auf „Good Leadership“. Ihre Leitidee ist die Verbesserung von Führung in Business und Gesellschaft durch humanistische Werte. Sie fördert die ganzheitliche, wertebasierte Persönlichkeitsentwicklung junger Menschen und angehender Führungskräfte – derzeit rund 100 Fremdprojekte sowie eigene Projekte mit jährlich etwa 8 Millionen Euro. Gegründet wurde die Stiftung 1998 von Dipl.-Ing. Karl Schlecht, dem Gründer des Betonpumpenherstellers Putzmeister. Mit ihrer Unterstützung wurde aed neuland 2025 bereits zum zehnten Mal ausgelobt.";

// Echtes Pressekit (Dateien der Bestands-Website)
export const presseKit = [
  {
    titel: "Pressemitteilung Preisverleihung 2025",
    typ: "PDF, 0,4 MB",
    url: "https://www.aed-neuland.de/app/download/6462715266/2025+PM+Preisverleihung+aed+neuland.pdf",
  },
  {
    titel: "Banner quadratisch, Farbe (PNG, RGB)",
    typ: "PNG, 42 KB",
    url: "https://www.aed-neuland.de/app/download/6462716866/aed-neuland_square_color.png",
  },
  {
    titel: "Banner quer mit Jahreszahl (JPG, RGB)",
    typ: "JPG, 1,1 MB",
    url: "https://www.aed-neuland.de/app/download/6462717666/aed-neuland-banner_2025_3_big_aed.jpg",
  },
  {
    titel: "Anzeige DIN quer, schmal (PDF, CMYK)",
    typ: "PDF, 0,9 MB",
    url: "https://www.aed-neuland.de/app/download/6462718266/aed_neuland_anzeige_DINquer_rz_ps_2025-schmal.pdf",
  },
  {
    titel: "Anzeige DIN quer (PDF, CMYK)",
    typ: "PDF, 0,9 MB",
    url: "https://www.aed-neuland.de/app/download/6462718866/aed_neuland_anzeige_DINquer_rz_ps_2025.pdf",
  },
  {
    titel: "Anzeige groß, Hochformat (PDF, CMYK)",
    typ: "PDF, 0,7 MB",
    url: "https://www.aed-neuland.de/app/download/6462720066/aed_neuland_anzeige_form_gro%C3%9F_rz_ps_2025_RZ_var4_cradle.pdf",
  },
];

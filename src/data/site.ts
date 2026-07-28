export const kontakt = {
  name: "aed e.V.",
  strasse: "Olgastraße 138",
  plz: "70180",
  ort: "Stuttgart",
  telefon: "+49 160 8894377",
  telefonHref: "+491608894377",
  email: "info@aed-stuttgart.de",
  geschaeftsstelle: "Iris Enderle",
  zeiten: "Montag bis Freitag, 9–18 Uhr",
};

export type EventItem = {
  slug: string;
  titel: string;
  datum: string; // ISO
  uhrzeit?: string;
  ort: string;
  format: "Vortrag" | "Exkursion" | "Fest" | "Ausstellung" | "Werkstattgespräch";
  teaser: string;
  text: string;
  anmeldung?: string;
};

export const events: EventItem[] = [
  {
    slug: "sommerfest-2026",
    titel: "aed Sommerfest 2026",
    datum: "2026-09-17",
    uhrzeit: "19:00",
    ort: "Stuttgart, Ort wird bekanntgegeben",
    format: "Fest",
    teaser: "Der gestalterische Jahreshöhepunkt: Mitglieder, Gäste und Freunde des Vereins treffen sich zum Austausch.",
    text: "Einmal im Jahr öffnet der aed die Türen für ein Fest, das Architektur, Engineering und Design zusammenbringt. Kurze Impulse, gutes Essen und viel Zeit für Gespräche – ein Abend, an dem Disziplinen wechseln, nicht nur Visitenkarten.",
    anmeldung: "mailto:info@aed-stuttgart.de?subject=Anmeldung%20Sommerfest%202026",
  },
  {
    slug: "brenzkirche-fuehrung",
    titel: "Führung Brenzkirche – Bauen im Bestand",
    datum: "2026-07-24",
    uhrzeit: "17:00",
    ort: "Brenzkirche, Am Kochenhof 3, Stuttgart",
    format: "Exkursion",
    teaser: "Ein Bau mit gebrochener Geschichte: Führung durch die Brenzkirche und ihre Weißenhof-Nachbarschaft.",
    text: "Die Brenzkirche steht wie kaum ein zweiter Bau für die Umdeutungen der Stuttgarter Baugeschichte. Bei der Führung sprechen wir über Substanz, Umnutzung und den Umgang mit einem schwierigen Erbe.",
    anmeldung: "mailto:info@aed-stuttgart.de?subject=Anmeldung%20Brenzkirche",
  },
  {
    slug: "werkstattgespraech-material",
    titel: "Werkstattgespräch: Material und Verantwortung",
    datum: "2026-06-11",
    uhrzeit: "19:30",
    ort: "Geschäftsstelle aed e.V., Olgastraße 138, Stuttgart",
    format: "Werkstattgespräch",
    teaser: "Wie verändert die Frage nach Ressourcen das Entwerfen? Ein Abend zwischen Tragwerk, Produkt und Bühne.",
    text: "Drei Positionen, ein Tisch: Wir diskutieren, wie Materialentscheidungen Entwurfsprozesse verschieben – vom Tragwerk über das Produkt bis zur Szenografie.",
  },
  {
    slug: "ausstellung-junge-positionen",
    titel: "Ausstellung: Junge Positionen aus Baden-Württemberg",
    datum: "2026-05-08",
    ort: "Stuttgart",
    format: "Ausstellung",
    teaser: "Arbeiten der neuland-Preisträger:innen im öffentlichen Raum – Ausstellungsorte in der ganzen Stadt.",
    text: "Die prämierten Abschlussarbeiten des Nachwuchswettbewerbs neuland verlassen die Hochschulen und werden im Stadtraum sichtbar.",
  },
  {
    slug: "vortrag-stadt-und-klima",
    titel: "Vortrag: Stadt und Klima",
    datum: "2025-11-19",
    uhrzeit: "19:00",
    ort: "Kunstmuseum Stuttgart",
    format: "Vortrag",
    teaser: "Wie kühlt sich eine Kesselstadt? Ein Abend über Stadtklima, Freiraum und Verdichtung.",
    text: "Rückblick auf einen gut besuchten Abend über Hitzeinseln, Verdunstung und die Frage, wie viel Stadt Klimaanpassung verträgt.",
  },
  {
    slug: "exkursion-weissenhof",
    titel: "Exkursion Weißenhofsiedlung",
    datum: "2025-06-14",
    ort: "Weißenhofsiedlung, Stuttgart",
    format: "Exkursion",
    teaser: "Klassiker neu gelesen: die Weißenhofsiedlung als Labor des Wohnens.",
    text: "Ein Nachmittag zwischen Ikone und Alltag – mit Blick auf das, was von den Versprechen der Moderne geblieben ist.",
  },
];

export const eventFormate = ["Vortrag", "Exkursion", "Fest", "Ausstellung", "Werkstattgespräch"] as const;

export type Person = {
  name: string;
  rolle: string;
  statement?: string;
  link?: string;
};

export const vorstand: Person[] = [
  {
    name: "Dr. Frank Heinlein",
    rolle: "1. Vorsitzender",
    statement:
      "Der aed ist ein Ort, an dem Architektur, Engineering und Design nicht nebeneinander, sondern miteinander verhandelt werden. Genau darin liegt der Wert des Vereins.",
  },
  {
    name: "Johanna Neves Pimenta",
    rolle: "2. Vorsitzende",
    statement:
      "Gute Gestaltung entsteht im Austausch. Unsere Aufgabe ist es, diesen Austausch verlässlich zu ermöglichen – über Generationen und Disziplinen hinweg.",
  },
  {
    name: "Sara Dahme",
    rolle: "Vorstand Kommunikation",
    statement: "Sichtbarkeit ist keine Nebensache: Wer Gestaltung ernst nimmt, muss auch darüber sprechen können.",
  },
  {
    name: "Frank Seeger",
    rolle: "Vorstand Finanzen",
    statement: "Ein Verein lebt von Verlässlichkeit – auch in den Zahlen.",
  },
  {
    name: "Werner Sobek",
    rolle: "Ehrenvorsitzender",
    statement:
      "Wir brauchen eine Baukultur, die mit Ressourcen so umgeht, als wären sie endlich. Denn sie sind es.",
  },
];

export const beirat: Person[] = [
  { name: "Stefan Behnisch", rolle: "Beirat · Architektur" },
  { name: "Uli Dietzold", rolle: "Beirat · Design", statement: "Nachwuchsförderung ist die beste Investition, die ein Verein tätigen kann." },
  { name: "Susanne Groos", rolle: "Beirat · Kommunikation" },
  { name: "Petra Kiedaisch", rolle: "Beirat · Publizistik", statement: "Über Gestaltung zu publizieren heißt, sie diskutierbar zu machen." },
  { name: "Nicole Kurbos", rolle: "Beirat · Design", statement: "Im Wettbewerb sehen wir jedes Jahr, wie klar der Nachwuchs Haltung formulieren kann." },
  { name: "Peter Milla", rolle: "Beirat · Kommunikationsdesign" },
  { name: "Christine Müller", rolle: "Beirat · Engineering" },
  { name: "Jörg Olp", rolle: "Beirat · Szenografie", statement: "Räume erzählen – wenn man sie lässt." },
  { name: "Stephan Trüby", rolle: "Beirat · Architekturtheorie" },
  { name: "Andreas Uebele", rolle: "Beirat · Grafikdesign", statement: "Typografie ist Haltung in Buchstabenform." },
  { name: "Iris Enderle", rolle: "Geschäftsstelle" },
];

export const partner = [
  "Universität Stuttgart",
  "Hochschule für Technik Stuttgart",
  "ABK Stuttgart",
  "HfG Schwäbisch Gmünd",
  "Kunstmuseum Stuttgart",
  "Weißenhofmuseum",
  "BDA Baden-Württemberg",
  "Architektenkammer Baden-Württemberg",
  "Design Center Baden-Württemberg",
  "Rat für Formgebung",
  "IHK Region Stuttgart",
  "Wirtschaftsförderung Region Stuttgart",
  "Stadt Stuttgart",
  "Karl Schlecht Stiftung",
  "Wüstenrot Stiftung",
  "Deutscher Werkbund BW",
];

export const foerdermitglieder = [
  "Atelier Brückner", "Behnisch Architekten", "Werner Sobek", "studiokurbos", "PHOENIX Design",
  "Ippolito Fleitz Group", "avcommunication", "Bertron Schwarz Frey", "Blocher Partners", "Drees & Sommer",
  "Eberhard Wanderarchitekten", "Format D", "Gruppe Drei", "Haascookzemmrich", "Hänggi Design",
  "Interbrand", "Jangled Nerves", "KMS Team", "Kuhn Truninger", "LAVA",
  "Leonhardt Andrä und Partner", "Milla & Partner", "Nowakteufelknyrim", "Otto Rieger", "Pfeifer Roser Kuhlmann",
  "Projektil", "Raumkontor", "Schlaich Bergermann Partner", "Schmelzle + Partner", "Steimle Architekten",
  "Studio Sebastian Herkner", "Transsolar", "Uebele visuelle Kommunikation", "Wulf Architekten", "Zoeppritz",
  "3deluxe", "Aldinger Architekten", "Arge Bau", "Bez + Kock Architekten", "Bosch Design",
  "Braun Design", "Burkhardt Leitner", "Cheret Bozic Architekten", "Dinkelacker Werbung", "Duravit Design",
  "Eiermann Architekten", "Fischer Rüdenauer", "Gerber Architekten", "Gessler Design", "Hascher Jehle",
  "Herrmann + Bosch", "Hochtief Design", "Jung Architekturbüro", "Kauffmann Theilig & Partner", "Kienzle Design",
  "Kohler Grohe Architekten", "Lederer Ragnarsdóttir Oei", "Mahle Design", "Mayer Bährle", "Nagel Architekten",
  "Ostertag Architekten", "Peter Ippolito Studio", "Pesch Partner", "Rossmann Design", "Schaudt Architekten",
  "Scholl Architekten", "Seeger Interior", "Sieber Design", "Stefan Diez Office", "Studio Aisslinger",
  "Studio Kluge", "Thomas Herzog", "UN Studio Stuttgart", "VON M", "Wagner Design",
  "Weinbrenner Single Arabzadeh", "Wenzel + Wenzel", "Wittfoht Architekten", "Zaeske Design", "Zoll Architekten",
];

export const referenten = [
  "Stefan Behnisch", "Sebastian Herkner", "Andreas Uebele", "Werner Sobek", "Petra Kiedaisch",
  "Nicole Kurbos", "Jörg Olp", "Stephan Trüby", "Christine Müller", "Peter Milla",
  "Uli Dietzold", "Susanne Groos", "Anna Heringer", "Arno Lederer", "Bettina Götz",
  "Carla Hoffmann", "Daniel Libeskind", "Elke Delugan-Meissl", "Frank Heinlein", "Gerd Grübler",
  "Hans Drexler", "Ingo Maurer", "Jan Knikker", "Karin Schmid", "Ludwig Wappner",
  "Marc Schmidt", "Nadine Roth", "Otto Steidle", "Petra Wörner", "Robert Klanten",
  "Sara Dahme", "Thomas Auer", "Ulrike Brandi", "Verena Mörkl", "Wolfgang Riehle",
  "Yvonne Farrell", "Zvonko Turkali",
];

export const downloads = [
  { titel: "Jahresprogramm 2026", beschreibung: "Alle Veranstaltungen des Vereins im Überblick.", typ: "PDF, 2,1 MB" },
  { titel: "Flyer aed e.V.", beschreibung: "Kurzvorstellung des Vereins zum Weitergeben.", typ: "PDF, 0,8 MB" },
  { titel: "Publikation „Veranstaltungen – Austausch – Förderung“", beschreibung: "Rückblick auf 20 Jahre Vereinsarbeit.", typ: "PDF, 12 MB" },
  { titel: "aed Logo-Paket", beschreibung: "Logo in SVG, EPS und PNG inkl. Anwendungshinweisen.", typ: "ZIP, 4,3 MB" },
  { titel: "Pressekit Verein", beschreibung: "Pressetext, Bildmaterial, Ansprechpartner.", typ: "ZIP, 18 MB" },
  { titel: "Satzung aed e.V.", beschreibung: "Aktuelle Fassung der Vereinssatzung.", typ: "PDF, 0,3 MB" },
  { titel: "Beitrittsformular", beschreibung: "PDF-Fallback zum Online-Formular.", typ: "PDF, 0,2 MB" },
];

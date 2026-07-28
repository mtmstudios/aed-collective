// Inhalte aus dem Crawl von aed-stuttgart.de (Stand 28.07.2026).
// Personen, Statements, Events und Partner sind Originalinhalte der Bestands-Website.

export const kontakt = {
  name: "aed e.V.",
  strasse: "Olgastraße 138",
  plz: "70180",
  ort: "Stuttgart",
  telefon: "+49 160 8894377",
  telefonHref: "+491608894377",
  email: "info@aed-stuttgart.de",
  geschaeftsstelle: "Iris Enderle",
  zeiten: "Montag bis Freitag, 9–18 Uhr (Besuche bitte anmelden)",
};

export const eventFormate = [
  "Vortrag",
  "Führung",
  "aed Drinks",
  "jung & hungrig",
  "Fest",
  "Film",
] as const;

export type EventItem = {
  slug: string;
  titel: string;
  datum: string; // ISO
  uhrzeit?: string;
  ort: string;
  format: (typeof eventFormate)[number];
  teaser: string;
  text: string;
  anmeldung?: string;
};

export const events: EventItem[] = [
  {
    slug: "sommerfest-2026",
    titel: "aed Sommerfest – Räume für alle!",
    datum: "2026-09-17",
    uhrzeit: "18:00–22:00",
    ort: "Circuleum, Stuttgart",
    format: "Fest",
    teaser:
      "Wir feiern gemeinsam mit mätsch im Circuleum Stuttgart – Netzwerken und Austauschen in spätsommerlicher Atmosphäre.",
    text: "Unser Thema: Räume für alle! In offener, spätsommerlicher Atmosphäre laden wir zum Netzwerken und Austauschen ein. Im Fokus stehen Orte, die allen offenstehen: unentgeltlich, im Freien, ohne Hindernisse. Wir wollen diesem Thema mehr Aufmerksamkeit schenken und gemeinsam Bewusstsein schaffen – denn nur durch engeren Zusammenhalt, Begegnung und gemeinsames Wirken entsteht das Vertrauen, das unsere Gesellschaft braucht, um Verantwortung für eine gesunde Zukunft zu übernehmen.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/symposium/aed-x-maetsch-sommerfest-7483504099096298561.html",
  },
  {
    slug: "brenzkirche-iba27",
    titel: "Baustellenbesuch Brenzkirche – ein IBA'27-Projekt",
    datum: "2026-07-24",
    uhrzeit: "17:00–19:00",
    ort: "Brenzkirche, Stuttgart (bei der Weissenhofsiedlung)",
    format: "Führung",
    teaser:
      "Hinter einer mehrfach überformten Fassade verbirgt sich eines der spannendsten Umbauprojekte Stuttgarts.",
    text: "Unweit der Weissenhofsiedlung verbirgt sich hinter einer mehrfach überformten Fassade eines der spannendsten Umbauprojekte Stuttgarts: die Brenzkirche. 1933 im Stil der Neuen Sachlichkeit als offenes Gemeindehaus errichtet, wurde sie auf Druck der Nationalsozialisten traditionalistisch umgestaltet – Nachkriegsumbauten verfestigten das unharmonische Erscheinungsbild zusätzlich. Beim Baustellenbesuch erleben wir, wie das Gebäude im Rahmen der IBA'27 neu gedacht wird.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/fuehrung/baustellenbesuch-brenzkirche-ein-iba-27-projekt-748210",
  },
  {
    slug: "recycling-karle",
    titel: "Zu Besuch bei Recycling Karle",
    datum: "2026-07-22",
    uhrzeit: "19:00–21:00",
    ort: "Recycling Karle, Region Stuttgart",
    format: "Führung",
    teaser: "Baustoffe neu denken. Ressourcen neu bewerten.",
    text: "Was passiert eigentlich mit Baumaterialien, wenn ein Gebäude zurückgebaut wird? Welche Baustoffe lassen sich wiederverwenden – und wo liegen die größten Herausforderungen? Welche Trends lassen sich gerade in der Baustoffindustrie ausmachen und welche Rolle spielt Nachhaltigkeit? Diesen Fragen gehen wir beim Besuch vor Ort nach.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/firmenvortrag/recycling-nachhaltiges-bauen-ein-besuch-bei-karle",
  },
  {
    slug: "3d-druck-wohin-geht-die-reise",
    titel: "3D-Druck – wohin geht die Reise?",
    datum: "2026-07-16",
    uhrzeit: "19:00–21:00",
    ort: "Material Bank Studio, Stuttgart",
    format: "Vortrag",
    teaser:
      "Ein Abend des aed und der 3D Pioneers Challenge über additive Fertigung, neue Materialien und intelligente Technologien.",
    text: "Wie verändern additive Fertigung, neue Materialien und intelligente Technologien die Welt von Architektur, Design und Konstruktion? Diesen Fragen widmet sich dieser besondere Abend vom aed e.V. und der 3D Pioneers Challenge im Material Bank Studio Stuttgart.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/vortrag/3d-druck-wohin-geht-die-reise-7476305864866933955.html",
  },
  {
    slug: "papierkunst-preview-waiblingen",
    titel: "Zeichnung und Papierkunst – Preview für den aed",
    datum: "2026-07-14",
    uhrzeit: "17:30–20:00",
    ort: "Galerie Stihl Waiblingen / Galerie im Kameralamt",
    format: "Führung",
    teaser: "Exklusive Preview: die Entstehung zeitgenössischer Kunst und einer Ausstellung aus nächster Nähe.",
    text: "Die künstlerischen Ergebnisse der Künstlerresidenz werden vom 25. Juli bis 18. Oktober 2026 in der Galerie Stihl Waiblingen und in der Galerie im Kameralamt präsentiert. Bei einer exklusiven Preview für den aed haben wir die seltene Möglichkeit, noch vor der Vernissage die Entstehung zeitgenössischer Kunst und die Entwicklung einer Ausstellung aus nächster Nähe mitzuerleben.",
  },
  {
    slug: "gruener-bauen-geht-doch",
    titel: "Grüner bauen? Geht doch!",
    datum: "2026-07-02",
    uhrzeit: "19:00–21:00",
    ort: "Stuttgart",
    format: "Vortrag",
    teaser:
      "Stuttgarter Wissenschaftsfestival trifft Klima-Innovationsfonds: Positives aus der gebauten Umwelt.",
    text: "Klimawandel, Ressourcenschwund, explodierende Kosten – angesichts all der schlechten Nachrichten könnte man fast die Lust auf Zukunft verlieren. Muss aber nicht sein: Es gibt auch viel Positives zu berichten, auch in Stuttgart, sogar im Bereich der gebauten Umwelt. Unser Abend verbindet das Stuttgarter Wissenschaftsfestival mit einem After-Work-Ausklang, die Projekte des Stuttgarter Klima-Innovationsfonds mit einem Fokus auf Gebäude und Stadtgrün sowie die Stadtverwaltung mit dem Netzwerk des aed.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/vortrag/gruener-bauen-geht-doch-7473074872345713854.html",
  },
  {
    slug: "aed-drinks-x-ecotrii",
    titel: "aed Drinks x ecotrii",
    datum: "2026-07-01",
    uhrzeit: "18:00–21:00",
    ort: "Stuttgart",
    format: "aed Drinks",
    teaser: "Rosa Pöttinger präsentiert ihr mobiles Begrünungsmodul für urbane Räume – wir testen direkt vor Ort.",
    text: "Lust auf frische Ideen für die Stadt von morgen? Rosa Pöttinger präsentiert ihr innovatives mobiles Begrünungsmodul für urbane Räume. Der ecotrii, gefördert vom Stuttgarter Klima-Innovationsfonds, sorgt für mehr Grün, weniger Hitze und ein besseres Mikroklima in unseren Städten – nachhaltig, ressourcenschonend und wirtschaftlich.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/business-treff/aed-drinks-x-ecotrii-7473362797771901085.html",
  },
  {
    slug: "haus-des-tourismus",
    titel: "Blickfang am Marktplatz: das Haus des Tourismus",
    datum: "2026-06-23",
    uhrzeit: "18:00–20:00",
    ort: "Haus des Tourismus, Marktplatz Stuttgart",
    format: "Führung",
    teaser: "Vom Modehaus Breitling zum neuen Stadtbaustein – umgebaut von asp Architekten und Ippolito Fleitz Group.",
    text: "Wo über viele Jahre gediegene Herrenmode verkauft wurde, findet sich nun Stuttgarts neues Haus des Tourismus. Das ehemalige Modehaus Breitling wurde von den Stuttgarter Büros asp Architekten und Ippolito Fleitz Group grundlegend umgestaltet – bei weitgehendem Erhalt der historischen Bausubstanz. Transparente Fassaden und Glaswände im Inneren schaffen eine helle Atmosphäre; die neue Dachterrasse und die Rooftopbar bieten einen ungewohnten Blick auf die Innenstadt.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/fuehrung/blickfang-am-marktplatz-das-haus-des-tourismus-7470371",
  },
  {
    slug: "sammlung-amann",
    titel: "Verborgenes Juwel – die Sammlung Amann",
    datum: "2026-06-11",
    uhrzeit: "19:00–20:00",
    ort: "Galerie Sammlung Amann, Stuttgart",
    format: "Führung",
    teaser: "Unser diesjähriger Galerie-Termin: ein Projektraum für Kunst und Design zwischen Moderne und Gegenwart.",
    text: "Stuttgart gilt nicht zufällig als „Stadt der Galerien“ – mehr als 50 Ausstellungsorte bereichern die Kunstlandschaft. Grund genug für den aed, einige dieser kulturellen Hotspots näher zu betrachten. Die Galerie Sammlung Amann versteht sich als Projektraum für Kunst und Design sowie als Plattform für künstlerische Positionen – aus der eigenen Sammlung wie von Gästen. Der Projektraum vereint Positionen der Moderne und der klassischen Moderne mit zeitgenössischen Künstler:innen.",
    anmeldung: "https://eventfrog.de/de/p/kunst-ausstellungen/ausstellung/verborgenes-juwel-die-sammlung-amann-746033776669545",
  },
  {
    slug: "curious-career-club",
    titel: "The Curious Career Club – Agenturen, Talente & Perspektiven",
    datum: "2026-06-10",
    uhrzeit: "19:00–21:00",
    ort: "Stuttgart",
    format: "Vortrag",
    teaser: "Experience Design wird zum entscheidenden Faktor – ein Abend über das neue Spielfeld für Talente, Studios und Agenturen.",
    text: "Die Kreativbranche hat sich verändert und Experience Design wird zum entscheidenden Faktor – nicht nur für Marken. In einer Welt voller Content entsteht Relevanz nicht mehr allein durch Sichtbarkeit, sondern durch Verbindungen. Mit „The Smart & The Curious“ entsteht eine Plattform, die den Bereich Experience Design sichtbar macht. Gemeinsam mit dem aed wird der Abend zum „Curious Career Club“.",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/business-treff/the-curious-career-club-agenturen-talente-perspe",
  },
  {
    slug: "aed-drinks-vins",
    titel: "aed Drinks im Vins",
    datum: "2026-04-29",
    uhrzeit: "18:00–20:00",
    ort: "Vins, Stuttgart-Mitte",
    format: "aed Drinks",
    teaser: "An wechselnden Orten laden wir zum lockeren Austausch – offen für alle, Freund:innen willkommen.",
    text: "Wir wollen ins Gespräch kommen: Welche Themen interessieren euch, welche Projekte stehen an, was bewegt Stuttgart? An wechselnden Orten laden wir zum lockeren „aed Drinks“ ein. Wir starten im Herzen Stuttgarts: im Vins. Sebastian Werning betreibt nicht nur das Restaurant „Im Künstlerhaus“, sondern auch den coolsten Weinladen der Innenstadt.",
  },
  {
    slug: "groundbreaking-future",
    titel: "Groundbreaking Future – Startups der Baubranche",
    datum: "2026-04-22",
    uhrzeit: "19:00–21:00",
    ort: "Stuttgart",
    format: "Vortrag",
    teaser: "Der Abend mit den GROUNDBREAKERS: Startups stellen ihre Innovationen für das Bauen von Morgen vor.",
    text: "Nachhaltige Lösungen, die das Bauen auf den Kopf stellen und die Transformation möglich machen: Der Abend mit den GROUNDBREAKERS gibt Einblicke in die Arbeit als Accelerator, und Startups stellen ihre Innovationen für das Bauen von Morgen vor.",
    anmeldung:
      "https://eventfrog.de/de/p/wissenschaft-und-technik/groundbreaking-future-startups-der-baubranche-7447738524038",
  },
  {
    slug: "bauen-in-zeiten-des-klimawandels",
    titel: "Für eine bessere Welt: Bauen in Zeiten des Klimawandels",
    datum: "2026-04-14",
    uhrzeit: "19:00–21:00",
    ort: "Stuttgart",
    format: "Vortrag",
    teaser: "Abschluss der Reihe: Was ist möglich, was ist Best Practice – und was kann jede:r selbst tun?",
    text: "Architekt:innen und andere Planende haben eine besondere Verantwortung, wenn es um die Frage geht, wie wir unsere Gesellschaft vor den Folgen des Klimawandels schützen können. Beim Abschluss unserer Veranstaltungsreihe fragen wir: Welche Konzepte werden bereits erfolgreich umgesetzt, welche Ideen werden gerade entwickelt – und was kann (und sollte) jede:r von uns tun, um die Erde kommenden Generationen in einem besseren Zustand zu hinterlassen?",
    anmeldung:
      "https://eventfrog.de/de/p/fuehrungen-vortraege/vortrag/fuer-eine-bessere-welt-bauen-in-zeiten-des-klimawandels",
  },
  {
    slug: "e-1027-eileen-gray",
    titel: "E.1027 – Eileen Gray und das Haus am Meer",
    datum: "2026-04-08",
    uhrzeit: "20:00–22:00",
    ort: "Arthaus Kino, Stuttgart",
    format: "Film",
    teaser: "Filmabend mit Podiumsdiskussion über eine der wichtigsten Architektinnen des frühen 20. Jahrhunderts.",
    text: "Eileen Gray gehörte zu den wichtigsten Architektinnen und Designerinnen des frühen 20. Jahrhunderts. 1929 baute sie sich ein Refugium an der Côte d’Azur – E.1027, ein diskretes, avantgardistisches Meisterwerk. Der Film, den wir in Kooperation mit dem Stuttgarter Haus für Film und Medien präsentieren, erzählt von der Macht des weiblichen Ausdrucks – und dem Wunsch der Männer, ihn zu kontrollieren. Im Anschluss beleuchten wir in einer Podiumsdiskussion die Herausforderungen von Gestalterinnen damals und heute.",
    anmeldung: "https://arthaus-kino.de/hfmxarthaus/",
  },
  {
    slug: "areal-sued",
    titel: "Kreatives Stuttgart – Standortentwicklung im Bestand: Areal Süd",
    datum: "2026-03-19",
    uhrzeit: "19:00–21:00",
    ort: "Tübinger Straße, Stuttgart-Süd",
    format: "Vortrag",
    teaser: "Wie baut man einen kreativen Standort im Bestand? Über 100 Kreativschaffende rund um die Tübinger Straße.",
    text: "Rund um die Tübinger Straße arbeiten bereits über 100 Kreativschaffende aus den verschiedenen Teilbranchen der Kultur- und Kreativwirtschaft. Wie baut man einen kreativen Standort im Bestand? Wie schafft man gemeinsame Identität, Austausch und Synergien – nach dem Motto „Kochen mit dem, was im Kühlschrank ist“, mit vorhandenen Räumen, Akteur:innen, Kompetenzen und Beziehungen?",
    anmeldung:
      "https://www.eventbrite.de/e/kreatives-stuttgart-standortentwicklung-im-bestand-das-projekt-areal-sud-tickets-1984860042819",
  },
  {
    slug: "jung-und-hungrig-johannes-breuer",
    titel: "jung & hungrig spezial: zu Gast bei Johannes Breuer",
    datum: "2026-03-04",
    uhrzeit: "19:00–21:00",
    ort: "Stuttgart",
    format: "jung & hungrig",
    teaser: "Unsere Reihe für aufstrebende Studios – diesmal in Kooperation mit der Designmesse BLICKFANG.",
    text: "Stuttgart ist eine heimliche Kreativmetropole – doch neben all den Namen mit internationaler Strahlkraft haben es junge Studios umso schwerer, aufzufallen. Das ändern wir mit unserer Veranstaltungsreihe „jung & hungrig“: Mit freundlicher Unterstützung des Förderprogramms „Creative Connection“ der Stadt Stuttgart besuchen wir aufstrebende Büros – diesmal in Kooperation mit der internationalen Designmesse BLICKFANG.",
    anmeldung: "https://www.eventbrite.de/e/jung-hungrig-spezial-zu-gast-bei-johannes-breuer-tickets-1983728085103",
  },
  {
    slug: "jung-und-hungrig-haus-otto",
    titel: "jung & hungrig: Haus Otto",
    datum: "2026-02-03",
    uhrzeit: "19:00–21:00",
    ort: "Stuttgart",
    format: "jung & hungrig",
    teaser: "Wir besuchen aufstrebende Büros der Region – gefördert von „Creative Connection“ der Stadt Stuttgart.",
    text: "Stuttgart ist eine heimliche Kreativmetropole – doch neben all den Namen mit internationaler Strahlkraft haben es junge Studios umso schwerer, aufzufallen. Mit freundlicher Unterstützung des Förderprogramms „Creative Connection“ der Stadt Stuttgart besuchen wir aufstrebende Büros.",
    anmeldung: "https://www.eventbrite.de/e/jung-hungrig-haus-otto-tickets-1982455479706",
  },
  {
    slug: "zero-riehle-koeth",
    titel: "Bauen neu gedacht – ZERO.",
    datum: "2026-01-21",
    uhrzeit: "19:00–21:00",
    ort: "ZERO., Stuttgart-Möhringen",
    format: "Führung",
    teaser: "Architekturführung durch den kreislauffähigen Holz-Modulbau des Büros Riehle Köth.",
    text: "Über Nachhaltigkeit, Innovation und modulares Bauen wird viel geredet. Was aber passiert, wenn die schöne Theorie in die raue Wirklichkeit von Kosten, Termindruck und „Stand der Technik“ überführt werden muss? Mit dem Neubau „ZERO.“ des Stuttgarter Büros Riehle Köth gibt es ein überzeugendes Beispiel: Mit einer innovativen, kreislauffähigen Holz-Modulbauweise und langlebigen, wartungsarmen Energie- und Techniklösungen minimiert ZERO. seinen CO₂-Ausstoß in Herstellung und Betrieb.",
  },
];

export type Person = {
  name: string;
  rolle: string;
  statement?: string;
  link?: string;
};

// Statements: Originalzitate von den Statement-Seiten der Bestands-Website
export const vorstand: Person[] = [
  {
    name: "Dr. Frank Heinlein",
    rolle: "Erster Vorsitzender",
    statement:
      "„Die Arbeit im aed ermöglicht das Kennenlernen von und den Umgang mit zahllosen interessanten Themen und Personen. Das ehrenamtliche Engagement, das für Konzeption und Vorbereitung von 20 Veranstaltungen im Jahr erforderlich ist, ist beachtlich – es eröffnet aber einen unerschöpflichen Vorrat an Erfahrungen mit der menschlichen Kreativität, der seinesgleichen sucht.“ – Dr. Frank Heinlein studierte Geschichte in Berlin, Straßburg, Edinburgh, Freiburg und Florenz und ist seit vielen Jahren für die Unternehmenskommunikation der Werner Sobek Gruppe verantwortlich.",
  },
  {
    name: "Johanna Neves Pimenta",
    rolle: "Zweite Vorsitzende",
    statement:
      "„Kreativschaffende bauen von Berufs wegen Brücken: Der Austausch untereinander stärkt uns dabei. Mit dem aed bieten wir eine Plattform für einen offenen Dialog. Hier begegnen sich die verschiedenen Disziplinen auf Augenhöhe, unabhängig von der Karriereebene – von neuland-Newcomern bis zu Lebenswege-Legenden.“ – Johanna Neves Pimenta ist Chefredakteurin von md INTERIOR DESIGN ARCHITECTURE.",
  },
  {
    name: "Sara Dahme",
    rolle: "Vorstand Kommunikation",
    statement:
      "„Ein Leben ohne gute Gestaltung ist möglich, aber sinnlos! Ich liebe es, Menschen zusammenzubringen und einen offenen Austausch anzuregen, Ungewohntes miteinander zu verknüpfen und neue Netzwerke zu etablieren – für mich ist der aed ein echter Inkubator und der Beweis dafür, dass es im Stuttgarter Kessel nur so vor Kreativität brodelt.“ – Sara Dahme ist Kunst- und Kulturvermittlerin und freie Kuratorin.",
  },
  {
    name: "Frank Seeger",
    rolle: "Vorstand Finanzen",
    statement:
      "„Selbst für mich als Steuerberater geben die Veranstaltungen des aed immer wieder neue Einblicke in die Welt von Architektur und Design. Vor allem der Nachwuchswettbewerb aed neuland, gefördert von der Karl Schlecht Stiftung – immer ein toller Einblick in die Ideen junger Gestalter.“ – Frank Seeger ist Steuerberater mit eigener Kanzlei und hat den aed-Vorstand Finanzen 2014 übernommen.",
  },
  {
    name: "Prof. Dr. Dr. E.h. Dr. h.c. Werner Sobek",
    rolle: "Ehrenvorsitzender",
    statement:
      "„Wo sonst, wenn nicht in Stuttgart, hätten wir den aed gründen sollen? In dieser Stadt, in dieser Region, in der man eine anderswo in der Welt kaum erreichte technisch-wissenschaftliche Kompetenz vorfindet, in der führende Persönlichkeiten aus Graphik, Schmuck, Industrial Design, Automobildesign und anderen Bereichen des Gestaltens auf absolutem Spitzenniveau lehren und arbeiten.“",
  },
];

export const beirat: Person[] = [
  {
    name: "Stefan Behnisch",
    rolle: "Architekt, Behnisch Architekten",
    link: "https://behnisch.com",
    statement:
      "„An die Gründung des aed erinnere ich mich noch gut. In Stuttgart, einer Stadt vieler Architektinnen und Architekten, Designerinnen und Designer, Ingenieurinnen und Ingenieure, erschien es verwunderlich, dass nicht schon früher etwas Vergleichbares entstanden ist – eine Institution, die informiert über das, was hier geschaffen wird, und ein Forum für Austausch bietet.“",
  },
  {
    name: "Lutz Dietzold",
    rolle: "CEO, Rat für Formgebung",
    link: "https://www.gdc.de",
    statement:
      "„Der aed vernetzt auf hervorragende und einzigartige Weise die vielseitige kreative Kompetenz im Raum Stuttgart.“ – Lutz Dietzold ist seit 2002 Geschäftsführer des Rat für Formgebung und u.a. Vorsitzender der Stiftung Deutsches Design Museum.",
  },
  {
    name: "Dr. Ulrike Groos",
    rolle: "Direktorin, Kunstmuseum Stuttgart",
    link: "https://www.kunstmuseum-stuttgart.de",
    statement:
      "„Gerne führe ich seit 2010 die Kooperationen mit dem aed fort, denn spätestens seit meinem Studium gilt mein Interesse grenzüberschreitenden Projekten und interdisziplinärem Denken – und genau dafür steht der aed.“",
  },
  {
    name: "Dr. Petra Kiedaisch",
    rolle: "Geschäftsführerin, av edition",
    link: "https://www.avedition.de",
    statement:
      "„Ob Berlin, Köln oder München – in keiner anderen Metropole gibt es eine ähnliche Plattform wie den aed, der Kreative aus verschiedenen Disziplinen zusammenbringt. Genau darin liegt seine Stärke: Menschen und Kompetenzen vernetzen.“",
  },
  {
    name: "Andreas Kurbos",
    rolle: "Gründer und CEO, studiokurbos",
    link: "https://www.kurbos.com",
    statement:
      "„Der aed ist für mich eine bedeutsame Plattform und wichtiger Anlaufpunkt für Gestalter. Mit der Förderung junger Designer, Architekten und Ingenieure stellen wir die Weichen für eine nachhaltige Zukunft.“",
  },
  {
    name: "Johannes Milla",
    rolle: "Creative Director, Milla & Partner",
    link: "https://www.milla.de",
    statement:
      "„Szenografische Konzepte und Design sind der zweite Schritt. Der geht nicht ohne den ersten: Respekt vor dem Thema und Empathie für das Publikum.“",
  },
  {
    name: "Markus Müller",
    rolle: "Architekt, Präsident AKBW",
    link: "https://www.akbw.de",
    statement:
      "„Baden-Württemberg – Stuttgart als Gravitationszentrum – versammelt eine einzigartige Bandbreite innovationstreibender Kreativität. Der aed ist eine der wichtigen Austauschplattformen zwischen den Disziplinen und hilft, Transformationsprozesse im wahrsten Sinne des Wortes gut zu gestalten.“",
  },
  {
    name: "Silvia Olp",
    rolle: "Public Relations, Architecture & Design",
    statement:
      "„Der aed ist akzeptiert und wächst noch immer – die Veranstaltungen sind regelmäßig ausgebucht.“ – Silvia Olp begleitet den aed seit dem ersten öffentlichen Auftritt im Kunstmuseum Stuttgart 2004 und ist Initiatorin des Nachwuchswettbewerbs neuland.",
  },
  {
    name: "Prof. Dr. phil. Stephan Trüby",
    rolle: "Direktor IGmA, Universität Stuttgart",
    link: "https://www.igma.uni-stuttgart.de",
    statement:
      "„Architektur ist die vielleicht komplexeste Kulturtechnik, die die Menschheit hervorgebracht hat. Nirgendwo sonst fallen wirtschaftliche, technisch-wissenschaftliche, künstlerische, rechtliche, mediale, religiöse und politische Interessen so in eins wie beim Bauen.“",
  },
  {
    name: "Prof. Andreas Uebele",
    rolle: "Kommunikationsdesigner, büro uebele",
    link: "https://www.uebele.com",
    statement:
      "Andreas Uebele ist Gründungsmitglied des aed und entwickelte das Corporate Design des Vereins sowie das Erscheinungsbild der Wettbewerbsunterlagen von aed neuland. Er ist Professor für Visuelle Kommunikation und Mitglied im Type Directors Club und Art Directors Club New York.",
  },
];

// Die 16 Kooperationspartner aus dem Footer der Bestands-Website
export const partner = [
  "Architektenkammer Baden-Württemberg",
  "Art Directors Club für Deutschland",
  "Blickfang Designmesse",
  "BDA Wechselraum",
  "DDC Deutscher Design Club",
  "Design Center Baden-Württemberg",
  "Design Offices Stuttgart",
  "Hospitalhof",
  "IBA’27 Friends",
  "Kunstmuseum Stuttgart",
  "Landesmuseum Baden-Württemberg",
  "Rat für Formgebung",
  "Staatsgalerie Stuttgart",
  "Stadtpalais Stuttgart",
  "VDID Stuttgart",
  "Württembergischer Kunstverein",
];

// Echte Dateien der Bestands-Website (Jimdo-CDN – vor Kündigung lokal sichern!)
export const downloads = [
  {
    titel: "aed Programm 2. Halbjahr 2026",
    beschreibung: "Alle Veranstaltungen von Juli bis Dezember 2026 im Überblick.",
    typ: "PDF, 0,7 MB",
    url: "https://www.aed-stuttgart.de/app/download/8594142763/2026_02_aed.pdf",
  },
  {
    titel: "aed Programm 1. Halbjahr 2026",
    beschreibung: "Das Programm von Januar bis Juni 2026.",
    typ: "PDF, 0,9 MB",
    url: "https://www.aed-stuttgart.de/app/download/8594138863/2026_01_aed_Programm.pdf",
  },
  {
    titel: "aed Beitrittserklärung",
    beschreibung: "Mitglied werden per Formular – ausfüllen und an die Geschäftsstelle senden.",
    typ: "PDF, 0,4 MB",
    url: "https://www.aed-stuttgart.de/app/download/8616515663/aed_Mitglied+werden+%282025%29.pdf",
  },
  {
    titel: "aed Info-Flyer (DE + EN)",
    beschreibung: "Kurzvorstellung des Vereins zum Weitergeben.",
    typ: "PDF, 5,5 MB",
    url: "https://www.aed-stuttgart.de/app/download/8058920663/aed_Flyer+%282025%29.pdf",
  },
  {
    titel: "aed Publikation „12 Jahre aed“",
    beschreibung: "Rückblick auf zwölf Jahre Vereinsarbeit.",
    typ: "PDF, 15,2 MB",
    url: "https://www.aed-stuttgart.de/app/download/7933351963/aed_Buch_12_Jahre.pdf",
  },
  {
    titel: "aed Logo",
    beschreibung: "Das Vereinslogo für Presse und Partner.",
    typ: "JPG, 32 KB",
    url: "https://www.aed-stuttgart.de/app/download/7925456963/aed_Logo.jpg",
  },
];

/**
 * Zusammenfassung einer Einreichung als Fließtext für die Mails.
 *
 * Das alte Jotform hat den Einreichenden ihre Bewerbung vollständig
 * zurückgeschickt. Das bleibt so: Wer einreicht, hat damit schwarz auf weiß,
 * was angekommen ist, und die Geschäftsstelle sieht den Inhalt, ohne sich
 * anmelden zu müssen.
 */

import { alterAmSchluss } from "@/config/neuland-einreichung";

type Datei = { path?: string; name?: string; size?: number };

export type EinreichungAngaben = Record<string, unknown>;

function text(row: EinreichungAngaben, feld: string): string {
  const wert = row[feld];
  return typeof wert === "string" ? wert.trim() : "";
}

function dateien(row: EinreichungAngaben): string[] {
  const titelbild = row["titelbild"] as Datei | null | undefined;
  const detailfotos = (row["detailfotos"] as Datei[] | null | undefined) ?? [];
  const namen: string[] = [];
  if (titelbild?.name) namen.push(`${titelbild.name} (Titelbild)`);
  for (const foto of detailfotos) if (foto?.name) namen.push(foto.name);
  return namen;
}

/**
 * Geburtsdatum in deutscher Schreibweise, dazu das Alter am Einsendeschluss –
 * damit die Geschäftsstelle die Teilnahmeberechtigung ohne Nachrechnen sieht.
 */
function geburtsdatumMitAlter(row: EinreichungAngaben): string {
  const roh = text(row, "geburtsdatum").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(roh)) return "";
  const [jahr, monat, tag] = roh.split("-");
  const alter = alterAmSchluss(roh);
  const deutsch = `${tag}.${monat}.${jahr}`;
  return alter === null ? deutsch : `${deutsch} (${alter} Jahre zum Einsendeschluss)`;
}

/** Ein Abschnitt mit Überschrift; leere Felder werden weggelassen. */
function abschnitt(titel: string, zeilen: Array<[string, string]>): string[] {
  const gefuellt = zeilen.filter(([, wert]) => wert);
  if (gefuellt.length === 0) return [];
  return [
    titel,
    "".padEnd(titel.length, "-"),
    ...gefuellt.map(([name, wert]) => `${name}: ${wert}`),
    "",
  ];
}

/** Mehrzeilige Felder stehen unter ihrer Überschrift, nicht dahinter. */
function block(titel: string, inhalt: string): string[] {
  if (!inhalt) return [];
  return [titel, "".padEnd(titel.length, "-"), inhalt, ""];
}

export function fasseZusammen(row: EinreichungAngaben): string {
  const name = [text(row, "vorname"), text(row, "nachname")].filter(Boolean).join(" ");
  const anhaenge = dateien(row);

  return [
    ...abschnitt("Einreichung", [
      ["Nummer", text(row, "einreichungs_id")],
      ["Kategorie", text(row, "kategorie")],
      ["Projekttitel", text(row, "projekttitel")],
    ]),
    ...abschnitt("Kontakt", [
      ["Name", name],
      ["E-Mail", text(row, "email")],
      ["Geburtsdatum", geburtsdatumMitAlter(row)],
      ["Telefon", text(row, "telefon")],
      ["Institution", text(row, "institution")],
    ]),
    ...block("Kurzbeschreibung", text(row, "kurzbeschreibung")),
    ...block("Idee", text(row, "idee")),
    ...block("Umsetzung", text(row, "umsetzung")),
    ...block("Nutzen", text(row, "nutzen")),
    ...block("Nachhaltigkeit", text(row, "nachhaltigkeit")),
    ...abschnitt("Video", [["Link", text(row, "video_link")]]),
    ...(anhaenge.length > 0
      ? ["Bilder", "------", ...anhaenge.map((datei) => `- ${datei}`), ""]
      : []),
  ]
    .join("\n")
    .trimEnd();
}

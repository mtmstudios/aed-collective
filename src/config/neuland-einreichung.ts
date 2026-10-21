// Zentrale Konfiguration für das neuland-2027-Einreichungsformular.
// Bewerbungsschluss hier ändern (ISO-Zeitstempel, Zeitzone Berlin = +02:00 / +01:00).
// Der 31.10.2026 ist der Starttermin der Seite, nicht der Einsendeschluss –
// ausgeschrieben ist der Wettbewerb bis Ende März 2027 (Sommerzeit, daher +02:00).
export const BEWERBUNGSSCHLUSS = "2027-03-31T23:59:59+02:00";

export const KATEGORIEN = [
  "Architecture + Engineering",
  "Exhibition Design + Interior Design",
  "Product Design",
  "Communication Design",
  "Interaction Design",
] as const;

/**
 * Teilnahmeberechtigt ist, wer zum Einsendeschluss nicht älter als 28 Jahre
 * ist (Teilnahmebedingungen §9). Entscheidend ist der Stichtag, nicht der Tag
 * der Einreichung – wer im Februar einreicht und im März 29 wird, ist raus.
 */
export const MAX_ALTER = 28;

/** Jahr, Monat, Tag des Einsendeschlusses – ohne Zeitzonen-Umwege. */
function schlussDatum(): [number, number, number] {
  const [jahr, monat, tag] = BEWERBUNGSSCHLUSS.slice(0, 10).split("-").map(Number);
  return [jahr!, monat!, tag!];
}

/**
 * Vollendete Lebensjahre am Einsendeschluss.
 * Erwartet ein Datum in der Form JJJJ-MM-TT, wie es das Formularfeld liefert.
 * Gibt null zurück, wenn das Datum unbrauchbar ist.
 */
export function alterAmSchluss(geburtsdatum: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(geburtsdatum)) return null;
  const [gJahr, gMonat, gTag] = geburtsdatum.split("-").map(Number) as [number, number, number];
  if (gMonat < 1 || gMonat > 12 || gTag < 1 || gTag > 31) return null;

  const [sJahr, sMonat, sTag] = schlussDatum();
  let alter = sJahr - gJahr;
  if (sMonat < gMonat || (sMonat === gMonat && sTag < gTag)) alter -= 1;
  return alter;
}

/**
 * Prüft das Geburtsdatum und gibt im Fehlerfall den Satz zurück, der im
 * Formular erscheint – sonst null.
 */
export function pruefeGeburtsdatum(geburtsdatum: string): string | null {
  const alter = alterAmSchluss(geburtsdatum);
  if (alter === null) return "Bitte ein gültiges Geburtsdatum angeben.";
  if (alter < 10) return "Bitte das Geburtsdatum prüfen.";
  if (alter > MAX_ALTER) {
    return `Teilnahmeberechtigt ist, wer zum Einsendeschluss höchstens ${MAX_ALTER} Jahre alt ist. Nach diesem Geburtsdatum wären es ${alter}.`;
  }
  return null;
}

export const MAX_DETAILFOTOS = 4;
export const MAX_DATEIGROESSE_MB = 15;
export const ERLAUBTE_TYPEN = ["image/jpeg", "image/png"];

export const LIMITS = {
  kurzbeschreibung: 300,
  idee: 500,
  umsetzung: 500,
  nutzen: 400,
  nachhaltigkeit: 400,
} as const;

export function istGeschlossen(jetzt: Date = new Date()) {
  return jetzt.getTime() > new Date(BEWERBUNGSSCHLUSS).getTime();
}

export function schlussFormatiert() {
  return new Date(BEWERBUNGSSCHLUSS).toLocaleString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

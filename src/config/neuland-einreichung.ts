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

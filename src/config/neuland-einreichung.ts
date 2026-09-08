// Zentrale Konfiguration für das neuland-2027-Einreichungsformular.
// Bewerbungsschluss hier ändern (ISO-Zeitstempel, Zeitzone Berlin = +02:00 / +01:00).
export const BEWERBUNGSSCHLUSS = "2026-10-31T23:59:59+01:00";

export const KATEGORIEN = ["Kategorie A", "Kategorie B", "Kategorie C"] as const;

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

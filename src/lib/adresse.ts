/**
 * Die öffentliche Adresse der Seite – für Angaben, die vollständig sein müssen.
 *
 * Open Graph verlangt bei og:url und og:image eine vollständige Adresse.
 * Relative Pfade lösen die Dienste nicht auf: LinkedIn, Facebook und WhatsApp
 * zeigen dann gar kein Vorschaubild. Das betraf bisher jede Veranstaltungs-
 * und jede Projektseite, zusammen rund 200 Seiten.
 *
 * Der Wert steht bewusst fest und kommt nicht aus der Umgebung: Diese Datei
 * landet auch im Browser-Bündel, und dort gibt es kein process.env. Die
 * serverseitige Entsprechung mit SITE_URL steht in lib/umleitungen.ts.
 */
export const HAUPTADRESSE = "https://www.aed-stuttgart.de";

/**
 * Macht aus einem Pfad eine vollständige Adresse. Vollständiges bleibt, wie es ist.
 *
 * Umlaute werden dabei prozentkodiert: Viele Projekttitel tragen welche
 * („kunstmühle", „drapé"), und in einer Adresse haben Zeichen jenseits von
 * ASCII nichts verloren. Browser biegen das beim Anklicken zurecht,
 * Sitemap-Prüfer und die Vorschau-Dienste der sozialen Netze nicht.
 */
export function absolut(pfad: string): string {
  const voll = /^https?:\/\//i.test(pfad)
    ? pfad
    : `${HAUPTADRESSE}${pfad.startsWith("/") ? "" : "/"}${pfad}`;
  // encodeURI lässt bereits kodierte Anteile (%C3%BC) unangetastet.
  return encodeURI(voll);
}

/**
 * Zentrale Fotonachweise.
 * Schlüssel = Bildpfad (wie in bilder.ts), Wert = "Name Fotograf / Stadt".
 * Nur Bilder mit Eintrag zeigen einen Nachweis an – ohne Eintrag bleibt das Bild unverändert.
 *
 * Beispiel:
 *   "/bilder/event/sammlung-amann.webp": "Anna Muster / Stuttgart",
 */
export const bildnachweise: Record<string, string> = {};

/** Liefert den Nachweis-Text zu einem Bildpfad, sonst undefined. */
export function bildnachweis(src?: string): string | undefined {
  if (!src) return undefined;
  return bildnachweise[src];
}

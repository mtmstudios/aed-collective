import { createServerFn } from "@tanstack/react-start";

/**
 * Liefert dem öffentlichen Teil der Website zwei Dinge aus dem Bildverzeichnis:
 *
 * 1. die Fotonachweise – was dort als Urheber:in eingetragen ist, erscheint
 *    als Bildunterschrift
 * 2. die Liste der Bilder, deren Rechte noch nicht geklärt sind – die werden
 *    auf der Seite durch das aed-Logo ersetzt, bis die Freigabe vorliegt
 *
 * Gepflegt wird dadurch nur an einer Stelle.
 */

type Nachweise = Record<string, string>;
export type Bildfreigaben = { nachweise: Nachweise; gesperrt: string[] };

// Die Angaben ändern sich selten – ein kurzer Zwischenspeicher spart
// eine Datenbankabfrage bei jedem Seitenaufruf.
const GUELTIG_MS = 60_000;
let zwischenspeicher: { stand: number; werte: Bildfreigaben } | null = null;
let fehlerGemeldet = false;

const LEER: Bildfreigaben = { nachweise: {}, gesperrt: [] };

export const ladeBildnachweise = createServerFn({ method: "GET" }).handler(
  async (): Promise<Bildfreigaben> => {
    if (zwischenspeicher && Date.now() - zwischenspeicher.stand < GUELTIG_MS) {
      return zwischenspeicher.werte;
    }

    try {
      const { abfrage } = await import("@/lib/db.server");
      const data = await abfrage<{ pfad: string; urheber: string | null; status: string }>(
        `SELECT pfad, urheber, status FROM bildrechte`,
      );

      const nachweise: Nachweise = {};
      const gesperrt: string[] = [];

      for (const zeile of data) {
        // Im Verzeichnis steht "public/bilder/…", im Browser "/bilder/…"
        const url = zeile.pfad.replace(/^public/, "");
        const name = (zeile.urheber ?? "").trim();
        if (name) nachweise[url] = name;
        if (zeile.status === "ungeklaert" || zeile.status === "nicht-verwendbar") {
          gesperrt.push(url);
        }
      }

      const werte = { nachweise, gesperrt };
      zwischenspeicher = { stand: Date.now(), werte };
      return werte;
    } catch (fehler) {
      // Ohne Datenbank bleibt die Seite benutzbar. Dann werden auch keine
      // Bilder gesperrt – eine leere Seite wäre das schlechtere Ergebnis.
      if (!fehlerGemeldet) {
        console.error("[Bildnachweise] konnten nicht geladen werden:", fehler);
        fehlerGemeldet = true;
      }
      return zwischenspeicher?.werte ?? LEER;
    }
  },
);

import { createServerFn } from "@tanstack/react-start";

/**
 * Liefert die Fotonachweise für die öffentliche Website.
 * Quelle ist das Bildverzeichnis: Was dort als Urheber:in eingetragen ist,
 * erscheint als Bildunterschrift. Gepflegt wird also nur an einer Stelle.
 */

type Nachweise = Record<string, string>;

// Die Angaben ändern sich selten – ein kurzer Zwischenspeicher spart
// eine Datenbankabfrage bei jedem Seitenaufruf.
const GUELTIG_MS = 60_000;
let zwischenspeicher: { stand: number; werte: Nachweise } | null = null;
let fehlerGemeldet = false;

export const ladeBildnachweise = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ nachweise: Nachweise }> => {
    if (zwischenspeicher && Date.now() - zwischenspeicher.stand < GUELTIG_MS) {
      return { nachweise: zwischenspeicher.werte };
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("bildrechte")
        .select("pfad, urheber")
        .neq("urheber", "");
      if (error) throw new Error(error.message);

      const werte: Nachweise = {};
      for (const zeile of data ?? []) {
        const name = (zeile.urheber ?? "").trim();
        if (!name) continue;
        // Im Verzeichnis steht "public/bilder/…", im Browser "/bilder/…"
        werte[zeile.pfad.replace(/^public/, "")] = name;
      }

      zwischenspeicher = { stand: Date.now(), werte };
      return { nachweise: werte };
    } catch (fehler) {
      // Ohne Datenbank bleibt die Seite benutzbar, nur ohne Nachweise.
      // Einmal melden genügt, sonst steht es bei jedem Seitenaufruf im Log.
      if (!fehlerGemeldet) {
        console.error("[Bildnachweise] konnten nicht geladen werden:", fehler);
        fehlerGemeldet = true;
      }
      return { nachweise: zwischenspeicher?.werte ?? {} };
    }
  },
);

import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ERLAUBTE_TYPEN, MAX_DATEIGROESSE_MB, istGeschlossen } from "@/config/neuland-einreichung";

/**
 * Nimmt die Bilder einer Einreichung entgegen.
 *
 * Der Browser schickte sie früher unmittelbar an den Speicher von Supabase.
 * Jetzt laufen sie über den eigenen Server und landen in der Dateiablage.
 * Zurück kommt der gespeicherte Name, der dann in der Einreichung steht.
 */
export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const antwort = (inhalt: unknown, status = 200) =>
          new Response(JSON.stringify(inhalt), {
            status,
            headers: { "Content-Type": "application/json" },
          });

        if (istGeschlossen()) {
          return antwort({ fehler: "Der Bewerbungsschluss für neuland 2027 ist erreicht." }, 403);
        }

        let formular: FormData;
        try {
          formular = await request.formData();
        } catch {
          return antwort({ fehler: "Die Datei konnte nicht gelesen werden." }, 400);
        }

        const datei = formular.get("datei");
        if (!(datei instanceof File)) {
          return antwort({ fehler: "Es wurde keine Datei übertragen." }, 400);
        }
        if (!ERLAUBTE_TYPEN.includes(datei.type)) {
          return antwort({ fehler: `${datei.name}: nur JPG oder PNG erlaubt.` }, 415);
        }
        if (datei.size > MAX_DATEIGROESSE_MB * 1024 * 1024) {
          return antwort({ fehler: `${datei.name}: größer als ${MAX_DATEIGROESSE_MB} MB.` }, 413);
        }

        const { neuerDateiname, speichereDatei } = await import("@/lib/dateien.server");
        try {
          const pfad = neuerDateiname(datei.name);
          await speichereDatei(pfad, Buffer.from(await datei.arrayBuffer()));
          return antwort({ path: pfad, name: datei.name, size: datei.size });
        } catch (fehler) {
          console.error("[Upload] fehlgeschlagen:", fehler);
          return antwort({ fehler: "Die Datei konnte nicht gespeichert werden." }, 500);
        }
      },
    },
  },
});

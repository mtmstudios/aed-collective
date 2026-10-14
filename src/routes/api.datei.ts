import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Liefert eine hochgeladene Datei aus – nur mit gültigem, signiertem Link.
 * Die Links erzeugt der Jurybereich und sie laufen nach einer Stunde ab.
 */
export const Route = createFileRoute("/api/datei")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { leseDatei, linkGueltig } = await import("@/lib/dateien.server");

        const parameter = new URL(request.url).searchParams;
        const pfad = parameter.get("p") ?? "";
        const ablauf = parameter.get("exp") ?? "";
        const sig = parameter.get("sig") ?? "";

        if (!pfad || !linkGueltig(pfad, ablauf, sig)) {
          return new Response("Der Link ist abgelaufen oder ungültig.", { status: 403 });
        }

        const datei = await leseDatei(pfad);
        if (!datei) return new Response("Datei nicht gefunden.", { status: 404 });

        return new Response(new Uint8Array(datei.daten), {
          headers: {
            "Content-Type": datei.typ,
            "Content-Length": String(datei.daten.byteLength),
            // Der Link ist ohnehin kurzlebig; zwischengespeichert wird nur im Browser.
            "Cache-Control": "private, max-age=600",
          },
        });
      },
    },
  },
});

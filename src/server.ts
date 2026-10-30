import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { umleitung } from "./lib/umleitungen";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Einmalige Prüfung der Umgebung beim ersten Aufruf.
 *
 * Fehlende oder zu kurze Werte fallen sonst erst im Betrieb auf – und zwar als
 * Fehler 500 auf jeder Seite, ohne erkennbaren Grund.
 */
let umgebungGeprueft = false;
function pruefeUmgebung(): void {
  if (umgebungGeprueft) return;
  umgebungGeprueft = true;

  const geheimnis = process.env["SESSION_SECRET"] ?? "";
  if (geheimnis.length < 32) {
    console.error(
      geheimnis
        ? `[Start] SESSION_SECRET ist nur ${geheimnis.length} Zeichen lang. Verlangt sind mindestens 32 – sonst schlägt jede Seite mit Fehler 500 fehl.`
        : "[Start] SESSION_SECRET fehlt. Ohne diesen Wert lässt sich keine Sitzung lesen und jede Seite schlägt mit Fehler 500 fehl.",
    );
  }
  if (!process.env["SITE_PASSWORD"]) {
    console.error(
      "[Start] SITE_PASSWORD fehlt. Bildverzeichnis, Jurybereich und die signierten Bildlinks funktionieren damit nicht.",
    );
  }
  // Ob die Seite hinter der Passwortsperre liegt, ist beim Start das
  // Wichtigste – siehe lib/gate.functions.ts.
  const oeffentlich = ["1", "true", "ja"].includes(
    (process.env["SITE_OEFFENTLICH"] ?? "").trim().toLowerCase(),
  );
  console.log(
    oeffentlich
      ? "[Start] Die Seite ist öffentlich. Keine Passwortsperre."
      : "[Start] Die Seite liegt hinter der Passwortsperre. Zum Freischalten SITE_OEFFENTLICH=1 setzen.",
  );
  // Die Zugangsdaten stehen entweder in DATABASE_URL oder einzeln in den
  // PG*-Variablen – siehe lib/db.server.ts.
  if (!process.env["DATABASE_URL"] && !(process.env["PGHOST"] && process.env["PGUSER"])) {
    console.error(
      "[Start] Zugangsdaten zur Datenbank fehlen. Die Seite läuft, zeigt aber keine Daten aus der Datenbank.",
    );
  }

  // Welcher Mailweg greift, steht im Log – sonst sucht man im Zweifel lange,
  // warum eine Bestätigung nicht ankommt. Siehe lib/mail.server.ts.
  const perApp = Boolean(
    process.env["MS_TENANT_ID"] && process.env["MS_CLIENT_ID"] && process.env["MS_CLIENT_SECRET"],
  );
  const perSmtp = Boolean(process.env["SMTP_HOST"] && process.env["SMTP_USER"]);
  if (!process.env["MAIL_VON"] || (!perApp && !perSmtp)) {
    console.error(
      "[Start] Kein Mailversand eingerichtet. Bewerbungen werden gespeichert, aber weder bestätigt noch gemeldet.",
    );
  } else {
    console.log(
      `[Start] Mailversand über ${perApp ? "Microsoft 365 (App-Identität)" : "SMTP mit Benutzername und Passwort"}.`,
    );
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    pruefeUmgebung();

    try {
      // Alte Adressen der beiden Vorgängerseiten dauerhaft weiterleiten,
      // bevor die Anwendung überhaupt rendert.
      const weiter = umleitung(request);
      if (weiter) return weiter;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

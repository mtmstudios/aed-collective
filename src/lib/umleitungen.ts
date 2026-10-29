/**
 * Umleitungen beim Domainumzug.
 *
 * Nach dem Zusammenführen beider Websites zeigen drei Namen auf denselben
 * Server. Damit die Platzierungen bei Suchmaschinen und alte Links nicht
 * verloren gehen, beantwortet die Anwendung sie dauerhaft (301):
 *
 *   aed-neuland.de/<alte Seite>   →  www.aed-stuttgart.de/neuland/...
 *   aed-stuttgart.de/<beliebig>   →  www.aed-stuttgart.de/<beliebig>
 *
 * Die alten Adressen stammen aus dem Crawl vom 28.07.2026
 * (AED Relaunch/02-crawl-aed-neuland.md).
 */

/** Zieladresse der zusammengeführten Website. */
export const HAUPTDOMAIN = (process.env["SITE_URL"] ?? "https://www.aed-stuttgart.de").replace(
  /\/$/,
  "",
);

const NEULAND_HOSTS = new Set(["aed-neuland.de", "www.aed-neuland.de"]);
const HAUPT_HOST_OHNE_WWW = "aed-stuttgart.de";

/**
 * Alte Seiten von aed-neuland.de und ihr neues Ziel.
 * Was hier nicht steht, landet auf der Übersicht /neuland.
 */
export const ALT_PFADE: Record<string, string> = {
  "/": "/neuland",
  "/home": "/neuland",
  "/about": "/neuland/wettbewerb",
  "/neuland": "/neuland/wettbewerb",
  "/foerderer": "/neuland/wettbewerb",
  "/jury": "/neuland/jury",
  "/presse": "/neuland/presse",
  "/kontakt": "/kontakt",
  "/newsletter": "/neuland",
  "/neuland/gewinner-2019": "/neuland/gewinner/2019",
  "/neuland/gewinner-innen-2021": "/neuland/gewinner/2021",
  "/neuland-1/gewinner-innen-2021": "/neuland/gewinner/2021",
  "/neuland/gewinner-innen-2023": "/neuland/gewinner/2023",
  "/neuland/gewinner-innen-2025": "/neuland/gewinner/2025",
  "/neuland/gewinner-innen-2023/impressionen-der-jury-2023": "/neuland/jury-2025",
  "/neuland/impressionen-der-jury-2025": "/neuland/jury-2025",
  "/neuland/impressionen-der-jury-2025/teilnahme-bedingungen-2025": "/neuland/teilnahme",
};

/** Schneidet den abschließenden Schrägstrich ab, "/" bleibt "/". */
function normalisiere(pfad: string): string {
  const ohne = pfad.replace(/\/+$/, "");
  return ohne === "" ? "/" : ohne.toLowerCase();
}

/**
 * Liefert die Antwort mit der Weiterleitung – oder null, wenn die Anfrage
 * ganz gewöhnlich bearbeitet werden soll. Unbekannte Hosts (localhost, die
 * Vorschau, eine spätere Adresse) bleiben unberührt.
 */
export function umleitung(request: Request): Response | null {
  let url: URL;
  try {
    url = new URL(request.url);
  } catch {
    return null;
  }

  const host = (request.headers.get("host") ?? url.host).toLowerCase().split(":")[0];
  const pfad = normalisiere(url.pathname);

  if (NEULAND_HOSTS.has(host)) {
    return dauerhaft(`${HAUPTDOMAIN}${ALT_PFADE[pfad] ?? "/neuland"}`);
  }

  if (host === HAUPT_HOST_OHNE_WWW) {
    return dauerhaft(`${HAUPTDOMAIN}${url.pathname}${url.search}`);
  }

  // Alte neuland-Adressen, die auf der Hauptdomain aufgerufen werden.
  const ziel = ALT_PFADE[pfad];
  if (ziel && ziel !== pfad && pfad !== "/" && pfad !== "/kontakt" && pfad !== "/neuland") {
    return dauerhaft(ziel);
  }

  return null;
}

function dauerhaft(ziel: string): Response {
  return new Response(null, {
    status: 301,
    headers: { Location: ziel, "Cache-Control": "public, max-age=3600" },
  });
}

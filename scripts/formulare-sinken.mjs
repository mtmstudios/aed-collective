/**
 * Hilfsdienste für den Prüflauf der Formulare: ein nachgebautes Mailchimp und
 * ein SMTP-Empfänger. Beide schreiben auf, was bei ihnen ankommt.
 *
 *   node scripts/formulare-sinken.mjs
 *
 * Dann die Anwendung dagegen starten:
 *   MAILCHIMP_API_KEY=pruef-us00 MAILCHIMP_LIST_ID=liste1 \
 *   MAILCHIMP_BASIS_URL=http://127.0.0.1:55435 \
 *   SMTP_HOST=127.0.0.1 SMTP_PORT=55436 SMTP_USER=a SMTP_PASS=b \
 *   MAIL_VON="aed <aed@example.org>" MAIL_AN_VEREIN=verein@example.org \
 *   node .output/server/index.mjs
 */
import { createServer as createHttpServer } from "node:http";
import { createServer as createTcpServer } from "node:net";

const MAILCHIMP_PORT = 55435;
const SMTP_PORT = 55436;

/* ---------- Mailchimp ---------- */

createHttpServer((anfrage, antwort) => {
  if (anfrage.method !== "POST") {
    antwort.writeHead(404).end();
    return;
  }
  let roh = "";
  anfrage.on("data", (teil) => (roh += teil));
  anfrage.on("end", () => {
    const inhalt = JSON.parse(roh || "{}");
    const angemeldet = Boolean(anfrage.headers.authorization?.startsWith("Basic "));
    console.log(
      `[mailchimp] ${anfrage.url} angemeldet=${angemeldet} ` +
        `adresse=${inhalt.email_address} status=${inhalt.status} ` +
        `vorname=${inhalt.merge_fields?.FNAME} nachname=${inhalt.merge_fields?.LNAME} ` +
        `marken=${JSON.stringify(inhalt.tags ?? [])}`,
    );

    // Eine Adresse spielt den Fall "steht schon in der Liste".
    if (inhalt.email_address === "doppelt@example.org") {
      antwort.writeHead(400, { "Content-Type": "application/json" });
      antwort.end(JSON.stringify({ title: "Member Exists" }));
      return;
    }
    antwort.writeHead(200, { "Content-Type": "application/json" });
    antwort.end(JSON.stringify({ id: "abc", status: inhalt.status }));
  });
}).listen(MAILCHIMP_PORT, "127.0.0.1", () =>
  console.log(`Mailchimp-Nachbau auf ${MAILCHIMP_PORT}`),
);

/* ---------- SMTP ---------- */

createTcpServer((verbindung) => {
  let puffer = "";
  let imText = false;
  let empfaenger = "";
  let betreff = "";

  verbindung.write("220 pruefserver bereit\r\n");

  verbindung.on("data", (teil) => {
    puffer += teil.toString("utf8");

    if (imText) {
      const betreffZeile = puffer.match(/^Subject: (.*)$/m);
      if (betreffZeile && !betreff) betreff = betreffZeile[1];
      if (puffer.includes("\r\n.\r\n")) {
        console.log(`[smtp] an=${empfaenger} betreff=${decodeBetreff(betreff)}`);
        imText = false;
        puffer = "";
        betreff = "";
        verbindung.write("250 angenommen\r\n");
      }
      return;
    }

    for (const zeile of puffer.split("\r\n").filter(Boolean)) {
      const befehl = zeile.toUpperCase();
      if (befehl.startsWith("EHLO") || befehl.startsWith("HELO")) {
        // Ohne AUTH-Angebot verzichtet der Versender auf die Anmeldung.
        verbindung.write("250-pruefserver\r\n250 SIZE 20971520\r\n");
      } else if (befehl.startsWith("MAIL FROM")) {
        verbindung.write("250 ok\r\n");
      } else if (befehl.startsWith("RCPT TO")) {
        empfaenger = zeile.replace(/.*<([^>]*)>.*/, "$1");
        verbindung.write("250 ok\r\n");
      } else if (befehl.startsWith("DATA")) {
        imText = true;
        verbindung.write("354 weiter\r\n");
      } else if (befehl.startsWith("QUIT")) {
        verbindung.write("221 tschuess\r\n");
        verbindung.end();
      } else if (befehl.startsWith("RSET") || befehl.startsWith("NOOP")) {
        verbindung.write("250 ok\r\n");
      }
    }
    if (!imText) puffer = "";
  });

  verbindung.on("error", () => {});
}).listen(SMTP_PORT, "127.0.0.1", () => console.log(`SMTP-Empfänger auf ${SMTP_PORT}`));

/** Betreffzeilen kommen bei Umlauten in kodierter Form an. */
function decodeBetreff(wert) {
  const treffer = wert.match(/=\?UTF-8\?B\?(.+?)\?=/i);
  return treffer ? Buffer.from(treffer[1], "base64").toString("utf8") : wert;
}

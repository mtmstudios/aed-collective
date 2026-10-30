import { createTransport } from "nodemailer";

/**
 * Mailversand über ein Postfach des Vereins.
 *
 * Zwei Wege, in dieser Reihenfolge:
 *
 * 1. Microsoft 365 über eine App-Identität (empfohlen)
 *
 *      MS_TENANT_ID      Verzeichnis-ID des aed-Tenants
 *      MS_CLIENT_ID      Anwendungs-ID der registrierten App
 *      MS_CLIENT_SECRET  Geheimnis dieser App
 *      MAIL_VON          Absender, z. B. "aed neuland <neuland@aed-stuttgart.de>"
 *
 *    Die App meldet sich selbst an, ohne Benutzerkonto und ohne Passwort.
 *    Microsoft schaltet die Anmeldung per Benutzername und Passwort für den
 *    Mailversand Ende 2026 ab; dieser Weg bleibt davon unberührt.
 *
 * 2. SMTP mit Benutzername und Passwort (Rückfall)
 *
 *      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_VON
 *
 * Gemeinsam:
 *
 *      MAIL_AN_VEREIN    Empfänger der Benachrichtigung
 *
 * Ist nichts davon gesetzt, wird nichts verschickt und einmal im Log vermerkt –
 * die Einreichung selbst darf daran nie scheitern.
 */

let hinweisGezeigt = false;

/** Holt die reine Adresse aus "Name <adresse@example.com>". */
function nurAdresse(von: string): string {
  const treffer = von.match(/<([^>]+)>/);
  return (treffer?.[1] ?? von).trim();
}

function graphKonfiguration() {
  const tenant = process.env["MS_TENANT_ID"];
  const client = process.env["MS_CLIENT_ID"];
  const geheimnis = process.env["MS_CLIENT_SECRET"];
  const von = process.env["MAIL_VON"];
  if (!tenant || !client || !geheimnis || !von) return null;
  return { tenant, client, geheimnis, von, absender: nurAdresse(von) };
}

function smtpKonfiguration() {
  const host = process.env["SMTP_HOST"];
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  const von = process.env["MAIL_VON"];
  if (!host || !user || !pass || !von) return null;
  return { host, port: Number(process.env["SMTP_PORT"] ?? 587), user, pass, von };
}

/**
 * Zugangstoken von Microsoft, eine knappe Stunde gültig.
 * Wird zwischengespeichert, damit nicht jede Mail eine Anmeldung auslöst.
 */
let token: { wert: string; gueltigBis: number } | null = null;

async function holeToken(
  konf: NonNullable<ReturnType<typeof graphKonfiguration>>,
): Promise<string> {
  if (token && Date.now() < token.gueltigBis) return token.wert;

  const antwort = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(konf.tenant)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: konf.client,
        client_secret: konf.geheimnis,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    },
  );

  if (!antwort.ok) {
    throw new Error(`Anmeldung bei Microsoft fehlgeschlagen (${antwort.status})`);
  }

  const daten = (await antwort.json()) as { access_token: string; expires_in: number };
  // Eine Minute Sicherheitsabstand, damit kein Versand auf ein ablaufendes Token trifft.
  token = { wert: daten.access_token, gueltigBis: Date.now() + (daten.expires_in - 60) * 1000 };
  return token.wert;
}

async function sendeUeberGraph(
  konf: NonNullable<ReturnType<typeof graphKonfiguration>>,
  an: string,
  betreff: string,
  text: string,
): Promise<void> {
  const zugang = await holeToken(konf);

  const antwort = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(konf.absender)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${zugang}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: betreff,
          body: { contentType: "Text", content: text },
          toRecipients: [{ emailAddress: { address: an } }],
        },
        // Die Mails landen im "Gesendet"-Ordner des Postfachs, damit die
        // Geschäftsstelle nachvollziehen kann, was hinausgegangen ist.
        saveToSentItems: true,
      }),
    },
  );

  if (!antwort.ok) {
    const grund = await antwort.text().catch(() => "");
    throw new Error(
      `Versand über Microsoft fehlgeschlagen (${antwort.status}) ${grund.slice(0, 200)}`,
    );
  }
}

export async function sendeMail(an: string, betreff: string, text: string): Promise<void> {
  const graph = graphKonfiguration();
  const smtp = graph ? null : smtpKonfiguration();

  if (!graph && !smtp) {
    if (!hinweisGezeigt) {
      console.warn("[Mail] Kein Versandweg eingerichtet – es werden keine Mails verschickt.");
      hinweisGezeigt = true;
    }
    return;
  }

  try {
    if (graph) {
      await sendeUeberGraph(graph, an, betreff, text);
      return;
    }

    const transport = createTransport({
      host: smtp!.host,
      port: smtp!.port,
      secure: smtp!.port === 465,
      auth: { user: smtp!.user, pass: smtp!.pass },
    });
    await transport.sendMail({ from: smtp!.von, to: an, subject: betreff, text });
  } catch (fehler) {
    // Eine fehlgeschlagene Mail darf die Einreichung nicht kaputtmachen
    console.error("[Mail] Versand fehlgeschlagen:", fehler);
  }
}

export function empfaengerVerein(): string | null {
  const an = process.env["MAIL_AN_VEREIN"];
  if (an) return an;

  // Ohne eigene Angabe geht die Benachrichtigung an den Absender selbst.
  const von = process.env["MAIL_VON"];
  return von ? nurAdresse(von) : null;
}

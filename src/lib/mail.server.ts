import { createTransport } from "nodemailer";

/**
 * Mailversand über ein Postfach des Vereins (SMTP).
 *
 * Nötige Umgebungsvariablen:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   MAIL_VON        Absenderadresse, z. B. "aed neuland <neuland@aed-stuttgart.de>"
 *   MAIL_AN_VEREIN  Empfänger der Benachrichtigung, z. B. neuland@aed-stuttgart.de
 *
 * Fehlt eine davon, wird nichts verschickt und einmal im Log vermerkt – die
 * Einreichung selbst darf daran nie scheitern.
 */

let hinweisGezeigt = false;

function konfiguration() {
  const host = process.env["SMTP_HOST"];
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  const von = process.env["MAIL_VON"];
  if (!host || !user || !pass || !von) return null;
  return {
    host,
    port: Number(process.env["SMTP_PORT"] ?? 587),
    user,
    pass,
    von,
    anVerein: process.env["MAIL_AN_VEREIN"] ?? user,
  };
}

export async function sendeMail(an: string, betreff: string, text: string): Promise<void> {
  const konf = konfiguration();
  if (!konf) {
    if (!hinweisGezeigt) {
      console.warn("[Mail] SMTP ist nicht konfiguriert – es werden keine Mails verschickt.");
      hinweisGezeigt = true;
    }
    return;
  }

  try {
    const transport = createTransport({
      host: konf.host,
      port: konf.port,
      secure: konf.port === 465,
      auth: { user: konf.user, pass: konf.pass },
    });
    await transport.sendMail({ from: konf.von, to: an, subject: betreff, text });
  } catch (fehler) {
    // Eine fehlgeschlagene Mail darf die Einreichung nicht kaputtmachen
    console.error("[Mail] Versand fehlgeschlagen:", fehler);
  }
}

export function empfaengerVerein(): string | null {
  return konfiguration()?.anVerein ?? null;
}

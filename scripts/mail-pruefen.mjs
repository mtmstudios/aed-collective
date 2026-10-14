/**
 * Prüft den Mailversand, sobald das Postfach des Vereins eingerichtet ist.
 *
 *   node scripts/mail-pruefen.mjs                  # nur Verbindung und Anmeldung
 *   node scripts/mail-pruefen.mjs tim@example.org  # dazu eine Testmail
 *
 * Nutzt dieselben Umgebungsvariablen wie die Anwendung:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_VON, MAIL_AN_VEREIN
 */
import { createTransport } from "nodemailer";

const host = process.env["SMTP_HOST"];
const user = process.env["SMTP_USER"];
const pass = process.env["SMTP_PASS"];
const von = process.env["MAIL_VON"];
const port = Number(process.env["SMTP_PORT"] ?? 587);

const fehlend = [
  ["SMTP_HOST", host],
  ["SMTP_USER", user],
  ["SMTP_PASS", pass],
  ["MAIL_VON", von],
]
  .filter(([, wert]) => !wert)
  .map(([name]) => name);

if (fehlend.length > 0) {
  console.error(`Es fehlen: ${fehlend.join(", ")}`);
  process.exit(1);
}

console.log(`Server:    ${host}:${port}`);
console.log(`Benutzer:  ${user}`);
console.log(`Absender:  ${von}\n`);

const transport = createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

try {
  await transport.verify();
  console.log("Verbindung und Anmeldung in Ordnung.");
} catch (fehler) {
  console.error("Fehlgeschlagen:", fehler.message);
  console.error(
    "\nHäufige Ursachen: falscher Port (587 mit STARTTLS, 465 verschlüsselt),\n" +
      "Postfach noch nicht freigeschaltet, oder das Passwort gehört zum Konto\n" +
      "statt zum Postfach.",
  );
  process.exit(1);
}

const empfaenger = process.argv[2];
if (!empfaenger) {
  console.log("\nKeine Adresse angegeben – es wurde nichts verschickt.");
  console.log("Zum Versenden: node scripts/mail-pruefen.mjs <adresse>");
  process.exit(0);
}

const info = await transport.sendMail({
  from: von,
  to: empfaenger,
  subject: "Testmail der aed-Website",
  text: [
    "Diese Nachricht bestätigt, dass die Website Mails verschicken kann.",
    "",
    `Server: ${host}:${port}`,
    `Absender: ${von}`,
    `Benachrichtigungen an den Verein gehen an: ${process.env["MAIL_AN_VEREIN"] ?? user}`,
  ].join("\n"),
});

console.log(`\nVerschickt an ${empfaenger} (${info.messageId}).`);
console.log("Bitte auch in den Spam-Ordner sehen – das verrät fehlende SPF- oder DKIM-Einträge.");

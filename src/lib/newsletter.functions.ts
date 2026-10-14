import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Newsletter-Anmeldung über Mailchimp.
 *
 * Der Verein nutzt Mailchimp weiter; umgezogen wird nur die Domain. Die
 * Anmeldung läuft deshalb unabhängig vom Hosting direkt gegen die API.
 *
 * Eingetragen wird mit dem Status "pending": Mailchimp verschickt die
 * Bestätigungsmail, und erst der Klick darin macht die Anmeldung gültig
 * (Double-Opt-in). Genau das sagt das Formular den Leuten auch zu.
 *
 * Umgebungsvariablen:
 *   MAILCHIMP_API_KEY   Schlüssel aus dem Mailchimp-Konto, endet auf "-us21"
 *                       oder ähnlich – daraus ergibt sich der Serverstandort
 *   MAILCHIMP_LIST_ID   Kennung der Zielgruppe („Audience")
 *   MAILCHIMP_BASIS_URL nur für Prüfläufe, sonst nicht setzen
 */

const schema = z.object({
  vorname: z.string().trim().min(1).max(60),
  nachname: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  neuland: z.boolean().default(false),
});

export type NewsletterAntwort = { ok: true; hinweis: string } | { ok: false; fehler: string };

function konfiguration(): { basis: string; schluessel: string; liste: string } | null {
  const schluessel = process.env["MAILCHIMP_API_KEY"];
  const liste = process.env["MAILCHIMP_LIST_ID"];
  if (!schluessel || !liste) return null;

  const standort = schluessel.split("-").pop() ?? "";
  const basis = process.env["MAILCHIMP_BASIS_URL"] ?? `https://${standort}.api.mailchimp.com`;
  return { basis, schluessel, liste };
}

export const anmeldenNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }): Promise<NewsletterAntwort> => {
    const konf = konfiguration();
    if (!konf) {
      console.error("[Newsletter] MAILCHIMP_API_KEY oder MAILCHIMP_LIST_ID fehlt.");
      return {
        ok: false,
        fehler:
          "Die Anmeldung ist gerade nicht möglich. Bitte schreiben Sie uns kurz – wir tragen Sie ein.",
      };
    }

    try {
      const antwort = await fetch(`${konf.basis}/3.0/lists/${konf.liste}/members`, {
        method: "POST",
        headers: {
          // Mailchimp erwartet den Schlüssel als Passwort, der Benutzername ist beliebig.
          Authorization: `Basic ${Buffer.from(`aed:${konf.schluessel}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: data.email,
          status: "pending",
          merge_fields: { FNAME: data.vorname, LNAME: data.nachname },
          ...(data.neuland ? { tags: ["neuland"] } : {}),
        }),
      });

      if (antwort.ok) {
        return {
          ok: true,
          hinweis:
            "Fast geschafft: Wir haben eine E-Mail mit einem Bestätigungslink verschickt. Erst nach dem Klick sind Sie angemeldet.",
        };
      }

      const grund = (await antwort.json().catch(() => null)) as { title?: string } | null;

      // Wer schon in der Liste steht, bekommt von Mailchimp denselben Fehler
      // wie bei einem echten Problem – das ist für die Person aber keines.
      if (grund?.title === "Member Exists") {
        return {
          ok: true,
          hinweis: "Diese Adresse ist bereits angemeldet. Dann bleibt alles, wie es ist.",
        };
      }
      if (grund?.title === "Invalid Resource") {
        return {
          ok: false,
          fehler:
            "Diese E-Mail-Adresse hat Mailchimp abgelehnt. Bitte prüfen Sie die Schreibweise.",
        };
      }

      console.error(`[Newsletter] Mailchimp antwortete ${antwort.status}: ${grund?.title ?? ""}`);
      return {
        ok: false,
        fehler: "Die Anmeldung hat nicht geklappt. Bitte später noch einmal versuchen.",
      };
    } catch (fehler) {
      console.error("[Newsletter] Mailchimp nicht erreichbar:", fehler);
      return {
        ok: false,
        fehler: "Die Anmeldung hat nicht geklappt. Bitte später noch einmal versuchen.",
      };
    }
  });

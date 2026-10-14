import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Mitgliedsantrag von der Seite „Mitglied werden".
 *
 * Der Antrag geht als Mail an die Geschäftsstelle, die einreichende Person
 * bekommt eine Bestätigung. Dieselbe Strecke wie bei den neuland-Einreichungen –
 * es braucht also kein weiteres System.
 *
 * Ohne eingerichtetes Postfach wird nichts verschickt, und das Formular sagt
 * das auch. Eine stille Danke-Meldung wäre schlimmer als eine Fehlermeldung:
 * Der Antrag wäre verloren, ohne dass es jemand merkt.
 */

const schema = z.object({
  vorname: z.string().trim().min(1).max(60),
  nachname: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  organisation: z.string().trim().max(120).default(""),
  typ: z.string().trim().max(60).default("Personenmitgliedschaft"),
  nachricht: z.string().trim().max(1000).default(""),
  datenschutz: z.boolean(),
});

export type AntragAntwort = { ok: true } | { ok: false; fehler: string };

export const sendeMitgliedsantrag = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }): Promise<AntragAntwort> => {
    if (!data.datenschutz) {
      return { ok: false, fehler: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu." };
    }

    const { sendeMail, empfaengerVerein } = await import("@/lib/mail.server");
    const anVerein = empfaengerVerein();
    if (!anVerein) {
      console.error("[Mitgliedsantrag] Kein Postfach eingerichtet – der Antrag ging verloren.");
      return {
        ok: false,
        fehler:
          "Der Antrag lässt sich gerade nicht absenden. Bitte wenden Sie sich direkt an die Geschäftsstelle.",
      };
    }

    const name = `${data.vorname} ${data.nachname}`;

    try {
      await sendeMail(
        anVerein,
        `Mitgliedsantrag: ${name} (${data.typ})`,
        [
          `Art der Mitgliedschaft: ${data.typ}`,
          `Name: ${name}`,
          `E-Mail: ${data.email}`,
          `Büro / Unternehmen: ${data.organisation || "–"}`,
          ``,
          `Nachricht:`,
          data.nachricht || "–",
          ``,
          `Der Datenschutzhinweis wurde bestätigt.`,
        ].join("\n"),
      );
    } catch (fehler) {
      console.error("[Mitgliedsantrag] Versand an den Verein fehlgeschlagen:", fehler);
      return {
        ok: false,
        fehler:
          "Der Antrag lässt sich gerade nicht absenden. Bitte wenden Sie sich direkt an die Geschäftsstelle.",
      };
    }

    // Die Bestätigung an die antragstellende Person darf den Antrag nicht
    // gefährden – er liegt beim Verein, auch wenn diese Mail scheitert.
    try {
      await sendeMail(
        data.email,
        "Ihr Mitgliedsantrag beim aed e.V. ist eingegangen",
        [
          `Hallo ${name},`,
          ``,
          `vielen Dank für Ihren Antrag auf eine ${data.typ}.`,
          `Die Geschäftsstelle meldet sich innerhalb weniger Tage bei Ihnen.`,
          ``,
          `Viele Grüße`,
          `aed e.V. Stuttgart`,
        ].join("\n"),
      );
    } catch (fehler) {
      console.error("[Mitgliedsantrag] Bestätigung an die Person fehlgeschlagen:", fehler);
    }

    return { ok: true };
  });

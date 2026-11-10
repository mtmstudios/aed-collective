import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Mitgliedsantrag von der Seite „Mitglied werden".
 *
 * Der Antrag wird zuerst in der Datenbank festgehalten und erst danach der
 * Geschäftsstelle gemeldet. Diese Reihenfolge ist der Kern: Früher gab es den
 * Antrag nur als Mail – schlug der Versand fehl, war er weg, und die
 * absendende Person sah trotzdem eine Bestätigung.
 *
 * Lässt sich der Antrag nicht speichern, bekommt sie eine Fehlermeldung.
 * Scheitert nur die Benachrichtigung, gilt der Antrag als angenommen; der
 * Fehlschlag steht in der Zeile und die Geschäftsstelle kann ihn nachholen.
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

const NICHT_ABSENDBAR =
  "Der Antrag lässt sich gerade nicht absenden. Bitte wenden Sie sich direkt an die Geschäftsstelle.";

/** Kürzt die Fehlerursache auf das, was in die Spalte passt. */
function grund(fehler: unknown): string {
  return String(fehler instanceof Error ? fehler.message : fehler).slice(0, 500);
}

export const sendeMitgliedsantrag = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }): Promise<AntragAntwort> => {
    if (!data.datenschutz) {
      return { ok: false, fehler: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu." };
    }

    const { eineZeile, ausfuehren } = await import("@/lib/db.server");

    let antrag: { id: string } | null;
    try {
      antrag = await eineZeile<{ id: string }>(
        `INSERT INTO mitgliedsantraege
           (vorname, nachname, email, organisation, typ, nachricht, datenschutz_bestaetigt)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         RETURNING id`,
        [data.vorname, data.nachname, data.email, data.organisation, data.typ, data.nachricht],
      );
    } catch (fehler) {
      console.error("[Mitgliedsantrag] Speichern fehlgeschlagen:", fehler);
      return { ok: false, fehler: NICHT_ABSENDBAR };
    }

    if (!antrag) {
      console.error("[Mitgliedsantrag] Speichern lieferte keine Zeile zurück.");
      return { ok: false, fehler: NICHT_ABSENDBAR };
    }

    const name = `${data.vorname} ${data.nachname}`;
    const { sendeMail, empfaengerVerein } = await import("@/lib/mail.server");
    const anVerein = empfaengerVerein();

    // Ab hier ist der Antrag sicher. Was noch schiefgeht, wird vermerkt,
    // kostet die absendende Person aber nicht ihre Eingaben.
    try {
      if (!anVerein) throw new Error("Kein Postfach eingerichtet");
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
      await ausfuehren(
        `UPDATE mitgliedsantraege SET gemeldet_am = now(), versandfehler = NULL
                        WHERE id = $1`,
        [antrag.id],
      );
    } catch (fehler) {
      console.error("[Mitgliedsantrag] Meldung an den Verein fehlgeschlagen:", fehler);
      await ausfuehren(`UPDATE mitgliedsantraege SET versandfehler = $2 WHERE id = $1`, [
        antrag.id,
        grund(fehler),
      ]).catch(() => undefined);
    }

    // Die Bestätigung an die antragstellende Person ist nachrangig – der
    // Antrag liegt beim Verein, auch wenn diese Mail scheitert.
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

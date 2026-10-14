import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { istGeschlossen } from "@/config/neuland-einreichung";

const dateiSchema = z.object({
  path: z.string(),
  name: z.string(),
  size: z.number().optional(),
});

const formSchema = z.object({
  vorname: z.string().max(120).optional().default(""),
  nachname: z.string().max(120).optional().default(""),
  email: z.string().email().max(255),
  telefon: z.string().max(60).optional().default(""),
  institution: z.string().max(200).optional().default(""),
  kategorie: z.string().max(80).optional().default(""),
  projekttitel: z.string().max(200).optional().default(""),
  kurzbeschreibung: z.string().max(300).optional().default(""),
  idee: z.string().max(500).optional().default(""),
  umsetzung: z.string().max(500).optional().default(""),
  nutzen: z.string().max(400).optional().default(""),
  nachhaltigkeit: z.string().max(400).optional().default(""),
  titelbild: dateiSchema.nullable().optional().default(null),
  detailfotos: z.array(dateiSchema).max(4).optional().default([]),
  video_link: z.string().max(500).optional().default(""),
  rechte_bestaetigt: z.boolean().optional().default(false),
});

export type EinreichungForm = z.infer<typeof formSchema>;

export type Datei = z.infer<typeof dateiSchema>;

/** Eine Zeile, wie sie die Abfragen unten zurückgeben (siehe SPALTEN). */
export type EinreichungRow = {
  einreichungs_id: string;
  status: string;
  vorname: string | null;
  nachname: string | null;
  email: string;
  telefon: string | null;
  institution: string | null;
  kategorie: string | null;
  projekttitel: string | null;
  kurzbeschreibung: string | null;
  idee: string | null;
  umsetzung: string | null;
  nutzen: string | null;
  nachhaltigkeit: string | null;
  titelbild: Datei | null;
  detailfotos: Datei[];
  video_link: string | null;
  rechte_bestaetigt: boolean;
  created_at: string;
  updated_at: string;
  eingereicht_am: string | null;
};

const SPALTEN =
  "einreichungs_id, status, vorname, nachname, email, telefon, institution, kategorie, projekttitel, kurzbeschreibung, idee, umsetzung, nutzen, nachhaltigkeit, titelbild, detailfotos, video_link, rechte_bestaetigt, created_at, updated_at, eingereicht_am";

async function db() {
  return import("@/lib/db.server");
}

/**
 * Bereitet die Formularwerte für die Datenbank auf.
 *
 * Titelbild und Detailfotos liegen als JSON in der Spalte. Listen müssen dafür
 * ausdrücklich als JSON-Text übergeben werden – sonst macht der Treiber ein
 * PostgreSQL-Array daraus und die Spalte lehnt es ab.
 */
function werteFuerDb(daten: EinreichungForm): Record<string, unknown> {
  return {
    ...daten,
    email: daten.email.trim(),
    titelbild: daten.titelbild ? JSON.stringify(daten.titelbild) : null,
    detailfotos: JSON.stringify(daten.detailfotos ?? []),
  };
}

export const getEinreichungsStatus = createServerFn({ method: "GET" }).handler(async () => ({
  geschlossen: istGeschlossen(),
}));

/** Legt einen Entwurf an oder aktualisiert einen bestehenden (Zugriff via ID + E-Mail). */
export const speichereEntwurf = createServerFn({ method: "POST" })
  .inputValidator((input: { einreichungsId?: string | null; daten: unknown }) => ({
    einreichungsId: input.einreichungsId ?? null,
    daten: formSchema.parse(input.daten),
  }))
  .handler(async ({ data }) => {
    if (istGeschlossen()) throw new Error("Der Bewerbungsschluss für neuland 2027 ist erreicht.");
    const { eineZeile, setzliste } = await db();
    const werte = werteFuerDb(data.daten);

    if (data.einreichungsId) {
      const { sql, werte: parameter } = setzliste(werte);
      const row = await eineZeile<EinreichungRow>(
        `UPDATE neuland_einreichungen SET ${sql}
         WHERE einreichungs_id = $${parameter.length + 1}
           AND lower(email) = lower($${parameter.length + 2})
         RETURNING ${SPALTEN}`,
        [...parameter, data.einreichungsId, String(werte["email"])],
      );
      if (!row) throw new Error("Einreichung nicht gefunden oder E-Mail stimmt nicht überein.");
      return { row, neu: false };
    }

    const felder = Object.keys(werte);
    const row = await eineZeile<EinreichungRow>(
      `INSERT INTO neuland_einreichungen (${felder.map((f) => `"${f}"`).join(", ")})
       VALUES (${felder.map((_, i) => `$${i + 1}`).join(", ")})
       RETURNING ${SPALTEN}`,
      felder.map((f) => werte[f]),
    );
    if (!row) throw new Error("Der Entwurf konnte nicht angelegt werden.");
    return { row, neu: true };
  });

export const ladeEinreichung = createServerFn({ method: "POST" })
  .inputValidator((input: { einreichungsId: string; email: string }) => ({
    einreichungsId: input.einreichungsId.trim().toUpperCase(),
    email: z.string().email().parse(input.email.trim()),
  }))
  .handler(async ({ data }) => {
    const { eineZeile } = await db();
    const row = await eineZeile<EinreichungRow>(
      `SELECT ${SPALTEN} FROM neuland_einreichungen
       WHERE einreichungs_id = $1 AND lower(email) = lower($2)`,
      [data.einreichungsId, data.email],
    );
    if (!row) throw new Error("Keine Bewerbung zu dieser Einreichungs-Nummer und E-Mail gefunden.");
    return { row, geschlossen: istGeschlossen() };
  });

export const reicheEin = createServerFn({ method: "POST" })
  .inputValidator((input: { einreichungsId: string; email: string; daten: unknown }) => ({
    einreichungsId: input.einreichungsId,
    email: input.email,
    daten: formSchema.parse(input.daten),
  }))
  .handler(async ({ data }) => {
    if (istGeschlossen()) throw new Error("Der Bewerbungsschluss für neuland 2027 ist erreicht.");
    const pflicht: Array<[string, unknown]> = [
      ["Vorname", data.daten.vorname],
      ["Nachname", data.daten.nachname],
      ["E-Mail", data.daten.email],
      ["Kategorie", data.daten.kategorie],
      ["Projekttitel", data.daten.projekttitel],
      ["Kurzbeschreibung", data.daten.kurzbeschreibung],
      ["Idee", data.daten.idee],
      ["Umsetzung", data.daten.umsetzung],
      ["Nutzen", data.daten.nutzen],
      ["Nachhaltigkeit", data.daten.nachhaltigkeit],
      ["Titelbild", data.daten.titelbild],
    ];
    const fehlt = pflicht.filter(([, v]) => !v || (typeof v === "string" && !v.trim()));
    if (fehlt.length) throw new Error(`Bitte ausfüllen: ${fehlt.map(([k]) => k).join(", ")}`);
    if (!data.daten.rechte_bestaetigt)
      throw new Error("Bitte die Einverständniserklärung bestätigen.");

    const { eineZeile, setzliste } = await db();
    const { sql, werte: parameter } = setzliste({
      ...werteFuerDb(data.daten),
      status: "eingereicht",
      eingereicht_am: new Date().toISOString(),
    });
    const row = await eineZeile<EinreichungRow>(
      `UPDATE neuland_einreichungen SET ${sql}
       WHERE einreichungs_id = $${parameter.length + 1}
         AND lower(email) = lower($${parameter.length + 2})
       RETURNING ${SPALTEN}`,
      [...parameter, data.einreichungsId, data.email.trim()],
    );
    if (!row) throw new Error("Einreichung nicht gefunden.");

    await benachrichtige(row as unknown as Record<string, unknown>);

    return { row };
  });

/**
 * Nach dem Absenden zwei Mails: eine Bestätigung an die einreichende Person und
 * eine Benachrichtigung an die Geschäftsstelle. So hat der Verein wie zuvor
 * einen laufenden Überblick, ohne in die Datenbank schauen zu müssen.
 * Schlägt der Versand fehl, bleibt die Einreichung trotzdem gespeichert.
 */
async function benachrichtige(row: Record<string, unknown>) {
  try {
    const { sendeMail, empfaengerVerein } = await import("@/lib/mail.server");
    const nummer = String(row["einreichungs_id"] ?? "");
    const titel = String(row["projekttitel"] ?? "ohne Titel");
    const name = [row["vorname"], row["nachname"]].filter(Boolean).join(" ");
    const email = String(row["email"] ?? "");

    if (email) {
      await sendeMail(
        email,
        `Deine Einreichung bei neuland 2027 ist eingegangen (${nummer})`,
        [
          `Hallo ${name || "und herzlichen Dank"},`,
          ``,
          `wir haben Deine Einreichung erhalten.`,
          ``,
          `Nummer: ${nummer}`,
          `Projekt: ${titel}`,
          `Kategorie: ${String(row["kategorie"] ?? "")}`,
          ``,
          `Mit dieser Nummer und Deiner E-Mail-Adresse kannst Du Deine Bewerbung bis zum`,
          `Einsendeschluss jederzeit wieder aufrufen.`,
          ``,
          `Viele Grüße`,
          `aed e.V. – neuland`,
        ].join("\n"),
      );
    }

    const anVerein = empfaengerVerein();
    if (anVerein) {
      await sendeMail(
        anVerein,
        `Neue neuland-Einreichung: ${nummer} – ${titel}`,
        [
          `Nummer: ${nummer}`,
          `Projekt: ${titel}`,
          `Kategorie: ${String(row["kategorie"] ?? "")}`,
          `Einreichende Person: ${name}`,
          `E-Mail: ${email}`,
          `Hochschule: ${String(row["institution"] ?? "")}`,
          ``,
          `Alle Angaben stehen im Jurybereich unter /jurybereich.`,
        ].join("\n"),
      );
    }
  } catch (fehler) {
    console.error("[Einreichung] Benachrichtigung fehlgeschlagen:", fehler);
  }
}

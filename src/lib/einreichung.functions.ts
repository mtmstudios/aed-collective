import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { istGeschlossen, pruefeGeburtsdatum } from "@/config/neuland-einreichung";

const dateiSchema = z.object({
  path: z.string(),
  name: z.string(),
  size: z.number().optional(),
});

const formSchema = z.object({
  vorname: z.string().max(120).optional().default(""),
  nachname: z.string().max(120).optional().default(""),
  email: z.string().email().max(255),
  geburtsdatum: z.string().max(10).optional().default(""),
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

const SPALTEN =
  "einreichungs_id, status, vorname, nachname, email, geburtsdatum, telefon, institution, kategorie, projekttitel, kurzbeschreibung, idee, umsetzung, nutzen, nachhaltigkeit, titelbild, detailfotos, video_link, rechte_bestaetigt, created_at, updated_at, eingereicht_am";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
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
    const db = await admin();
    const werte = { ...data.daten, email: data.daten.email.trim() };

    if (data.einreichungsId) {
      const { data: row, error } = await db
        .from("neuland_einreichungen")
        .update(werte)
        .eq("einreichungs_id", data.einreichungsId)
        .ilike("email", werte.email)
        .select(SPALTEN)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!row) throw new Error("Einreichung nicht gefunden oder E-Mail stimmt nicht überein.");
      return { row, neu: false };
    }

    const { data: row, error } = await db
      .from("neuland_einreichungen")
      .insert(werte)
      .select(SPALTEN)
      .single();
    if (error) throw new Error(error.message);
    return { row, neu: true };
  });

export const ladeEinreichung = createServerFn({ method: "POST" })
  .inputValidator((input: { einreichungsId: string; email: string }) => ({
    einreichungsId: input.einreichungsId.trim().toUpperCase(),
    email: z.string().email().parse(input.email.trim()),
  }))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: row, error } = await db
      .from("neuland_einreichungen")
      .select(SPALTEN)
      .eq("einreichungs_id", data.einreichungsId)
      .ilike("email", data.email)
      .maybeSingle();
    if (error) throw new Error(error.message);
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
      ["Geburtsdatum", data.daten.geburtsdatum],
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
    // Die Altersgrenze gehört zu den Teilnahmevoraussetzungen und wird hier
    // noch einmal geprüft – das Formular allein schützt nicht davor, dass
    // jemand die Angabe umgeht.
    const altersFehler = pruefeGeburtsdatum(data.daten.geburtsdatum);
    if (altersFehler) throw new Error(altersFehler);

    if (!data.daten.rechte_bestaetigt)
      throw new Error("Bitte die Einverständniserklärung bestätigen.");

    const db = await admin();
    const { data: row, error } = await db
      .from("neuland_einreichungen")
      .update({ ...data.daten, status: "eingereicht", eingereicht_am: new Date().toISOString() })
      .eq("einreichungs_id", data.einreichungsId)
      .ilike("email", data.email.trim())
      .select(SPALTEN)
      .maybeSingle();
    if (error) throw new Error(error.message);
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

    const { fasseZusammen } = await import("@/lib/einreichung-text");
    const zusammenfassung = fasseZusammen(row);

    if (email) {
      await sendeMail(
        email,
        `Deine Einreichung bei neuland 2027 ist eingegangen (${nummer})`,
        [
          `Hallo ${name || "und herzlichen Dank"},`,
          ``,
          `Deine Einreichung ist bei uns eingegangen. Hier Deine Angaben zum Nachlesen:`,
          ``,
          zusammenfassung,
          ``,
          `Mit der Nummer ${nummer} und Deiner E-Mail-Adresse kannst Du Deine Bewerbung`,
          `bis zum Einsendeschluss jederzeit wieder aufrufen und ändern.`,
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
          zusammenfassung,
          ``,
          `Die Bewerbung steht mitsamt Bildern im Jurybereich unter /jurybereich.`,
        ].join("\n"),
      );
    }
  } catch (fehler) {
    console.error("[Einreichung] Benachrichtigung fehlgeschlagen:", fehler);
  }
}

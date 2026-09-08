import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, timingSafeEqual } from "node:crypto";
import { BILD_MANIFEST } from "@/data/bild-manifest";

export const STATUS_OPTIONEN = ["ungeklaert", "in-klaerung", "geklaert", "nicht-verwendbar"] as const;
export const RECHTEART_OPTIONEN = [
  "Eigenes Werk",
  "Lizenziert",
  "Einverständnis Dritter",
  "unbekannt",
] as const;

export const STATUS_LABEL: Record<string, string> = {
  ungeklaert: "ungeklärt",
  "in-klaerung": "in Klärung",
  geklaert: "geklärt",
  "nicht-verwendbar": "nicht verwendbar",
};

export type BildrechtRow = {
  pfad: string;
  dateiname: string;
  kategorie: string;
  jahrgang: string | null;
  status: string;
  urheber: string;
  rechteart: string;
  quelle: string;
  freigabedatum: string | null;
  notiz: string;
};

function passwortOk(input: string): boolean {
  const expected = process.env["SITE_PASSWORD"];
  if (!expected) throw new Error("SITE_PASSWORD ist nicht gesetzt");
  const a = createHash("sha256").update(input ?? "", "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const SPALTEN =
  "pfad, dateiname, kategorie, jahrgang, status, urheber, rechteart, quelle, freigabedatum, notiz";

/** Prüft das interne Passwort. */
export const pruefeAdminPasswort = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string }) => input)
  .handler(async ({ data }) => ({ ok: passwortOk(data.passwort) }));

/** Synchronisiert das Bild-Manifest in die Datenbank und liefert alle Einträge. */
export const ladeBildverzeichnis = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string }) => input)
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const db = await admin();

    const { data: vorhandene, error: leseFehler } = await db
      .from("bildrechte")
      .select("pfad");
    if (leseFehler) throw new Error(leseFehler.message);

    const bekannt = new Set((vorhandene ?? []).map((r) => r.pfad));
    const neue = BILD_MANIFEST.filter((b) => !bekannt.has(b.pfad)).map((b) => ({
      pfad: b.pfad,
      dateiname: b.dateiname,
      kategorie: b.kategorie,
      jahrgang: b.jahrgang,
    }));

    for (let i = 0; i < neue.length; i += 200) {
      const { error } = await db.from("bildrechte").insert(neue.slice(i, i + 200));
      if (error) throw new Error(error.message);
    }

    const { data: rows, error } = await db
      .from("bildrechte")
      .select(SPALTEN)
      .order("kategorie")
      .order("dateiname");
    if (error) throw new Error(error.message);

    return { bilder: (rows ?? []) as BildrechtRow[] };
  });

const updateSchema = z.object({
  status: z.enum(STATUS_OPTIONEN).optional(),
  urheber: z.string().max(300).optional(),
  rechteart: z.string().max(120).optional(),
  quelle: z.string().max(500).optional(),
  freigabedatum: z.string().max(20).nullable().optional(),
  notiz: z.string().max(4000).optional(),
});

/** Speichert Rechte-Angaben zu einem Bild (Autosave). */
export const speichereBildrecht = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string; pfad: string; werte: unknown }) => ({
    passwort: input.passwort,
    pfad: input.pfad,
    werte: updateSchema.parse(input.werte),
  }))
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const db = await admin();
    const werte = {
      ...data.werte,
      freigabedatum: data.werte.freigabedatum ? data.werte.freigabedatum : null,
    };
    const { error } = await db.from("bildrechte").update(werte).eq("pfad", data.pfad);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

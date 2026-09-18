import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, timingSafeEqual } from "node:crypto";
import { BILD_MANIFEST } from "@/data/bild-manifest";
import { projektBilder } from "@/data/bilder";
import { projekte } from "@/data/projekte";

export const STATUS_OPTIONEN = [
  "ungeklaert",
  "in-klaerung",
  "geklaert",
  "nicht-verwendbar",
] as const;
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
  verwendungen: string[];
};

function passwortOk(input: string): boolean {
  const expected = process.env["SITE_PASSWORD"];
  if (!expected) throw new Error("SITE_PASSWORD ist nicht gesetzt");
  const a = createHash("sha256")
    .update(input ?? "", "utf8")
    .digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const SPALTEN =
  "pfad, dateiname, kategorie, jahrgang, status, urheber, rechteart, quelle, freigabedatum, notiz, verwendungen";

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
      .select("pfad, verwendungen");
    if (leseFehler) throw new Error(leseFehler.message);

    const bekannt = new Map((vorhandene ?? []).map((r) => [r.pfad, r.verwendungen ?? []]));
    const neue = BILD_MANIFEST.filter((b) => !bekannt.has(b.pfad)).map((b) => ({
      pfad: b.pfad,
      dateiname: b.dateiname,
      kategorie: b.kategorie,
      jahrgang: b.jahrgang,
      verwendungen: b.verwendungen,
    }));

    for (let i = 0; i < neue.length; i += 200) {
      const { error } = await db.from("bildrechte").insert(neue.slice(i, i + 200));
      if (error) throw new Error(error.message);
    }

    // Verwendungsorte bei jedem Laden aus dem Manifest aktualisieren (nur bei Abweichung)
    for (const b of BILD_MANIFEST) {
      const alt = bekannt.get(b.pfad);
      if (!alt || JSON.stringify(alt) === JSON.stringify(b.verwendungen)) continue;
      const { error } = await db
        .from("bildrechte")
        .update({ verwendungen: b.verwendungen })
        .eq("pfad", b.pfad);
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

/** Speichert Rechte-Angaben für mehrere Bilder gleichzeitig (Gruppen-Übernahme). */
export const speichereBildrechteGruppe = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string; pfade: string[]; werte: unknown }) => ({
    passwort: input.passwort,
    pfade: z.array(z.string()).max(2000).parse(input.pfade),
    werte: updateSchema.parse(input.werte),
  }))
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const db = await admin();
    const werte = {
      ...data.werte,
      ...(data.werte.freigabedatum !== undefined
        ? { freigabedatum: data.werte.freigabedatum || null }
        : {}),
    };
    for (let i = 0; i < data.pfade.length; i += 200) {
      const { error } = await db
        .from("bildrechte")
        .update(werte)
        .in("pfad", data.pfade.slice(i, i + 200));
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

/**
 * Ordnet jedem Projektbild die Angaben seines Wettbewerbsbeitrags zu.
 * Grundlage ist der Bildschlüssel `<Jahrgang>/<Projekt>` aus `projektBilder`.
 */
function projektAngaben(): Map<string, { urheber: string; quelle: string; rechteart: string }> {
  const pfadNachUrl = new Map(BILD_MANIFEST.map((b) => [b.url, b.pfad]));
  const angaben = new Map<string, { urheber: string; quelle: string; rechteart: string }>();

  for (const [schluessel, urls] of Object.entries(projektBilder)) {
    const [jahr, slug] = schluessel.split("/");
    const projekt = projekte.find((p) => p.jahr === jahr && p.slug === slug);
    if (!projekt) continue;

    // Im Crawl hängt an manchen Autorenzeilen noch die Objektbeschreibung
    const urheber = projekt.autor.split(/\s+Objekt:/)[0].trim();
    if (!urheber) continue;

    for (const url of urls) {
      const pfad = pfadNachUrl.get(url);
      if (!pfad) continue;
      angaben.set(pfad, {
        urheber,
        quelle: `neuland ${jahr}, Einreichung „${projekt.titel}“`,
        rechteart: "Einverständnis Dritter",
      });
    }
  }
  return angaben;
}

/**
 * Trägt für die Bilder der Wettbewerbsbeiträge die namentlich genannten
 * Gewinner:innen als Urheber:innen ein. Felder, in denen schon etwas steht,
 * bleiben unberührt; der Status wird nur aus „ungeklärt“ heraus gesetzt.
 */
export const uebernehmeProjektangaben = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string }) => input)
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const db = await admin();
    const angaben = projektAngaben();

    const { data: rows, error: leseFehler } = await db
      .from("bildrechte")
      .select("pfad, urheber, status")
      .eq("kategorie", "projekt");
    if (leseFehler) throw new Error(leseFehler.message);

    const bestand = new Map((rows ?? []).map((r) => [r.pfad, r]));

    // Bilder mit gleichen Angaben in einem Rutsch schreiben
    type Uebernahme = {
      urheber: string;
      quelle: string;
      rechteart: string;
      status?: string;
    };
    const gruppen = new Map<string, { werte: Uebernahme; pfade: string[] }>();

    let uebersprungen = 0;
    for (const [pfad, werte] of angaben) {
      const zeile = bestand.get(pfad);
      if (!zeile) continue;
      if ((zeile.urheber ?? "").trim()) {
        uebersprungen++;
        continue;
      }
      const statusSetzen = zeile.status === "ungeklaert";
      const schluessel = `${werte.urheber}|${werte.quelle}|${statusSetzen}`;
      if (!gruppen.has(schluessel)) {
        gruppen.set(schluessel, {
          werte: statusSetzen ? { ...werte, status: "in-klaerung" } : { ...werte },
          pfade: [],
        });
      }
      gruppen.get(schluessel)!.pfade.push(pfad);
    }

    let geschrieben = 0;
    for (const gruppe of gruppen.values()) {
      for (let i = 0; i < gruppe.pfade.length; i += 200) {
        const teil = gruppe.pfade.slice(i, i + 200);
        const { error } = await db.from("bildrechte").update(gruppe.werte).in("pfad", teil);
        if (error) throw new Error(error.message);
        geschrieben += teil.length;
      }
    }

    const { data: neu, error } = await db
      .from("bildrechte")
      .select(SPALTEN)
      .order("kategorie")
      .order("dateiname");
    if (error) throw new Error(error.message);

    return {
      geschrieben,
      uebersprungen,
      zuordenbar: angaben.size,
      bilder: (neu ?? []) as BildrechtRow[],
    };
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

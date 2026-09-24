import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Jurybereich: Zugänge mit Rolle, Wertung 1–10 je Einreichung.
 * Jurymitglieder sehen nur die eigene Wertung, die Geschäftsstelle sieht alles.
 */

export const ROLLEN = ["jury", "geschaeftsstelle"] as const;
export type Rolle = (typeof ROLLEN)[number];

export const ROLLEN_LABEL: Record<string, string> = {
  jury: "Jury",
  geschaeftsstelle: "Geschäftsstelle",
};

const BUCKET = "neuland-einreichungen";
const SITZUNGSDAUER_STD = 12;

export type Sitzung = { id: string | null; name: string; rolle: Rolle; exp: number };

export type Zugang = {
  id: string;
  name: string;
  email: string;
  rolle: string;
  aktiv: boolean;
  hatPasswort: boolean;
  letzterLogin: string | null;
};

/* Zeilenformen der noch nicht generierten Tabellen */
type WertungRow = {
  einreichung_id: string;
  juror_id: string;
  punkte: number | null;
  kommentar: string | null;
};
type PersonRow = { id: string; name: string };
type ZugangRow = {
  id: string;
  name: string;
  email: string;
  rolle: string;
  aktiv: boolean;
  passwort_hash: string;
  letzter_login: string | null;
};
type BeitragRow = {
  id: string;
  einreichungs_id: string;
  projekttitel: string | null;
  kategorie: string | null;
  institution: string | null;
  eingereicht_am: string | null;
};

export type EigeneWertung = { punkte: number | null; kommentar: string };

export type FremdWertung = { juror: string; punkte: number | null; kommentar: string };

export type Beitrag = {
  id: string;
  einreichungsId: string;
  projekttitel: string;
  kategorie: string;
  institution: string;
  eingereichtAm: string | null;
  eigene: EigeneWertung | null;
  /** Nur für die Geschäftsstelle gefüllt. */
  anzahlWertungen: number | null;
  schnitt: number | null;
};

export type BeitragDetail = Beitrag & {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  kurzbeschreibung: string;
  idee: string;
  umsetzung: string;
  nutzen: string;
  nachhaltigkeit: string;
  videoLink: string;
  bilder: { name: string; url: string }[];
  fremde: FremdWertung[];
};

function geheimnis(): string {
  const wert = process.env["SITE_PASSWORD"];
  if (!wert) throw new Error("SITE_PASSWORD ist nicht gesetzt");
  return wert;
}

/**
 * Die generierten Supabase-Typen kennen `jury_zugaenge` und `jury_wertungen` noch
 * nicht – sie entstehen erst, wenn Lovable die Typen nach der Migration neu baut.
 * Bis dahin greifen wir ungetypt zu.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoserClient = { from: (t: string) => any; storage: { from: (b: string) => any } };

async function admin(): Promise<LoserClient> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as LoserClient;
}

/** Maskiert LIKE-Sonderzeichen, damit eine E-Mail exakt verglichen wird. */
function alsMuster(wert: string): string {
  return wert.trim().replace(/[\\%_]/g, (z) => `\\${z}`);
}

/* ---------- Passwörter ---------- */

/**
 * Speichert Passwörter als scrypt-Hash mit eigenem Salt, nie im Klartext.
 * Bleibt bewusst modulintern – exportiert würde node:crypto im Browser-Bundle landen.
 */
function hashPasswort(passwort: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(passwort, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function passwortStimmt(passwort: string, gespeichert: string): boolean {
  const teile = gespeichert.split("$");
  if (teile.length !== 3 || teile[0] !== "scrypt") return false;
  const salt = Buffer.from(teile[1], "hex");
  const erwartet = Buffer.from(teile[2], "hex");
  const berechnet = scryptSync(passwort, salt, erwartet.length);
  return timingSafeEqual(berechnet, erwartet);
}

/** Vergleicht mit dem Seitenpasswort – damit kommt die Geschäftsstelle herein. */
function istSeitenpasswort(passwort: string): boolean {
  const a = createHash("sha256")
    .update(passwort ?? "", "utf8")
    .digest();
  const b = createHash("sha256").update(geheimnis(), "utf8").digest();
  return timingSafeEqual(a, b);
}

/* ---------- Sitzungen ---------- */

function signiere(sitzung: Sitzung): string {
  const nutzlast = Buffer.from(JSON.stringify(sitzung), "utf8").toString("base64url");
  const signatur = createHmac("sha256", geheimnis()).update(nutzlast).digest("base64url");
  return `${nutzlast}.${signatur}`;
}

function pruefeSitzung(token: string | undefined): Sitzung {
  if (!token || !token.includes(".")) throw new Error("Nicht angemeldet");
  const [nutzlast, signatur] = token.split(".");
  const erwartet = createHmac("sha256", geheimnis()).update(nutzlast).digest("base64url");
  const a = Buffer.from(signatur ?? "", "utf8");
  const b = Buffer.from(erwartet, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Nicht angemeldet");
  const sitzung = JSON.parse(Buffer.from(nutzlast, "base64url").toString("utf8")) as Sitzung;
  if (sitzung.exp < Date.now()) throw new Error("Sitzung abgelaufen");
  return sitzung;
}

function nurGeschaeftsstelle(sitzung: Sitzung): Sitzung {
  if (sitzung.rolle !== "geschaeftsstelle") throw new Error("Dafür fehlen die Rechte");
  return sitzung;
}

/* ---------- Anmeldung ---------- */

export const anmelden = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; passwort: string }) => input)
  .handler(async ({ data }) => {
    const exp = Date.now() + SITZUNGSDAUER_STD * 3600 * 1000;

    const db = await admin();

    // Einstieg über das Seitenpasswort, aber nur solange es noch keinen echten
    // Zugang der Geschäftsstelle gibt. In den Einreichungen stecken
    // personenbezogene Daten – dafür ist ein geteiltes Passwort zu schwach.
    if (istSeitenpasswort(data.passwort)) {
      const { data: vorhanden } = await db
        .from("jury_zugaenge")
        .select("id")
        .eq("rolle", "geschaeftsstelle")
        .eq("aktiv", true)
        .limit(1);
      if ((vorhanden ?? []).length > 0) {
        throw new Error(
          "Das Seitenpasswort gilt nur für die Einrichtung. Bitte mit dem eigenen Zugang anmelden.",
        );
      }
      const sitzung: Sitzung = {
        id: null,
        name: "Geschäftsstelle",
        rolle: "geschaeftsstelle",
        exp,
      };
      return { token: signiere(sitzung), sitzung };
    }

    const { data: zeilen, error } = await db
      .from("jury_zugaenge")
      .select("id, name, rolle, passwort_hash, aktiv")
      .ilike("email", alsMuster(data.email))
      .limit(1);
    if (error) throw new Error(error.message);

    const zugang = zeilen?.[0];
    if (!zugang || !zugang.aktiv || !zugang.passwort_hash) {
      throw new Error("E-Mail oder Passwort stimmt nicht");
    }
    if (!passwortStimmt(data.passwort, zugang.passwort_hash)) {
      throw new Error("E-Mail oder Passwort stimmt nicht");
    }

    await db
      .from("jury_zugaenge")
      .update({ letzter_login: new Date().toISOString() })
      .eq("id", zugang.id);

    const sitzung: Sitzung = {
      id: zugang.id,
      name: zugang.name,
      rolle: (zugang.rolle as Rolle) ?? "jury",
      exp,
    };
    return { token: signiere(sitzung), sitzung };
  });

/** Prüft ein gespeichertes Token beim Seitenaufruf. */
export const pruefeToken = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    try {
      return { sitzung: pruefeSitzung(data.token) };
    } catch {
      return { sitzung: null };
    }
  });

/* ---------- Beiträge ---------- */

const BEITRAG_SPALTEN = "id, einreichungs_id, projekttitel, kategorie, institution, eingereicht_am";

export const ladeBeitraege = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const sitzung = pruefeSitzung(data.token);
    const db = await admin();

    const { data: zeilen, error } = await db
      .from("neuland_einreichungen")
      .select(BEITRAG_SPALTEN)
      .eq("status", "eingereicht")
      .order("eingereicht_am");
    if (error) throw new Error(error.message);

    const { data: wertungen, error: wFehler } = await db
      .from("jury_wertungen")
      .select("einreichung_id, juror_id, punkte, kommentar");
    if (wFehler) throw new Error(wFehler.message);

    const alle = (wertungen ?? []) as WertungRow[];
    const beitraege: Beitrag[] = ((zeilen ?? []) as BeitragRow[]).map((z) => {
      const dazu = alle.filter((w) => w.einreichung_id === z.id);
      const eigeneZeile = sitzung.id ? dazu.find((w) => w.juror_id === sitzung.id) : undefined;
      const mitPunkten = dazu.filter((w) => typeof w.punkte === "number");
      const darfAlles = sitzung.rolle === "geschaeftsstelle";
      return {
        id: z.id,
        einreichungsId: z.einreichungs_id,
        projekttitel: z.projekttitel ?? "",
        kategorie: z.kategorie ?? "",
        institution: z.institution ?? "",
        eingereichtAm: z.eingereicht_am,
        eigene: eigeneZeile
          ? { punkte: eigeneZeile.punkte, kommentar: eigeneZeile.kommentar ?? "" }
          : null,
        anzahlWertungen: darfAlles ? mitPunkten.length : null,
        schnitt:
          darfAlles && mitPunkten.length
            ? Math.round(
                (mitPunkten.reduce((s, w) => s + (w.punkte ?? 0), 0) / mitPunkten.length) * 10,
              ) / 10
            : null,
      };
    });

    return { sitzung, beitraege };
  });

export const ladeBeitrag = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; id: string }) => input)
  .handler(async ({ data }) => {
    const sitzung = pruefeSitzung(data.token);
    const db = await admin();

    const { data: z, error } = await db
      .from("neuland_einreichungen")
      .select(
        `${BEITRAG_SPALTEN}, vorname, nachname, email, telefon, kurzbeschreibung, idee, umsetzung, nutzen, nachhaltigkeit, video_link, titelbild, detailfotos`,
      )
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const { data: wertungen, error: wFehler } = await db
      .from("jury_wertungen")
      .select("juror_id, punkte, kommentar")
      .eq("einreichung_id", data.id);
    if (wFehler) throw new Error(wFehler.message);

    // Bilder liegen in einem geschlossenen Bucket – kurzlebige Links erzeugen
    const dateien = [
      ...(z.titelbild ? [z.titelbild as { path: string; name: string }] : []),
      ...((z.detailfotos ?? []) as { path: string; name: string }[]),
    ];
    const bilder: { name: string; url: string }[] = [];
    for (const datei of dateien) {
      if (!datei?.path) continue;
      const { data: signiert } = await db.storage.from(BUCKET).createSignedUrl(datei.path, 3600);
      if (signiert?.signedUrl) bilder.push({ name: datei.name ?? "", url: signiert.signedUrl });
    }

    const alle = (wertungen ?? []) as WertungRow[];
    const eigeneZeile = sitzung.id ? alle.find((w) => w.juror_id === sitzung.id) : undefined;

    let fremde: FremdWertung[] = [];
    if (sitzung.rolle === "geschaeftsstelle") {
      const { data: personen } = await db.from("jury_zugaenge").select("id, name");
      const namen = new Map(((personen ?? []) as PersonRow[]).map((p) => [p.id, p.name]));
      fremde = alle.map((w) => ({
        juror: namen.get(w.juror_id) ?? "unbekannt",
        punkte: w.punkte,
        kommentar: w.kommentar ?? "",
      }));
    }

    const mitPunkten = alle.filter((w) => typeof w.punkte === "number");
    const darfAlles = sitzung.rolle === "geschaeftsstelle";

    const detail: BeitragDetail = {
      id: z.id,
      einreichungsId: z.einreichungs_id,
      projekttitel: z.projekttitel ?? "",
      kategorie: z.kategorie ?? "",
      institution: z.institution ?? "",
      eingereichtAm: z.eingereicht_am,
      vorname: z.vorname ?? "",
      nachname: z.nachname ?? "",
      email: z.email ?? "",
      telefon: z.telefon ?? "",
      kurzbeschreibung: z.kurzbeschreibung ?? "",
      idee: z.idee ?? "",
      umsetzung: z.umsetzung ?? "",
      nutzen: z.nutzen ?? "",
      nachhaltigkeit: z.nachhaltigkeit ?? "",
      videoLink: z.video_link ?? "",
      bilder,
      eigene: eigeneZeile
        ? { punkte: eigeneZeile.punkte, kommentar: eigeneZeile.kommentar ?? "" }
        : null,
      fremde,
      anzahlWertungen: darfAlles ? mitPunkten.length : null,
      schnitt:
        darfAlles && mitPunkten.length
          ? Math.round(
              (mitPunkten.reduce((s, w) => s + (w.punkte ?? 0), 0) / mitPunkten.length) * 10,
            ) / 10
          : null,
    };

    return { sitzung, beitrag: detail };
  });

const wertungSchema = z.object({
  punkte: z.number().int().min(1).max(10).nullable(),
  kommentar: z.string().max(4000).default(""),
});

export const speichereWertung = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; einreichungId: string; werte: unknown }) => ({
    token: input.token,
    einreichungId: input.einreichungId,
    werte: wertungSchema.parse(input.werte),
  }))
  .handler(async ({ data }) => {
    const sitzung = pruefeSitzung(data.token);
    if (!sitzung.id) {
      throw new Error("Die Geschäftsstelle wertet nicht mit – dafür braucht es einen Jurzugang");
    }
    const db = await admin();
    const { error } = await db.from("jury_wertungen").upsert(
      {
        einreichung_id: data.einreichungId,
        juror_id: sitzung.id,
        punkte: data.werte.punkte,
        kommentar: data.werte.kommentar,
      },
      { onConflict: "einreichung_id,juror_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ---------- Zugänge (nur Geschäftsstelle) ---------- */

export const ladeZugaenge = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    nurGeschaeftsstelle(pruefeSitzung(data.token));
    const db = await admin();
    const { data: zeilen, error } = await db
      .from("jury_zugaenge")
      .select("id, name, email, rolle, aktiv, passwort_hash, letzter_login")
      .order("name");
    if (error) throw new Error(error.message);

    const zugaenge: Zugang[] = ((zeilen ?? []) as ZugangRow[]).map((z) => ({
      id: z.id,
      name: z.name,
      email: z.email,
      rolle: z.rolle,
      aktiv: z.aktiv,
      hatPasswort: Boolean(z.passwort_hash),
      letzterLogin: z.letzter_login,
    }));
    return { zugaenge };
  });

const zugangSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  rolle: z.enum(ROLLEN),
  aktiv: z.boolean().default(true),
  passwort: z.string().min(8).max(200).optional(),
});

export const speichereZugang = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; id?: string; werte: unknown }) => ({
    token: input.token,
    id: input.id,
    werte: zugangSchema.parse(input.werte),
  }))
  .handler(async ({ data }) => {
    nurGeschaeftsstelle(pruefeSitzung(data.token));
    const db = await admin();

    const werte: Record<string, unknown> = {
      name: data.werte.name,
      email: data.werte.email,
      rolle: data.werte.rolle,
      aktiv: data.werte.aktiv,
    };
    if (data.werte.passwort) werte["passwort_hash"] = hashPasswort(data.werte.passwort);

    if (data.id) {
      const { error } = await db.from("jury_zugaenge").update(werte).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true as const };
    }

    if (!data.werte.passwort) throw new Error("Für einen neuen Zugang braucht es ein Passwort");
    const { error } = await db.from("jury_zugaenge").insert(werte);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const loescheZugang = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; id: string }) => input)
  .handler(async ({ data }) => {
    nurGeschaeftsstelle(pruefeSitzung(data.token));
    const db = await admin();
    const { error } = await db.from("jury_zugaenge").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Alle Wertungen für den Export der Geschäftsstelle. */
export const ladeAuswertung = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    nurGeschaeftsstelle(pruefeSitzung(data.token));
    const db = await admin();

    const { data: beitraege, error } = await db
      .from("neuland_einreichungen")
      .select("id, einreichungs_id, projekttitel, kategorie, institution")
      .eq("status", "eingereicht");
    if (error) throw new Error(error.message);

    const { data: wertungen, error: wFehler } = await db
      .from("jury_wertungen")
      .select("einreichung_id, juror_id, punkte, kommentar");
    if (wFehler) throw new Error(wFehler.message);

    const { data: personen } = await db.from("jury_zugaenge").select("id, name");
    const namen = new Map(((personen ?? []) as PersonRow[]).map((p) => [p.id, p.name]));

    const alleBeitraege = (beitraege ?? []) as BeitragRow[];
    const zeilen = ((wertungen ?? []) as WertungRow[]).map((w) => {
      const b = alleBeitraege.find((x) => x.id === w.einreichung_id);
      return {
        einreichungsId: b?.einreichungs_id ?? "",
        projekttitel: b?.projekttitel ?? "",
        kategorie: b?.kategorie ?? "",
        institution: b?.institution ?? "",
        juror: namen.get(w.juror_id) ?? "unbekannt",
        punkte: w.punkte,
        kommentar: w.kommentar ?? "",
      };
    });

    return { zeilen };
  });

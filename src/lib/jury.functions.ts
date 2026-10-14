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

async function db() {
  return import("@/lib/db.server");
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

    const { abfrage, ausfuehren, eineZeile } = await db();

    // Einstieg über das Seitenpasswort, aber nur solange es noch keinen echten
    // Zugang der Geschäftsstelle gibt. In den Einreichungen stecken
    // personenbezogene Daten – dafür ist ein geteiltes Passwort zu schwach.
    if (istSeitenpasswort(data.passwort)) {
      const vorhanden = await abfrage<{ id: string }>(
        `SELECT id FROM jury_zugaenge
         WHERE rolle = 'geschaeftsstelle' AND aktiv = true LIMIT 1`,
      );
      if (vorhanden.length > 0) {
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

    const zugang = await eineZeile<{
      id: string;
      name: string;
      rolle: string;
      passwort_hash: string;
      aktiv: boolean;
    }>(
      `SELECT id, name, rolle, passwort_hash, aktiv FROM jury_zugaenge
       WHERE lower(email) = lower($1) LIMIT 1`,
      [data.email.trim()],
    );

    if (!zugang || !zugang.aktiv || !zugang.passwort_hash) {
      throw new Error("E-Mail oder Passwort stimmt nicht");
    }
    if (!passwortStimmt(data.passwort, zugang.passwort_hash)) {
      throw new Error("E-Mail oder Passwort stimmt nicht");
    }

    await ausfuehren(`UPDATE jury_zugaenge SET letzter_login = now() WHERE id = $1`, [zugang.id]);

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
    const { abfrage } = await db();

    const zeilen = await abfrage<BeitragRow>(
      `SELECT ${BEITRAG_SPALTEN} FROM neuland_einreichungen
       WHERE status = 'eingereicht' ORDER BY eingereicht_am`,
    );

    const alle = await abfrage<WertungRow>(
      `SELECT einreichung_id, juror_id, punkte, kommentar FROM jury_wertungen`,
    );

    const beitraege: Beitrag[] = zeilen.map((z) => {
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
    const { abfrage, eineZeile } = await db();

    const z = await eineZeile<
      BeitragRow & {
        vorname: string | null;
        nachname: string | null;
        email: string | null;
        telefon: string | null;
        kurzbeschreibung: string | null;
        idee: string | null;
        umsetzung: string | null;
        nutzen: string | null;
        nachhaltigkeit: string | null;
        video_link: string | null;
        titelbild: { path: string; name: string } | null;
        detailfotos: { path: string; name: string }[] | null;
      }
    >(
      `SELECT ${BEITRAG_SPALTEN}, vorname, nachname, email, telefon, kurzbeschreibung,
              idee, umsetzung, nutzen, nachhaltigkeit, video_link, titelbild, detailfotos
       FROM neuland_einreichungen WHERE id = $1`,
      [data.id],
    );
    if (!z) throw new Error("Einreichung nicht gefunden");

    const alle = await abfrage<WertungRow>(
      `SELECT juror_id, punkte, kommentar FROM jury_wertungen WHERE einreichung_id = $1`,
      [data.id],
    );

    // Die Dateien liegen außerhalb des öffentlichen Ordners – kurzlebige Links erzeugen
    const { signierterLink } = await import("@/lib/dateien.server");
    const dateien = [...(z.titelbild ? [z.titelbild] : []), ...(z.detailfotos ?? [])];
    const bilder = dateien
      .filter((datei) => datei?.path)
      .map((datei) => ({ name: datei.name ?? "", url: signierterLink(datei.path) }));

    const eigeneZeile = sitzung.id ? alle.find((w) => w.juror_id === sitzung.id) : undefined;

    let fremde: FremdWertung[] = [];
    if (sitzung.rolle === "geschaeftsstelle") {
      const personen = await abfrage<PersonRow>(`SELECT id, name FROM jury_zugaenge`);
      const namen = new Map(personen.map((p) => [p.id, p.name]));
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
      throw new Error(
        "Mit dem Einrichtungs-Passwort lässt sich nicht werten. Bitte unter „Zugänge“ einen eigenen Zugang anlegen und damit anmelden.",
      );
    }
    const { ausfuehren } = await db();
    await ausfuehren(
      `INSERT INTO jury_wertungen (einreichung_id, juror_id, punkte, kommentar)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (einreichung_id, juror_id)
       DO UPDATE SET punkte = EXCLUDED.punkte, kommentar = EXCLUDED.kommentar`,
      [data.einreichungId, sitzung.id, data.werte.punkte, data.werte.kommentar],
    );
    return { ok: true as const };
  });

/* ---------- Zugänge (nur Geschäftsstelle) ---------- */

export const ladeZugaenge = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    nurGeschaeftsstelle(pruefeSitzung(data.token));
    const { abfrage } = await db();
    const zeilen = await abfrage<ZugangRow>(
      `SELECT id, name, email, rolle, aktiv, passwort_hash, letzter_login
       FROM jury_zugaenge ORDER BY name`,
    );

    const zugaenge: Zugang[] = zeilen.map((z) => ({
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
    const { ausfuehren, setzliste, istDoppelt } = await db();

    const werte: Record<string, unknown> = {
      name: data.werte.name,
      email: data.werte.email,
      rolle: data.werte.rolle,
      aktiv: data.werte.aktiv,
    };
    if (data.werte.passwort) werte["passwort_hash"] = hashPasswort(data.werte.passwort);

    // Die Datenbank meldet eine doppelte Adresse technisch – hier in Klartext
    const melde = (fehler: unknown): never => {
      if (istDoppelt(fehler)) {
        throw new Error("Für diese E-Mail-Adresse gibt es bereits einen Zugang.");
      }
      throw fehler;
    };

    if (data.id) {
      const { sql, werte: parameter } = setzliste(werte);
      try {
        await ausfuehren(`UPDATE jury_zugaenge SET ${sql} WHERE id = $${parameter.length + 1}`, [
          ...parameter,
          data.id,
        ]);
      } catch (fehler) {
        melde(fehler);
      }
      return { ok: true as const };
    }

    if (!data.werte.passwort) throw new Error("Für einen neuen Zugang braucht es ein Passwort");
    const felder = Object.keys(werte);
    try {
      await ausfuehren(
        `INSERT INTO jury_zugaenge (${felder.map((f) => `"${f}"`).join(", ")})
         VALUES (${felder.map((_, i) => `$${i + 1}`).join(", ")})`,
        felder.map((f) => werte[f]),
      );
    } catch (fehler) {
      melde(fehler);
    }
    return { ok: true as const };
  });

export const loescheZugang = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; id: string }) => input)
  .handler(async ({ data }) => {
    nurGeschaeftsstelle(pruefeSitzung(data.token));
    const { ausfuehren } = await db();
    await ausfuehren(`DELETE FROM jury_zugaenge WHERE id = $1`, [data.id]);
    return { ok: true as const };
  });

/** Alle Wertungen für den Export der Geschäftsstelle. */
export const ladeAuswertung = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    nurGeschaeftsstelle(pruefeSitzung(data.token));
    const { abfrage } = await db();

    const alleBeitraege = await abfrage<BeitragRow>(
      `SELECT id, einreichungs_id, projekttitel, kategorie, institution
       FROM neuland_einreichungen WHERE status = 'eingereicht'`,
    );

    const alleWertungen = await abfrage<WertungRow>(
      `SELECT einreichung_id, juror_id, punkte, kommentar FROM jury_wertungen`,
    );

    const personen = await abfrage<PersonRow>(`SELECT id, name FROM jury_zugaenge`);
    const namen = new Map(personen.map((p) => [p.id, p.name]));

    // Lange Form: eine Zeile je abgegebener Wertung
    const zeilen = alleWertungen.map((w) => {
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

    // Nur Jurymitglieder, die tatsächlich gewertet haben – in fester Reihenfolge
    const juroren = [
      ...new Set(alleWertungen.map((w) => namen.get(w.juror_id) ?? "unbekannt")),
    ].sort((a, b) => a.localeCompare(b, "de"));

    // Kreuztabelle: eine Zeile je Beitrag, eine Spalte je Jurymitglied
    const uebersicht = alleBeitraege
      .map((b) => {
        const dazu = alleWertungen.filter((w) => w.einreichung_id === b.id);
        const mitPunkten = dazu.filter((w) => typeof w.punkte === "number");
        const punkte: Record<string, number | null> = {};
        for (const juror of juroren) {
          const treffer = dazu.find((w) => (namen.get(w.juror_id) ?? "unbekannt") === juror);
          punkte[juror] = treffer?.punkte ?? null;
        }
        return {
          einreichungsId: b.einreichungs_id,
          projekttitel: b.projekttitel ?? "",
          kategorie: b.kategorie ?? "",
          institution: b.institution ?? "",
          anzahl: mitPunkten.length,
          schnitt: mitPunkten.length
            ? Math.round(
                (mitPunkten.reduce((s, w) => s + (w.punkte ?? 0), 0) / mitPunkten.length) * 100,
              ) / 100
            : null,
          punkte,
          kommentare: dazu
            .filter((w) => (w.kommentar ?? "").trim())
            .map((w) => `${namen.get(w.juror_id) ?? "unbekannt"}: ${w.kommentar}`)
            .join(" | "),
        };
      })
      // Beste zuerst, Unbewertete ans Ende
      .sort((a, b) => (b.schnitt ?? -1) - (a.schnitt ?? -1));

    return { zeilen, juroren, uebersicht };
  });

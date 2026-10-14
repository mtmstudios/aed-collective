/**
 * Prüft db/schema.sql gegen ein echtes PostgreSQL – ohne Server.
 *
 * PGlite ist Postgres als WebAssembly und läuft im Node-Prozess. Das Schema
 * wird eingespielt und anschließend werden die Abläufe durchgespielt, auf die
 * es ankommt: Einreichung anlegen, Jury-Zugang, Wertung, Kaskaden beim Löschen.
 *
 *   node scripts/db-pruefen.mjs
 */
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const db = new PGlite();

let fehler = 0;
const pruefe = (bezeichnung, bedingung, zusatz = "") => {
  if (bedingung) {
    console.log(`  ok    ${bezeichnung}`);
  } else {
    fehler += 1;
    console.log(`  FEHLT ${bezeichnung}${zusatz ? ` – ${zusatz}` : ""}`);
  }
};

console.log("Schema einspielen");
await db.exec(schema);
console.log("  ok    db/schema.sql läuft durch\n");

console.log("Einreichungen");
const e1 = await db.query(
  `INSERT INTO neuland_einreichungen (email, projekttitel, detailfotos)
   VALUES ($1, $2, $3::jsonb) RETURNING einreichungs_id, status, created_at`,
  ["test@example.org", "Prüfprojekt", JSON.stringify([{ path: "a.jpg", name: "a.jpg", size: 1 }])],
);
pruefe(
  "laufende Nummer wird vergeben",
  e1.rows[0].einreichungs_id === "NL27-001",
  e1.rows[0].einreichungs_id,
);
pruefe("Status beginnt als Entwurf", e1.rows[0].status === "entwurf");

const e2 = await db.query(
  `INSERT INTO neuland_einreichungen (email) VALUES ($1) RETURNING einreichungs_id`,
  ["zweite@example.org"],
);
pruefe("Nummer zählt hoch", e2.rows[0].einreichungs_id === "NL27-002", e2.rows[0].einreichungs_id);

await db.query(`UPDATE neuland_einreichungen SET status = 'eingereicht' WHERE email = $1`, [
  "test@example.org",
]);
const nachUpdate = await db.query(
  `SELECT updated_at > created_at AS angefasst FROM neuland_einreichungen WHERE email = $1`,
  ["test@example.org"],
);
pruefe("Trigger setzt updated_at", nachUpdate.rows[0].angefasst === true);

const perMail = await db.query(
  `SELECT count(*)::int AS n FROM neuland_einreichungen WHERE lower(email) = lower($1)`,
  ["TEST@Example.org"],
);
pruefe(
  "Suche über die Mailadresse ist unabhängig von Groß- und Kleinschreibung",
  perMail.rows[0].n === 1,
);

console.log("\nJurybereich");
const juror = await db.query(
  `INSERT INTO jury_zugaenge (name, email, rolle, passwort_hash)
   VALUES ($1, $2, $3, $4) RETURNING id, aktiv`,
  ["Testjuror", "Juror@example.org", "jury", "hash"],
);
pruefe("Zugang ist zunächst aktiv", juror.rows[0].aktiv === true);

let doppelt = false;
try {
  await db.query(`INSERT INTO jury_zugaenge (name, email) VALUES ($1, $2)`, [
    "Noch einer",
    "juror@example.org",
  ]);
} catch (f) {
  doppelt = String(f.message).includes("jury_zugaenge_email_idx");
}
pruefe("gleiche Mailadresse wird abgewiesen", doppelt);

let falscheRolle = false;
try {
  await db.query(`INSERT INTO jury_zugaenge (name, email, rolle) VALUES ($1, $2, $3)`, [
    "Fremd",
    "fremd@example.org",
    "verwaltung",
  ]);
} catch {
  falscheRolle = true;
}
pruefe("nur die beiden vorgesehenen Rollen sind erlaubt", falscheRolle);

const einreichungId = (
  await db.query(`SELECT id FROM neuland_einreichungen WHERE email = $1`, ["test@example.org"])
).rows[0].id;

await db.query(
  `INSERT INTO jury_wertungen (einreichung_id, juror_id, punkte, kommentar) VALUES ($1, $2, $3, $4)`,
  [einreichungId, juror.rows[0].id, 8, "solide"],
);

let zweiteWertung = false;
try {
  await db.query(
    `INSERT INTO jury_wertungen (einreichung_id, juror_id, punkte) VALUES ($1, $2, $3)`,
    [einreichungId, juror.rows[0].id, 5],
  );
} catch {
  zweiteWertung = true;
}
pruefe("je Juror nur eine Wertung pro Einreichung", zweiteWertung);

let punkteGrenze = false;
try {
  await db.query(
    `INSERT INTO jury_wertungen (einreichung_id, juror_id, punkte) VALUES ($1, $2, $3)`,
    [
      e2.rows[0].einreichungs_id ? einreichungId : einreichungId,
      (
        await db.query(
          `INSERT INTO jury_zugaenge (name, email) VALUES ('Zweiter', 'zweiter@example.org') RETURNING id`,
        )
      ).rows[0].id,
      11,
    ],
  );
} catch {
  punkteGrenze = true;
}
pruefe("Punkte außerhalb von 1 bis 10 werden abgewiesen", punkteGrenze);

const schnitt = await db.query(
  `SELECT round(avg(punkte), 2)::float AS schnitt, count(*)::int AS anzahl
   FROM jury_wertungen WHERE einreichung_id = $1`,
  [einreichungId],
);
pruefe(
  "Durchschnitt lässt sich berechnen",
  schnitt.rows[0].schnitt === 8 && schnitt.rows[0].anzahl === 1,
);

await db.query(`DELETE FROM jury_zugaenge WHERE id = $1`, [juror.rows[0].id]);
const nachLoeschen = await db.query(
  `SELECT count(*)::int AS n FROM jury_wertungen WHERE einreichung_id = $1`,
  [einreichungId],
);
pruefe("Wertungen verschwinden mit dem Zugang", nachLoeschen.rows[0].n === 0);

console.log("\nBildverzeichnis");
await db.query(
  `INSERT INTO bildrechte (pfad, dateiname, kategorie, verwendungen)
   VALUES ($1, $2, $3, $4)`,
  ["/bilder/event/a.webp", "a.webp", "event", ["startseite", "neuland"]],
);
const bild = await db.query(
  `SELECT status, verwendungen, urheber FROM bildrechte WHERE pfad = $1`,
  ["/bilder/event/a.webp"],
);
pruefe("Rechtestatus beginnt bei ungeklaert", bild.rows[0].status === "ungeklaert");
pruefe(
  "Verwendungen kommen als Liste zurück",
  Array.isArray(bild.rows[0].verwendungen) && bild.rows[0].verwendungen.length === 2,
);
pruefe("leere Textfelder sind leer, nicht null", bild.rows[0].urheber === "");

console.log("\nArtikel und Bilder");
const artikel = await db.query(`INSERT INTO articles (title) VALUES ('Probe') RETURNING id`);
const abschnitt = await db.query(
  `INSERT INTO sections (article_id, heading, "order") VALUES ($1, 'Einleitung', 1) RETURNING id`,
  [artikel.rows[0].id],
);
await db.query(
  `INSERT INTO images (article_id, image_url, section_id) VALUES ($1, '/bilder/x.webp', $2)`,
  [artikel.rows[0].id, abschnitt.rows[0].id],
);
await db.query(`DELETE FROM sections WHERE id = $1`, [abschnitt.rows[0].id]);
const bildOhneAbschnitt = await db.query(`SELECT section_id FROM images`);
pruefe("Bild überlebt den gelöschten Abschnitt", bildOhneAbschnitt.rows[0].section_id === null);

await db.query(`DELETE FROM articles WHERE id = $1`, [artikel.rows[0].id]);
const bilderUebrig = await db.query(`SELECT count(*)::int AS n FROM images`);
pruefe("Bilder verschwinden mit dem Artikel", bilderUebrig.rows[0].n === 0);

console.log(fehler === 0 ? "\nAlles durchgelaufen." : `\n${fehler} Prüfung(en) fehlgeschlagen.`);
await db.close();
process.exit(fehler === 0 ? 0 : 1);

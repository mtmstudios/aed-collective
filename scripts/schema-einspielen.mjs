/**
 * Spielt db/schema.sql in die Zieldatenbank ein.
 *
 * Zugangsdaten kommen aus der Umgebung (PGHOST, PGUSER, PGPASSWORD,
 * PGDATABASE, PGPORT). Liegt im Projekt eine Datei .env.hetzner, werden die
 * Werte von dort gelesen – praktisch beim Einrichten.
 *
 * Der Hostname einer frisch angelegten Hetzner-Datenbank löst erst nach
 * einigen Minuten auf. Deshalb wartet das Skript geduldig, statt abzubrechen.
 *
 *   node scripts/schema-einspielen.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.hetzner")) {
  for (const zeile of readFileSync(".env.hetzner", "utf8").split("\n")) {
    const treffer = zeile.match(/^(PG[A-Z]+)=(.*)$/);
    if (treffer && !process.env[treffer[1]]) process.env[treffer[1]] = treffer[2];
  }
}

const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const schema = readFileSync("db/schema.sql", "utf8");
const VERSUCHE = Number(process.env["VERSUCHE"] ?? 60);

for (let versuch = 1; versuch <= VERSUCHE; versuch++) {
  const client = new pg.Client({ connectionTimeoutMillis: 8000 });
  try {
    await client.connect();
    console.log(`Verbunden (Versuch ${versuch}).`);
    await client.query(schema);

    const tabellen = await client.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' ORDER BY table_name`,
    );
    const version = await client.query("SELECT version()");
    console.log(version.rows[0].version.split(",")[0]);
    console.log("Tabellen: " + tabellen.rows.map((r) => r.table_name).join(", "));
    await client.end();
    process.exit(0);
  } catch (fehler) {
    await client.end().catch(() => {});
    if (versuch % 5 === 0 || versuch === 1) {
      console.log(`Versuch ${versuch}: ${fehler.message}`);
    }
    await schlaf(20000);
  }
}
console.log("Datenbank blieb unerreichbar.");
process.exit(1);

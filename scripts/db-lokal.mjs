/**
 * Startet eine PostgreSQL-Datenbank zum Entwickeln – ohne Installation.
 *
 * PGlite ist Postgres als WebAssembly; dieser Server stellt es über einen
 * TCP-Port bereit, sodass sich die Anwendung mit dem gewöhnlichen Treiber
 * verbinden kann. Die Daten liegen in .pglite/ und bleiben erhalten.
 *
 *   node scripts/db-lokal.mjs
 *   DATABASE_URL=postgres://postgres:postgres@127.0.0.1:55432/postgres npm run dev
 *
 * Für den Echtbetrieb ist das nichts – dort steht eine richtige Datenbank.
 */
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = Number(process.env["PGLITE_PORT"] ?? 55432);
const ABLAGE = process.env["PGLITE_ABLAGE"] ?? "./.pglite";

const db = await PGlite.create({ dataDir: ABLAGE });
await db.exec(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));

const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1" });
await server.start();

console.log(`Datenbank bereit: postgres://postgres:postgres@127.0.0.1:${PORT}/postgres`);
console.log(`Daten liegen in ${ABLAGE}`);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await server.stop();
    await db.close();
    process.exit(0);
  });
}

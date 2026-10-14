import { Pool, types, type PoolClient } from "pg";

/*
 * Zeitwerte kommen als Zeichenkette zurück, nicht als Date.
 *
 * Supabase lieferte ISO-Zeitstempel, und darauf bauen die Typen und die
 * Anzeige im Jurybereich und im Bildverzeichnis auf. Ohne diese Einstellung
 * gäbe der Treiber Date-Objekte zurück, die beim Weg durch die Serverfunktionen
 * ihre Form verlieren.
 */
types.setTypeParser(1184, (wert) => new Date(wert).toISOString()); // timestamptz
types.setTypeParser(1114, (wert) => new Date(`${wert}Z`).toISOString()); // timestamp
types.setTypeParser(1082, (wert) => wert); // date bleibt YYYY-MM-DD

/**
 * Zugang zur PostgreSQL-Datenbank.
 *
 * Nötige Umgebungsvariable:
 *   DATABASE_URL   postgres://benutzer:passwort@host:5432/datenbank
 *
 * Optional:
 *   DATABASE_SSL   "1" oder "require", wenn der Datenbankserver eine
 *                  verschlüsselte Verbindung verlangt
 *
 * Bei Hetzner liegt die Datenbank auf einem eigenen Server, nicht auf
 * localhost – den Hostnamen zeigt konsoleH in der Datenbankübersicht an.
 *
 * Dieses Modul gehört ausschließlich auf den Server. Es wird wie der frühere
 * Supabase-Client erst innerhalb der Handler geladen:
 *   const { abfrage } = await import("@/lib/db.server");
 */

let pool: Pool | undefined;

function verbindung(): Pool {
  if (pool) return pool;

  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error("DATABASE_URL fehlt. Ohne sie gibt es keine Verbindung zur Datenbank.");
  }

  const ssl = process.env["DATABASE_SSL"];
  pool = new Pool({
    connectionString: url,
    // Hetzner stellt ein eigenes Zertifikat aus; die Prüfung gegen die
    // öffentlichen Wurzelzertifikate schlägt deshalb fehl.
    ssl: ssl === "1" || ssl === "require" ? { rejectUnauthorized: false } : undefined,
    // Geteiltes Hosting: lieber wenige Verbindungen offen halten.
    max: 4,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  });

  // Ein Fehler auf einer ruhenden Verbindung darf den Serverprozess nicht
  // mitreißen – die nächste Anfrage baut eine neue auf.
  pool.on("error", (fehler) => {
    console.error("[DB] Verbindung im Leerlauf verloren:", fehler.message);
  });

  return pool;
}

/** Führt eine Abfrage aus und gibt die Zeilen zurück. */
export async function abfrage<T = Record<string, unknown>>(
  sql: string,
  werte: readonly unknown[] = [],
): Promise<T[]> {
  const ergebnis = await verbindung().query(sql, werte as unknown[]);
  return ergebnis.rows as T[];
}

/** Wie abfrage, gibt aber nur die erste Zeile zurück – oder null. */
export async function eineZeile<T = Record<string, unknown>>(
  sql: string,
  werte: readonly unknown[] = [],
): Promise<T | null> {
  const zeilen = await abfrage<T>(sql, werte);
  return zeilen[0] ?? null;
}

/** Zahl der betroffenen Zeilen, etwa nach UPDATE oder DELETE. */
export async function ausfuehren(sql: string, werte: readonly unknown[] = []): Promise<number> {
  const ergebnis = await verbindung().query(sql, werte as unknown[]);
  return ergebnis.rowCount ?? 0;
}

/**
 * Mehrere Schritte als eine Einheit. Wirft der Rumpf, wird alles zurückgerollt.
 */
export async function transaktion<T>(rumpf: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await verbindung().connect();
  try {
    await client.query("BEGIN");
    const ergebnis = await rumpf(client);
    await client.query("COMMIT");
    return ergebnis;
  } catch (fehler) {
    await client.query("ROLLBACK").catch(() => {});
    throw fehler;
  } finally {
    client.release();
  }
}

/**
 * Baut aus einem Objekt die SET-Liste eines UPDATE.
 *
 *   const { sql, werte } = setzliste({ status: "geklaert", notiz: "" });
 *   await ausfuehren(`UPDATE bildrechte SET ${sql} WHERE pfad = $${werte.length + 1}`,
 *                    [...werte, pfad]);
 *
 * Die Feldnamen stammen aus dem Code, nicht aus Benutzereingaben; die Werte
 * gehen als Parameter an die Datenbank.
 */
export function setzliste(
  werte: Record<string, unknown>,
  ab = 1,
): { sql: string; werte: unknown[] } {
  const felder = Object.keys(werte);
  return {
    sql: felder.map((feld, i) => `"${feld}" = $${ab + i}`).join(", "),
    werte: felder.map((feld) => werte[feld]),
  };
}

/**
 * Fügt mehrere Zeilen mit einem Befehl ein. Leere Listen tun nichts.
 */
export async function einfuegeViele(
  tabelle: string,
  spalten: readonly string[],
  zeilen: readonly Record<string, unknown>[],
): Promise<number> {
  if (zeilen.length === 0) return 0;

  const werte: unknown[] = [];
  const platzhalter = zeilen.map((zeile) => {
    const stelle = spalten.map((spalte) => {
      werte.push(zeile[spalte] ?? null);
      return `$${werte.length}`;
    });
    return `(${stelle.join(", ")})`;
  });

  return ausfuehren(
    `INSERT INTO ${tabelle} (${spalten.map((s) => `"${s}"`).join(", ")})
     VALUES ${platzhalter.join(", ")}`,
    werte,
  );
}

/**
 * Sagt, ob ein Datenbankfehler eine verletzte Eindeutigkeit ist – und welche.
 * Damit lassen sich lesbare Meldungen bilden, statt den Rohtext zu zeigen.
 */
export function istDoppelt(fehler: unknown, index?: string): boolean {
  const code = (fehler as { code?: string } | null)?.code;
  if (code !== "23505") return false;
  if (!index) return true;
  const detail = String((fehler as { constraint?: string }).constraint ?? "");
  return detail.includes(index);
}

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, resolve, extname } from "node:path";

/**
 * Ablage für hochgeladene Dateien – die Bilder der neuland-Einreichungen.
 *
 * Früher lagen sie in einem geschlossenen Supabase-Bucket, jetzt im Dateisystem
 * des Servers. Nach außen sichtbar werden sie nur über kurzlebige, signierte
 * Links; das Verzeichnis selbst liegt außerhalb des öffentlichen Ordners.
 *
 * Umgebungsvariable:
 *   DATEI_ABLAGE   Verzeichnis für die Dateien, voreingestellt ./dateien
 *
 * Auf dem Server muss das Verzeichnis außerhalb von public/ liegen und in die
 * Datensicherung aufgenommen werden – hier liegen die Einreichungen.
 */

const ERLAUBTE_ENDUNGEN = new Set([".jpg", ".jpeg", ".png"]);
const TYP_NACH_ENDUNG: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

function wurzel(): string {
  return resolve(process.env["DATEI_ABLAGE"] ?? "./dateien");
}

function geheimnis(): string {
  const wert = process.env["SITE_PASSWORD"];
  if (!wert) throw new Error("SITE_PASSWORD ist nicht gesetzt");
  return wert;
}

/**
 * Lässt nur Namen durch, die diese Anwendung selbst vergeben hat.
 * Damit kann kein Pfad aus dem Ablageverzeichnis herausführen.
 */
function istHarmlos(pfad: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/.test(pfad) && !pfad.includes("..");
}

/** Erzeugt einen neuen Dateinamen aus einer zufälligen Kennung. */
export function neuerDateiname(ursprung: string): string {
  const endung = extname(ursprung).toLowerCase();
  if (!ERLAUBTE_ENDUNGEN.has(endung)) throw new Error("Nur JPG oder PNG sind erlaubt.");
  return `${randomUUID()}${endung}`;
}

/** Schreibt eine Datei in die Ablage. */
export async function speichereDatei(pfad: string, daten: Buffer): Promise<void> {
  if (!istHarmlos(pfad)) throw new Error("Unzulässiger Dateiname");
  await mkdir(wurzel(), { recursive: true });
  await writeFile(join(wurzel(), pfad), daten);
}

/** Liest eine Datei aus der Ablage, oder null, wenn es sie nicht gibt. */
export async function leseDatei(pfad: string): Promise<{ daten: Buffer; typ: string } | null> {
  if (!istHarmlos(pfad)) return null;
  const voll = join(wurzel(), pfad);
  try {
    await stat(voll);
  } catch {
    return null;
  }
  return {
    daten: await readFile(voll),
    typ: TYP_NACH_ENDUNG[extname(pfad).toLowerCase()] ?? "application/octet-stream",
  };
}

function signatur(pfad: string, ablauf: number): string {
  return createHmac("sha256", geheimnis()).update(`${pfad}.${ablauf}`).digest("base64url");
}

/**
 * Baut einen Link, der nur begrenzte Zeit gilt – der Ersatz für die signierten
 * URLs des Buckets. Voreinstellung: eine Stunde, wie bisher.
 */
export function signierterLink(pfad: string, sekunden = 3600): string {
  const ablauf = Date.now() + sekunden * 1000;
  const parameter = new URLSearchParams({
    p: pfad,
    exp: String(ablauf),
    sig: signatur(pfad, ablauf),
  });
  return `/api/datei?${parameter.toString()}`;
}

/** Prüft einen solchen Link. */
export function linkGueltig(pfad: string, ablauf: string, sig: string): boolean {
  const zeit = Number(ablauf);
  if (!Number.isFinite(zeit) || zeit < Date.now()) return false;
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(signatur(pfad, zeit), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

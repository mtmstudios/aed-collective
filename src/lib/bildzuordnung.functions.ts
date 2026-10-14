import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, timingSafeEqual } from "node:crypto";

export type ArtikelRow = { id: string; title: string };
export type SectionRow = { id: string; heading: string; order: number };
export type ImageRow = {
  id: string;
  source_url: string;
  image_url: string;
  section_id: string | null;
  order_in_section: number;
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

async function db() {
  return import("@/lib/db.server");
}

/** Liste aller Artikel (für die Auswahl oben auf der Seite). */
export const ladeArtikel = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string }) => input)
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const { abfrage } = await db();
    const artikel = await abfrage<ArtikelRow>(`SELECT id, title FROM articles ORDER BY created_at`);
    return { artikel };
  });

/** Abschnitte und Bilder eines Artikels. */
export const ladeZuordnung = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string; artikelId: string }) => input)
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const { abfrage } = await db();

    const sections = await abfrage<SectionRow>(
      `SELECT id, heading, "order" FROM sections WHERE article_id = $1 ORDER BY "order"`,
      [data.artikelId],
    );

    const images = await abfrage<ImageRow>(
      `SELECT id, source_url, image_url, section_id, order_in_section
       FROM images WHERE article_id = $1 ORDER BY order_in_section`,
      [data.artikelId],
    );

    return { sections, images };
  });

const zugSchema = z.object({
  passwort: z.string(),
  bildId: z.string().uuid(),
  sectionId: z.string().uuid().nullable(),
  /** Zielposition innerhalb des Abschnitts (0 = ganz vorn). */
  position: z.number().int().min(0),
});

/** Verschiebt ein Bild in einen Abschnitt (oder zurück) und ordnet die Reihenfolge neu. */
export const verschiebeBild = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => zugSchema.parse(input))
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const { transaktion } = await db();

    // Verschieben und Neunummerieren gehören zusammen: bricht etwas ab, soll
    // keine halbe Reihenfolge zurückbleiben.
    await transaktion(async (client) => {
      const bild = (
        await client.query<{ id: string; article_id: string; section_id: string | null }>(
          `SELECT id, article_id, section_id FROM images WHERE id = $1`,
          [data.bildId],
        )
      ).rows[0];
      if (!bild) throw new Error("Bild nicht gefunden");

      await client.query(`UPDATE images SET section_id = $1, order_in_section = 0 WHERE id = $2`, [
        data.sectionId,
        data.bildId,
      ]);

      // Betroffene Abschnitte neu durchnummerieren
      const betroffen = [bild.section_id, data.sectionId].filter(
        (v, i, arr) => arr.indexOf(v) === i,
      );

      for (const sid of betroffen) {
        const liste = await client.query<{ id: string }>(
          `SELECT id FROM images
           WHERE article_id = $1 AND section_id IS NOT DISTINCT FROM $2
           ORDER BY order_in_section, created_at`,
          [bild.article_id, sid],
        );

        let ids = liste.rows.map((r) => r.id);
        if (sid === data.sectionId) {
          ids = ids.filter((id) => id !== data.bildId);
          ids.splice(Math.min(data.position, ids.length), 0, data.bildId);
        }
        for (let i = 0; i < ids.length; i++) {
          await client.query(`UPDATE images SET order_in_section = $1 WHERE id = $2`, [
            i + 1,
            ids[i]!,
          ]);
        }
      }
    });

    return { ok: true as const };
  });

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
  const a = createHash("sha256").update(input ?? "", "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Liste aller Artikel (für die Auswahl oben auf der Seite). */
export const ladeArtikel = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string }) => input)
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const db = await admin();
    const { data: rows, error } = await db
      .from("articles")
      .select("id, title")
      .order("created_at");
    if (error) throw new Error(error.message);
    return { artikel: (rows ?? []) as ArtikelRow[] };
  });

/** Abschnitte und Bilder eines Artikels. */
export const ladeZuordnung = createServerFn({ method: "POST" })
  .inputValidator((input: { passwort: string; artikelId: string }) => input)
  .handler(async ({ data }) => {
    if (!passwortOk(data.passwort)) throw new Error("Falsches Passwort");
    const db = await admin();

    const { data: sections, error: sErr } = await db
      .from("sections")
      .select("id, heading, order")
      .eq("article_id", data.artikelId)
      .order("order");
    if (sErr) throw new Error(sErr.message);

    const { data: images, error: iErr } = await db
      .from("images")
      .select("id, source_url, image_url, section_id, order_in_section")
      .eq("article_id", data.artikelId)
      .order("order_in_section");
    if (iErr) throw new Error(iErr.message);

    return {
      sections: (sections ?? []) as SectionRow[],
      images: (images ?? []) as ImageRow[],
    };
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
    const db = await admin();

    const { data: bild, error: bErr } = await db
      .from("images")
      .select("id, article_id, section_id")
      .eq("id", data.bildId)
      .maybeSingle();
    if (bErr) throw new Error(bErr.message);
    if (!bild) throw new Error("Bild nicht gefunden");

    const { error: uErr } = await db
      .from("images")
      .update({ section_id: data.sectionId, order_in_section: 0 })
      .eq("id", data.bildId);
    if (uErr) throw new Error(uErr.message);

    // Betroffene Abschnitte neu durchnummerieren
    const betroffen = [bild.section_id, data.sectionId].filter(
      (v, i, arr) => arr.indexOf(v) === i,
    );

    for (const sid of betroffen) {
      let query = db
        .from("images")
        .select("id")
        .eq("article_id", bild.article_id)
        .order("order_in_section")
        .order("created_at");
      query = sid === null ? query.is("section_id", null) : query.eq("section_id", sid);
      const { data: liste, error } = await query;
      if (error) throw new Error(error.message);

      let ids = (liste ?? []).map((r) => r.id);
      if (sid === data.sectionId) {
        ids = ids.filter((id) => id !== data.bildId);
        ids.splice(Math.min(data.position, ids.length), 0, data.bildId);
      }
      for (let i = 0; i < ids.length; i++) {
        const { error: e } = await db
          .from("images")
          .update({ order_in_section: i + 1 })
          .eq("id", ids[i]!);
        if (e) throw new Error(e.message);
      }
    }

    return { ok: true as const };
  });

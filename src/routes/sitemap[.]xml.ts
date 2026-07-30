import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { events, beirat, vorstand } from "@/data/site";
import { jahrgaenge, projekte } from "@/data/neuland";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/programm", changefreq: "weekly", priority: "0.9" },
          { path: "/verein", changefreq: "monthly", priority: "0.8" },
          { path: "/verein/vorstand", changefreq: "yearly", priority: "0.5" },
          { path: "/verein/beirat", changefreq: "yearly", priority: "0.5" },
          { path: "/verein/satzung", changefreq: "yearly", priority: "0.3" },
          { path: "/mitglied-werden", changefreq: "monthly", priority: "0.9" },
          { path: "/mitglieder", changefreq: "monthly", priority: "0.5" },
          { path: "/referenten", changefreq: "monthly", priority: "0.5" },
          { path: "/service", changefreq: "monthly", priority: "0.5" },
          { path: "/kontakt", changefreq: "yearly", priority: "0.6" },
          { path: "/impressum", changefreq: "yearly", priority: "0.2" },
          { path: "/datenschutz", changefreq: "yearly", priority: "0.2" },
          { path: "/neuland", changefreq: "weekly", priority: "0.9" },
          { path: "/neuland/wettbewerb", changefreq: "monthly", priority: "0.8" },
          { path: "/neuland/teilnahme", changefreq: "monthly", priority: "0.8" },
          { path: "/neuland/gewinner", changefreq: "monthly", priority: "0.8" },
          { path: "/neuland/jury", changefreq: "monthly", priority: "0.6" },
          { path: "/neuland/presse", changefreq: "monthly", priority: "0.4" },
          ...events.map((e) => ({ path: `/programm/${e.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...jahrgaenge.map((j) => ({ path: `/neuland/gewinner/${j}`, changefreq: "yearly" as const, priority: "0.7" })),
          ...projekte.map((p) => ({
            path: `/neuland/gewinner/${p.jahr}/${p.slug}`,
            changefreq: "yearly" as const,
            priority: "0.6",
          })),
          ...vorstand.map((p) => ({
            path: `/verein/vorstand/${p.slug}`,
            changefreq: "yearly" as const,
            priority: "0.5",
          })),
          ...beirat.map((p) => ({
            path: `/verein/beirat/${p.slug}`,
            changefreq: "yearly" as const,
            priority: "0.5",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://screenflow26.netlify.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: SitemapEntry[] = [
          {
            path: "/",
            lastmod: today,
            changefreq: "weekly",
            priority: "1.0",
          },
          {
            path: "/screen-recorder",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.9",
          },
          {
            path: "/video-recorder",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.9",
          },
          {
            path: "/free-screen-recorder",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.9",
          },
          {
            path: "/online-screen-recorder",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.9",
          },
          {
            path: "/4k-screen-recorder",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/webcam-recorder",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/guides/how-to-record-your-screen",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.7",
          },
          {
            path: "/guides/best-free-screen-recorders",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.7",
          },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
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

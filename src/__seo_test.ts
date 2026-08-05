import type {} from "@tanstack/react-router";

type SeoMetaEntry = {
  title?: string;
  name?: string;
  content?: string;
  "script:ld+json"?: Record<string, unknown>;
};

function seoMeta(page: { title: string; description: string; faqs: string[] }): SeoMetaEntry[] {
  const jsonLd: Record<string, unknown>[] = [{ "@context": "https://schema.org", "@type": "BreadcrumbList" }];
  return [
    { title: page.title },
    { name: "description", content: page.description },
    ...jsonLd.map((data) => ({ "script:ld+json": data })),
  ];
}

declare const head: (ctx: {}) => { meta?: Array<import("react").JSX.IntrinsicElements["meta"] | undefined> };

head({ meta: seoMeta({ title: "T", description: "D", faqs: [] }) });

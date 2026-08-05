export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoPageData {
  title: string;
  description: string;
  path: string;
  breadcrumbName: string;
  faqs?: SeoFaq[];
}

const SITE = "https://screenflow26.netlify.app";

type SeoMetaEntry = {
  title?: string;
  name?: string;
  content?: string;
  "script:ld+json"?: Record<string, unknown>;
};

export function seoMeta(page: SeoPageData): SeoMetaEntry[] {
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: page.breadcrumbName, item: `${SITE}${page.path}` },
      ],
    },
  ];

  if (page.faqs && page.faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return [
    { title: page.title },
    { name: "description", content: page.description },
    ...jsonLd.map((data) => ({ "script:ld+json": data })),
  ];
}

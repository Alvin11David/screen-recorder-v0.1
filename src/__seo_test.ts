import type {} from "@tanstack/react-router";

function seoMeta() {
  return [
    { title: "Foo" },
    { name: "description", content: "bar" },
    { "script:ld+json": { "@context": "https://schema.org", "@type": "BreadcrumbList" } },
  ];
}

declare const head: (ctx: {}) => { meta?: Array<import("react").JSX.IntrinsicElements["meta"] | undefined> };

head({ meta: seoMeta() });

const a = { "script:ld+json": { "@context": "https://schema.org", "@type": "Thing" } };
const arr: Array<import("react").JSX.IntrinsicElements["meta"] | undefined> = [a];

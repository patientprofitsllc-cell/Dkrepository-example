import { faqs } from "@/lib/content";

export const siteUrl = (process.env.APP_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

// Only facts already published in the client's own materials are used here:
// no street address, ratings, prices or opening hours are asserted.
export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: "DK Group",
      url: siteUrl,
      telephone: "+1-678-684-7341",
      email: "service@dmkentityllcflip.com",
      sameAs: ["https://www.instagram.com/dk_investor1/"],
      areaServed: {
        "@type": "City",
        name: "Columbus",
        containedInPlace: { "@type": "State", name: "Georgia" },
      },
      subOrganization: [
        {
          "@type": "Organization",
          name: "DMK Home Improvement LLC",
          url: `${siteUrl}/dumpster-rentals`,
          email: "service@dmkentityllcflip.com",
        },
        {
          "@type": "Organization",
          name: "DK Entity LLC",
          url: `${siteUrl}/sell-your-property`,
          email: "investor@dkentityllcflip.com",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "DK Group",
      publisher: { "@id": `${siteUrl}/#org` },
      inLanguage: "en-US",
    },
  ],
};

export function breadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${siteUrl}${path}`,
      },
    ],
  };
}

export function serviceSchema(name: string, path: string, provider: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    url: `${siteUrl}${path}`,
    provider: { "@type": "Organization", name: provider },
    areaServed: { "@type": "City", name: "Columbus, Georgia" },
  };
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

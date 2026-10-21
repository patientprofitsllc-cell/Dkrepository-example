import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/dumpster-rentals",
    "/sell-your-property",
    "/homeowner-solutions",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ].map((p) => ({
    url: `${process.env.APP_URL || "http://localhost:3000"}${p}`,
  }));
}

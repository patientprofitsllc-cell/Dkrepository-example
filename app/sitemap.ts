import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/schema";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/dumpster-rentals", 0.9],
    ["/sell-your-property", 0.9],
    ["/homeowner-solutions", 0.9],
    ["/contact", 0.8],
    ["/about", 0.7],
    ["/faq", 0.7],
    ["/privacy", 0.3],
    ["/terms", 0.3],
  ];
  return pages.map(([p, priority]) => ({ url: `${siteUrl}${p}`, priority }));
}

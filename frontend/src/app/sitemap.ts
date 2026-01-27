import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function getSlugs(endpoint: string, slugField = "slug"): Promise<string[]> {
  try {
    const url = new URL(`${strapiUrl}${endpoint}`);
    url.searchParams.set("pagination[pageSize]", "100");
    url.searchParams.set("fields[0]", slugField);

    const r = await fetch(url.toString(), { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();

    // Strapi v4/v5 list: j.data = [{ attributes: { slug } }]
    return (j?.data || [])
      .map((x: any) => x?.attributes?.[slugField] ?? x?.[slugField])
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = ["", "/cv", "/blog", "/articulos", "/proyectos"].map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: now,
  }));

  const [articleSlugs, blogSlugs, projectSlugs] = await Promise.all([
    getSlugs("/api/articles"),
    getSlugs("/api/postes"),   // tu blog (postes)
    getSlugs("/api/projects"),
  ]);

  const dynamicRoutes = [
    ...articleSlugs.map((s) => ({ url: `${siteUrl}/articulos/${s}`, lastModified: now })),
    ...blogSlugs.map((s) => ({ url: `${siteUrl}/blog/${s}`, lastModified: now })),
    ...projectSlugs.map((s) => ({ url: `${siteUrl}/proyectos/${s}`, lastModified: now })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}

export const STRAPI = {
  POSTS: "/api/post", // <-- cambia esto al endpoint que te funcione
  ARTICLES: "/api/articles",
  PROJECTS: "/api/projects",
  ABOUT: "/api/about",
};

type FetchOpts = {
  path: string;
  locale?: "es" | "en";
  populate?: string; // e.g. '*'
  query?: Record<string, string>;
};

export async function strapiFetch<T>({
  path,
  locale = "es",
  populate = "*",
  query = {},
}: FetchOpts): Promise<T> {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("Falta NEXT_PUBLIC_STRAPI_URL en .env.local");

  const u = new URL(`${base}${path}`);
  u.searchParams.set("locale", locale);
  if (populate) u.searchParams.set("populate", populate);
  for (const [k, v] of Object.entries(query)) u.searchParams.set(k, v);

  const res = await fetch(u.toString(), {
  headers: {
    "Strapi-Response-Format": "v4",
  },
  cache: "no-store",
  });

  if (!res.ok) {
  const body = await res.text().catch(() => "");
  throw new Error(`Strapi error ${res.status} on ${path}: ${body}`);
  }

  return (await res.json()) as T;
}


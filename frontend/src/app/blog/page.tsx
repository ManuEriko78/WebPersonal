export const metadata = { title: "Blog" };

import Link from "next/link";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

type Post = {
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
};

type List = { data: Array<{ id: number; attributes: Post }> };

export default async function BlogPage() {
  const url = new URL(`${strapiUrl}/api/postes`);
  url.searchParams.set("populate", "*");
  url.searchParams.set("sort", "publishedAt:desc");
  url.searchParams.set("pagination[pageSize]", "50");

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  const res: List = await r.json();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-3 text-lg text-gray-600">
        Posts personales (ideas, aprendizajes y experiencias).
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {res.data.map((p) => {
          const a = p.attributes;
          return (
            <Link
              key={p.id}
              href={`/blog/${a.slug}`}
              className="rounded-2xl border p-5 transition hover:shadow-sm"
            >
              <h2 className="text-2xl font-semibold">{a.title}</h2>
              {a.excerpt && <p className="mt-2 text-gray-700">{a.excerpt}</p>}
              {a.publishedAt && (
                <p className="mt-3 text-sm text-gray-500">
                  {new Date(a.publishedAt).toLocaleDateString("es-ES")}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

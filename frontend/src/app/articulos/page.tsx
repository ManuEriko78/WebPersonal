"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ListV4<T> = { data: Array<{ id: number; attributes: T }> };

type Article = {
  title: string;
  slug: string;
  excerpt?: string | null;
  category: "informatica" | "redes" | "proyectos";
  publishedAt?: string;
};

const CATS = [
  { key: "informatica", label: "Informática" },
  { key: "redes", label: "Redes" },
  { key: "proyectos", label: "Proyectos" },
] as const;

function buildUrl(cat: string | null) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("Falta NEXT_PUBLIC_STRAPI_URL en .env.local");

  const url = new URL(`${base}/api/articles`);
  url.searchParams.set("locale", "es");
  url.searchParams.set("populate", "*");
  url.searchParams.set("sort", "publishedAt:desc");
  url.searchParams.set("pagination[pageSize]", "50");

  if (cat && ["informatica", "redes", "proyectos"].includes(cat)) {
    url.searchParams.set("filters[category][$eq]", cat);
  }

  return url.toString();
}

export default function ArticulosPage() {
  const sp = useSearchParams();
  const cat = (sp.get("cat") || "").toLowerCase();

  const [items, setItems] = useState<ListV4<Article> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const url = useMemo(() => buildUrl(cat || null), [cat]);

  useEffect(() => {
    let alive = true;
    setError(null);
    setItems(null);

    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((json) => alive && setItems(json))
      .catch((e) => alive && setError(String(e)));

    return () => {
      alive = false;
    };
  }, [url]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Artículos</h1>
      <p className="mt-3 text-lg text-gray-600">Informática, redes y proyectos.</p>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/articulos"
          className={`rounded-xl border px-3 py-1.5 text-sm transition ${
            !cat ? "border-blue-300 text-blue-700" : "hover:border-blue-200"
          }`}
        >
          Todos
        </Link>

        {CATS.map((c) => (
          <Link
            key={c.key}
            href={`/articulos?cat=${c.key}`}
            className={`rounded-xl border px-3 py-1.5 text-sm transition ${
              cat === c.key ? "border-blue-300 text-blue-700" : "hover:border-blue-200"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Estados */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error cargando artículos: {error}
        </div>
      )}

      {!items && !error && <p className="mt-6 text-gray-600">Cargando…</p>}

      {/* Lista */}
      {items && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.data.map((a) => (
            <Link
              key={a.id}
              href={`/articulos/${a.attributes.slug}`}
              className="rounded-2xl border p-5 hover:shadow-sm transition"
            >
              <div className="text-xs uppercase tracking-wide text-blue-700">
                {a.attributes.category}
              </div>

              <h2 className="mt-2 text-xl font-semibold">{a.attributes.title}</h2>

              {a.attributes.excerpt && (
                <p className="mt-2 text-gray-700">{a.attributes.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

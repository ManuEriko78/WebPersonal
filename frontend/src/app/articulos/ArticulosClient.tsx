"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Article = {
  title: string;
  slug: string | null;
  category?: string | null;
  excerpt?: string | null;
  cover?: {
    url?: string;
    formats?: {
      small?: { url?: string };
      medium?: { url?: string };
      thumbnail?: { url?: string };
    };
  } | null;
};

type ListV5<T> = { data: Array<T> };

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Mapeo de querystring -> valor real en Strapi (según tu JSON)
const CAT_MAP: Record<string, string> = {
  informatica: "Informática",
  redes: "Redes",
  proyectos: "Proyectos",
};

export default function ArticulosClient() {
  const searchParams = useSearchParams();
  const catParam = (searchParams.get("cat") || "").toLowerCase();

  const catForStrapi = useMemo(() => {
    return CAT_MAP[catParam] || "";
  }, [catParam]);

  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const url = new URL(`${strapiUrl}/api/articles`);
        url.searchParams.set("populate", "*");
        url.searchParams.set("sort", "publishedAt:desc");

        // Si hay categoría, filtramos por el valor EXACTO que tiene en Strapi
        if (catForStrapi) {
          url.searchParams.set("filters[category][$eq]", catForStrapi);
        }

        const r = await fetch(url.toString(), { cache: "no-store" });
        const json = await r.json();

        if (!r.ok) {
          throw new Error(
            json?.error?.message || `Error ${r.status} al cargar artículos`
          );
        }

        const data: Article[] = (json?.data || []) as Article[];

        if (!cancelled) setItems(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Error cargando artículos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [catForStrapi]);

  // helper para formar URL absoluta de imagen
  function imgUrl(a: Article) {
    const u =
      a.cover?.formats?.medium?.url ||
      a.cover?.formats?.small?.url ||
      a.cover?.formats?.thumbnail?.url ||
      a.cover?.url;

    if (!u) return null;
    return u.startsWith("http") ? u : `${strapiUrl}${u}`;
  }

  return (
    <div className="mt-8">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Link className="text-blue-700 hover:underline" href="/articulos">
          Todas
        </Link>
        <Link
          className="text-blue-700 hover:underline"
          href="/articulos?cat=informatica"
        >
          Informática
        </Link>
        <Link
          className="text-blue-700 hover:underline"
          href="/articulos?cat=redes"
        >
          Redes
        </Link>
        <Link
          className="text-blue-700 hover:underline"
          href="/articulos?cat=proyectos"
        >
          Proyectos
        </Link>
      </div>

      <div className="mt-6 text-gray-700">
        Categoría actual:{" "}
        <b>{catForStrapi ? catForStrapi : "todas"}</b>
      </div>

      {/* Estado */}
      {loading && <div className="mt-8 text-gray-600">Cargando…</div>}
      {err && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      {/* Lista */}
      {!loading && !err && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((a, i) => {
            const cover = imgUrl(a);

            return (
              <article
                key={i}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                {cover && (
                  <img
                    src={cover}
                    alt={a.title}
                    className="mb-4 h-40 w-full rounded-xl object-cover"
                  />
                )}

                <div className="text-xs uppercase tracking-wide text-blue-700">
                  {a.category || "Sin categoría"}
                </div>

                <h2 className="mt-2 text-xl font-semibold leading-snug">
                  {a.slug ? (
                    <Link className="hover:underline" href={`/articulos/${a.slug}`}>
                      {a.title}
                    </Link>
                  ) : (
                    <span title="Falta slug en Strapi">{a.title}</span>
                  )}
                </h2>

                {a.excerpt && (
                  <p className="mt-3 text-gray-700">{a.excerpt}</p>
                )}

                {!a.slug && (
                  <p className="mt-3 text-sm text-amber-700">
                    ⚠️ Este artículo no tiene <b>slug</b>. Rellénalo en Strapi para
                    poder abrirlo.
                  </p>
                )}
              </article>
            );
          })}

          {items.length === 0 && (
            <div className="text-gray-600">
              No hay artículos para esta categoría.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

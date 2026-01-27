import Link from "next/link";
import { strapiFetch } from "@/lib/strapi";
export const metadata = { title: "Proyectos" };

type ListV4<T> = { data: Array<{ id: number; attributes: T }> };

type Project = {
  title: string;
  slug: string;
  description?: string | null;
  tags?: string[] | null;
  repoUrl?: string | null;
  demoUrl?: string | null; // aunque no uses demo, si existe no molesta
  order?: number | null;
};

export default async function ProyectosPage() {
  // OJO: si tu endpoint no es /api/projects, lo cambiamos como "postes"
  const res = await strapiFetch<ListV4<Project>>({
    path: "/api/projects",
    locale: "es",
    populate: "*",
    query: { sort: "order:asc,createdAt:desc", "pagination[pageSize]": "50" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Proyectos</h1>
      <p className="mt-3 text-lg text-gray-600">
        Aplicaciones y proyectos personales (con enlaces, sin demos).
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {res.data.map((p) => {
          const a = p.attributes;
          return (
            <div key={p.id} className="rounded-2xl border p-5 hover:shadow-sm transition">
              <h2 className="text-2xl font-semibold">{a.title}</h2>

              {a.description && (
                <p className="mt-2 text-gray-700">{a.description}</p>
              )}

              {a.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.tags.map((t, i) => (
                    <span key={i} className="rounded-xl border px-2.5 py-1 text-sm text-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {a.repoUrl && (
                  <a className="text-blue-700 hover:underline" href={a.repoUrl} target="_blank">
                    GitHub / Repo
                  </a>
                )}
                {a.demoUrl && (
                  <a className="text-blue-700 hover:underline" href={a.demoUrl} target="_blank">
                    Enlace
                  </a>
                )}
                <Link className="text-blue-700 hover:underline" href={`/proyectos/${a.slug}`}>
                  Ver detalle
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

import { strapiFetch } from "@/lib/strapi";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type ListV4<T> = { data: Array<{ id: number; attributes: T }> };

type Project = {
  title: string;
  slug: string;
  description?: string | null;
  longDescription?: string | null;
  tags?: string[] | null;
  repoUrl?: string | null;
  demoUrl?: string | null;
};

async function getProject(slug: string): Promise<Project | null> {
  const res = await strapiFetch<ListV4<Project>>({
    path: "/api/projects",
    locale: "es",
    populate: "*",
    query: { "filters[slug][$eq]": slug },
  });

  return res.data[0]?.attributes ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProject(params.slug);

  const title = p?.title ? `Proyectos | ${p.title}` : "Proyectos";
  const description = p?.description || "Proyecto de Manuel Pérez López";
  const url = `${siteUrl}/proyectos/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProyectoDetail({
  params,
}: {
  params: { slug: string };
}) {
  const p = await getProject(params.slug);

  if (!p) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Proyecto no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{p.title}</h1>

      {p.description && (
        <p className="mt-3 text-lg text-gray-600">{p.description}</p>
      )}

      {p.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t, i) => (
            <span
              key={i}
              className="rounded-xl border px-2.5 py-1 text-sm text-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {p.longDescription && (
        <div
          lang="es"
          className="mt-8 whitespace-pre-line text-2xl leading-relaxed text-justify hyphens-auto"
        >
          {p.longDescription}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-4 text-lg">
        {p.repoUrl && (
          <a
            className="text-blue-700 hover:underline"
            href={p.repoUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub / Repo
          </a>
        )}
        {p.demoUrl && (
          <a
            className="text-blue-700 hover:underline"
            href={p.demoUrl}
            target="_blank"
            rel="noreferrer"
          >
            Enlace
          </a>
        )}
      </div>
    </main>
  );
}

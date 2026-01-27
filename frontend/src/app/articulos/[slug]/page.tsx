import { strapiFetch } from "@/lib/strapi";
import BlockRendererClient from "@/components/BlockRendererClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type ListV4<T> = { data: Array<{ id: number; attributes: T }> };

type Article = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: any;
  category: "informatica" | "redes" | "proyectos";
};

async function getArticle(slug: string): Promise<Article | null> {
  const res = await strapiFetch<ListV4<Article>>({
    path: "/api/articles",
    locale: "es",
    populate: "*",
    query: { "filters[slug][$eq]": slug },
  });

  return res.data[0]?.attributes ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const art = await getArticle(params.slug);

  const title = art?.title ? `Artículos | ${art.title}` : "Artículos";
  const description =
    art?.excerpt ||
    (art?.category
      ? `Artículo sobre ${art.category} de Manuel Pérez López.`
      : "Artículo de Manuel Pérez López.");

  const url = `${siteUrl}/articulos/${params.slug}`;

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

export default async function ArticleDetail({
  params,
}: {
  params: { slug: string };
}) {
  const art = await getArticle(params.slug);

  if (!art) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Artículo no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-xs uppercase tracking-wide text-blue-700">
        {art.category}
      </div>

      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{art.title}</h1>

      <div
        lang="es"
        className="mt-8 text-2xl leading-relaxed text-justify hyphens-auto"
      >
        <BlockRendererClient content={art.content} />
      </div>
    </main>
  );
}

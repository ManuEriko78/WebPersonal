import BlockRendererClient from "@/components/BlockRendererClient";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Post = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: any;
};

type List = { data: Array<{ id: number; attributes: Post }> };

async function getPost(slug: string): Promise<Post | null> {
  const url = new URL(`${strapiUrl}/api/postes`);
  url.searchParams.set("populate", "*");
  url.searchParams.set("filters[slug][$eq]", slug);

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) return null;

  const res: List = await r.json();
  return res.data[0]?.attributes ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const title = post?.title ? `Blog | ${post.title}` : "Blog";
  const description = post?.excerpt || "Post del blog de Manuel Pérez López";

  const url = `${siteUrl}/blog/${params.slug}`;

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

export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Post no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>

      <div lang="es" className="mt-8 text-2xl leading-relaxed text-justify hyphens-auto">
        {typeof post.content === "string" ? (
          <div className="whitespace-pre-line">{post.content}</div>
        ) : (
          <BlockRendererClient content={post.content} />
        )}
      </div>
    </main>
  );
}

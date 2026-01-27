import { strapiFetch } from "@/lib/strapi";
import BlockRendererClient from "@/components/BlockRendererClient";

type StrapiSingle<T> = { data: { id: number; attributes: T } | null };

type MediaV4 = {
  data:
    | { attributes: { url: string; alternativeText?: string | null; formats?: any } }
    | Array<{ attributes: { url: string; alternativeText?: string | null; formats?: any } }>
    | null;
};

type About = {
  title: string;
  subtitle?: string | null;
  content: any;
  cover?: MediaV4 | null;
};

function getCover(cover: MediaV4 | null | undefined) {
  const d = cover?.data ?? null;
  const item = Array.isArray(d) ? d[0] : d;

  const relUrl =
    item?.attributes?.url ??
    item?.attributes?.formats?.thumbnail?.url ??
    null;

  const imgSrc = relUrl ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${relUrl}` : null;
  const alt = item?.attributes?.alternativeText ?? "Cover";

  return { imgSrc, alt };
}

export default async function SobreMiPage() {
  const res = await strapiFetch<StrapiSingle<About>>({
    path: "/api/about",
    locale: "es",
    populate: "*",
  });

  const a = res?.data?.attributes;
  const { imgSrc, alt } = getCover(a?.cover);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">
        {a?.title ?? "Sobre mí"}
      </h1>
      {a?.subtitle && <p className="mt-3 text-xl text-gray-600">{a.subtitle}</p>}

      <section className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
        {/* Izquierda: imagen */}
        <div className="md:sticky md:top-24">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={alt}
              className="w-full max-w-md rounded-2xl shadow-sm object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Derecha: texto grande */}
        <div lang="es" className="text-2xl leading-relaxed text-justify hyphens-auto">
          <BlockRendererClient content={a?.content} />
        </div>
      </section>
    </main>
  );
}

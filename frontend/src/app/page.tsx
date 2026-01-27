import { strapiFetch } from "@/lib/strapi";
import BlockRendererClient from "@/components/BlockRendererClient";
import ContactForm from "@/components/ContactForm";


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

export default async function HomePage() {
  const res = await strapiFetch<StrapiSingle<About>>({
    path: "/api/about",
    locale: "es",
    populate: "*",
  });

  const a = res?.data?.attributes;
  const { imgSrc, alt } = getCover(a?.cover);

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-10">
      {/* Fondo con glow azul */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-[-120px] top-[120px] h-[360px] w-[360px] rounded-full bg-blue-100/50 blur-3xl" />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">
        {a?.title ?? "Sobre mí"}
      </h1>

      {a?.subtitle && <p className="mt-3 text-xl text-gray-600">{a.subtitle}</p>}

      <section className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
        <div className="md:sticky md:top-24">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={alt}
              className="rounded-3xl border bg-white p-8 shadow-sm transition hover:shadow-md"
              loading="lazy"
            />
          )}
        </div>

        <div lang="es" className="text-2xl leading-relaxed text-justify hyphens-auto">
          <BlockRendererClient content={a?.content} />
        </div>
      </section>
      <section id="contacto" className="mt-14">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            {/* Columna izquierda: info */}
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Contacto</h2>
              <p className="mt-2 text-lg text-gray-600">
                Escríbeme y te responderé lo antes posible.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border bg-blue-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-gray-700">Email</span>
                  <a
                    href="mailto:manuel.perez.lopez.mpl@gmail.com"
                    className="font-medium text-blue-700 hover:underline"
                  >
                    manuel.perez.lopez.mpl@gmail.com
                  </a>
                </div>

                {/* Opcional: deja esto preparado para cuando pongas links */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href="https://www.linkedin.com/in/manuel-perez-lopez/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border bg-white px-3 py-1 text-sm font-medium text-blue-700 hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Consejo: si me escribes sobre una oferta, incluye enlace y horario de disponibilidad.
              </p>
            </div>

            {/* Columna derecha: formulario */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

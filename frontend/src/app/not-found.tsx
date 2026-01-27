import Link from "next/link";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl border bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.25em] text-blue-700 uppercase">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Página no encontrada
        </h1>

        <p className="mt-3 text-lg text-gray-600">
          El enlace puede estar mal escrito o la página ya no existe.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Volver al inicio
          </Link>

          <Link
            href="/cv"
            className="rounded-xl border px-4 py-2 text-gray-800 hover:bg-gray-50 transition"
          >
            Ver Curriculum Vitae
          </Link>

          <Link
            href="/blog"
            className="rounded-xl border px-4 py-2 text-gray-800 hover:bg-gray-50 transition"
          >
            Ir al blog
          </Link>

          <Link
            href="/articulos"
            className="rounded-xl border px-4 py-2 text-gray-800 hover:bg-gray-50 transition"
          >
            Ver artículos
          </Link>

          <Link
            href="/proyectos"
            className="rounded-xl border px-4 py-2 text-gray-800 hover:bg-gray-50 transition"
          >
            Ver proyectos
          </Link>
        </div>
      </div>
    </main>
  );
}

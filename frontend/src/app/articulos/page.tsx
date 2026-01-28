import { Suspense } from "react";
import ArticulosClient from "./Articulosclient";

export const dynamic = "force-dynamic";

export default function ArticulosPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Artículos</h1>
      <p className="mt-3 text-lg text-gray-600">
        Informática · Redes · Proyectos
      </p>

      <Suspense fallback={<div className="mt-8 text-gray-600">Cargando…</div>}>
        <ArticulosClient />
      </Suspense>
    </main>
  );
}

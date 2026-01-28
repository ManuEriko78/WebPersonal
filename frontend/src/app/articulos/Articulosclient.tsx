"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ArticulosClient() {
  const searchParams = useSearchParams();
  const cat = (searchParams.get("cat") || "").toLowerCase();

  // Aquí va tu UI actual (filtros + lista). Te dejo un esqueleto:
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        <Link className="text-blue-700 hover:underline" href="/articulos">
          Todas
        </Link>
        <Link className="text-blue-700 hover:underline" href="/articulos?cat=informatica">
          Informática
        </Link>
        <Link className="text-blue-700 hover:underline" href="/articulos?cat=redes">
          Redes
        </Link>
        <Link className="text-blue-700 hover:underline" href="/articulos?cat=proyectos">
          Proyectos
        </Link>
      </div>

      <div className="mt-6 text-gray-700">
        Categoría actual: <b>{cat || "todas"}</b>
      </div>

      {/* Pega aquí el resto de tu listado de artículos */}
    </div>
  );
}

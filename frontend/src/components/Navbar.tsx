import Link from "next/link";
import Image from "next/image";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/cv", label: "CV" },
  { href: "/blog", label: "Blog" },
  { href: "/articulos", label: "Artículos" },
  { href: "/proyectos", label: "Proyectos" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-semibold tracking-tight">Manuel Pérez López</span>
          <Image
            src="/icon.png"
            alt="Logo Manuel Pérez López"
            width={24}
            height={24}
            className="rounded-md"
            priority
          />
        </Link>

        <nav className="hidden gap-5 text-sm md:flex">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <a href="/#contacto">Contacto</a>

      </div>
    </header>
  );
}

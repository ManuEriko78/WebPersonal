export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600">
        © {new Date().getFullYear()} Manuel Pérez López · Hecho con Next.js + Strapi
      </div>
    </footer>
  );
}

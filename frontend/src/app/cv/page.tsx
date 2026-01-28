export const dynamic = "force-dynamic";
export const metadata = { title: "Curriculum Vitae" };

type CvData = {
  experience: string | null;
  education: string | null;
  courses_languages: string | null;
  skills: string | null;
};

function renderSmart(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const blocks: Array<{ type: "h" | "label" | "li" | "p" | "sep"; value?: string }> = [];

  for (const line of lines) {
    // Titulares tipo "E X P E R I E N C I A" o "E S T U D I O S"
    if (/^[A-ZÁÉÍÓÚÜÑ ]{6,}$/.test(line) && line.includes(" ")) {
      blocks.push({ type: "h", value: line.replace(/\s+/g, " ").trim() });
      continue;
    }

    // Labels: "PUESTO DE TRABAJO:", "FECHA:", "TAREAS:"
    if (/^(PUESTO DE TRABAJO|FECHA|TAREAS|TAREA):/i.test(line)) {
      blocks.push({ type: "label", value: line });
      continue;
    }

    // Lista con guión
    if (line.startsWith("- ")) {
      blocks.push({ type: "li", value: line.slice(2).trim() });
      continue;
    }

    // Separador suave entre experiencias (línea vacía ya se filtró, pero detectamos cambios por "FECHA:")
    blocks.push({ type: "p", value: line });
  }

  // Render agrupando listas
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="mt-2 list-disc pl-6 text-xl leading-relaxed">
        {list.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    );
    list = [];
  };

  blocks.forEach((b, idx) => {
    if (b.type !== "li") flushList();

    if (b.type === "h") {
      out.push(
        <p
          key={idx}
          className="mt-2 text-sm font-semibold tracking-[0.25em] text-blue-700 uppercase"
        >
          {b.value}
        </p>
      );
    } else if (b.type === "label") {
      const [k, ...rest] = (b.value || "").split(":");
      out.push(
        <p key={idx} className="mt-4 text-xl leading-relaxed">
          <span className="font-semibold text-gray-900">{k}:</span>
          <span className="text-gray-800"> {rest.join(":").trim()}</span>
        </p>
      );
    } else if (b.type === "li") {
      list.push(b.value || "");
    } else if (b.type === "p") {
      out.push(
        <p key={idx} className="mt-2 text-xl leading-relaxed text-gray-800">
          {b.value}
        </p>
      );
    }
  });

  flushList();
  return <div className="mt-4">{out}</div>;
}

function Section({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) {
  return (
    <section className="rounded-3xl border bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <span className="rounded-xl border bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {title}
        </span>
      </div>

      {!content ? (
        <p className="mt-4 text-gray-600">Sin contenido.</p>
      ) : (
        <div lang="es" className="text-justify hyphens-auto">
          {renderSmart(content)}
        </div>
      )}
    </section>
  );
}

function parseExperience(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  type Item = {
    puesto?: string;
    fecha?: string;
    tareas: string[];
    otros: string[];
  };

  const items: Item[] = [];
  let cur: Item | undefined;
  let inTareas = false;

  const pushIfValid = (it?: Item) => {
    if (!it) return;
    if (it.puesto || it.fecha || it.tareas.length || it.otros.length) items.push(it);
  };

  const startNew = () => {
    pushIfValid(cur);
    cur = undefined;
    inTareas = false;
  };

  const ensureCur = (): Item => {
    if (!cur) cur = { tareas: [], otros: [] };
    return cur;
  };

  for (const line of lines) {
    const upper = line.toUpperCase();

    // Nuevo bloque
    if (upper.startsWith("PUESTO DE TRABAJO:")) {
      startNew();
      const c = ensureCur();
      c.puesto = line.split(":").slice(1).join(":").trim();
      continue;
    }

    const c = ensureCur();

    // Fecha
    if (upper.startsWith("FECHA:")) {
      c.fecha = line.split(":").slice(1).join(":").trim();
      inTareas = false;
      continue;
    }

    // Tareas
    if (upper.startsWith("TAREAS:") || upper.startsWith("TAREA:")) {
      inTareas = true;
      continue;
    }

    // Bullet
    if (line.startsWith("-")) {
      c.tareas.push(line.replace(/^-+\s*/, "").trim());
      continue;
    }

    // Texto normal
    if (inTareas) c.tareas.push(line);
    else c.otros.push(line);
  }

  pushIfValid(cur);
  return items;
}


function ExperienceSection({ content }: { content?: string | null }) {
  if (!content) {
    return (
      <section className="rounded-3xl border bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Experiencia</h2>
        <p className="mt-4 text-gray-600">Sin contenido.</p>
      </section>
    );
  }

  const items = parseExperience(content);

  return (
    <section className="rounded-3xl border bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Experiencia</h2>
        <span className="rounded-xl border bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Experiencia
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="rounded-2xl border bg-blue-50/50 p-5 shadow-sm transition hover:bg-blue-50 hover:shadow-md"
          >
            {it.puesto && (
              <p className="text-xl font-semibold text-gray-900">{it.puesto}</p>
            )}

            {it.fecha && (
              <p className="mt-1 text-sm font-medium text-blue-700">
                {it.fecha}
              </p>
            )}

            {it.otros.length > 0 && (
              <div className="mt-3 space-y-1 text-lg text-gray-800">
                {it.otros.map((x, i) => (
                  <p key={i}>{x}</p>
                ))}
              </div>
            )}

            {it.tareas.length > 0 && (
              <>
                <p className="mt-4 text-sm font-semibold text-gray-900">Tareas</p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-lg text-gray-800">
                  {it.tareas.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function CvPage() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("Falta NEXT_PUBLIC_STRAPI_URL en frontend/.env.local");

  const r = await fetch(`${base}/api/cv?populate=*`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Strapi error ${r.status}: ${await r.text()}`);

  const json = await r.json();

  // Strapi v5: json.data = { ... }
  // Strapi v4: json.data.attributes = { ... }
  const cv: CvData | null = json?.data?.attributes ?? json?.data ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Curriculum Vitae</h1>
          <p className="mt-2 text-lg text-gray-600">
            Experiencia, formación, cursos/idiomas y habilidades.
          </p>
        </div>

        <a
          href="/ManuelPerezLopez.pdf"
          className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          download
        >
          Descargar CV
        </a>
      </div>

      {!cv ? (
        <div className="mt-8 rounded-2xl border p-6 text-gray-700">
          Aún no hay contenido publicado en CV.
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          <ExperienceSection content={cv.experience} />
          <Section title="Formación" content={cv.education} />
          <Section title="Cursos e idiomas" content={cv.courses_languages} />
          <Section title="Habilidades y aptitudes" content={cv.skills} />
        </div>
      )}
    </main>
  );
}

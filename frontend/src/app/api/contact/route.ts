import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const token = String(body?.turnstileToken || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Faltan campos." }, { status: 400 });
    }

    // 1) Verificar captcha Turnstile
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ ok: false, error: "Captcha no configurado." }, { status: 500 });
    }

    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);

    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });

    const verifyJson = await verify.json();
    if (!verifyJson?.success) {
      return NextResponse.json({ ok: false, error: "Captcha inválido." }, { status: 400 });
    }

    // 2) Guardar en Strapi
    const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN; // token server-to-server
    if (!strapiBase || !strapiToken) {
      return NextResponse.json({ ok: false, error: "Backend no configurado." }, { status: 500 });
    }

    const ip = req.headers.get("x-forwarded-for") || "";
    const userAgent = req.headers.get("user-agent") || "";

    // Endpoint de Strapi (probablemente /api/contact-messages)
    const r = await fetch(`${strapiBase}/api/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: { name, email, message, ip, userAgent, status: "new" },
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ ok: false, error: "Error guardando en Strapi", details: t }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "Error inesperado", details: String(e) }, { status: 500 });
  }
}

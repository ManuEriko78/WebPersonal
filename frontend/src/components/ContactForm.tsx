"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [token, setToken] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<string>("");
  const [err, setErr] = useState<string>("");

  // Carga el script de Turnstile y renderiza el widget
  useEffect(() => {
    if (!siteKey) return;

    const scriptId = "cf-turnstile";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }

    const tryRender = () => {
      if (!widgetRef.current) return;
      if (!window.turnstile?.render) return;

      // Evita render duplicado
      widgetRef.current.innerHTML = "";
      window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    const t = setInterval(tryRender, 300);
    setTimeout(() => clearInterval(t), 6000);

    return () => clearInterval(t);
  }, [siteKey]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk("");
    setErr("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErr("Rellena nombre, email y mensaje.");
      return;
    }

    if (!siteKey) {
      setErr("Captcha no configurado todavía (falta NEXT_PUBLIC_TURNSTILE_SITE_KEY).");
      return;
    }

    if (!token) {
      setErr("Completa el captcha antes de enviar.");
      return;
    }

    try {
      setSending(true);
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          turnstileToken: token,
        }),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok || !j?.ok) {
        setErr(j?.error || "No se pudo enviar el mensaje.");
        return;
      }

      setOk("Mensaje enviado. ¡Gracias!");
      setName("");
      setEmail("");
      setMessage("");
      setToken("");
    } catch (e: any) {
      setErr(String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 max-w-xl">
      <input
        className="rounded-xl border px-3 py-2"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="rounded-xl border px-3 py-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        className="rounded-xl border px-3 py-2"
        placeholder="Mensaje"
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Turnstile */}
      <div className="mt-2">
        <div ref={widgetRef} />
      </div>

      <button
        disabled={sending}
        className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-60"
        type="submit"
      >
        {sending ? "Enviando..." : "Enviar"}
      </button>

      {ok && <p className="text-sm text-green-700">{ok}</p>}
      {err && <p className="text-sm text-red-700">{err}</p>}
    </form>
  );
}

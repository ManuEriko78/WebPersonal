"use client";

import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";

export default function BlockRendererClient({
  content,
}: {
  content?: BlocksContent | string | null;
}) {
  if (!content) return null;

  // Si viene como string (HTML o texto)
  if (typeof content === "string") {
    // Si parece HTML, lo insertamos como HTML
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
    if (looksLikeHtml) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    // Si es texto plano
    return <p>{content}</p>;
  }

  // Si viene como bloques (array)
  if (Array.isArray(content)) {
    return <BlocksRenderer content={content} />;
  }

  // Fallback por si llega algo raro
  return <pre className="whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>;
}


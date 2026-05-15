import { supabase } from "@/integrations/supabase/client";
import { INTENT_MAP } from "../constants";

export async function searchKnowledge(query: string): Promise<string> {
  const lower = query.toLowerCase();
  const results: string[] = [];

  // 1. Detecta prefixos de title relevantes pela intenção
  const detectedPrefixes = new Set<string>();
  for (const { keywords, titlePrefixes } of INTENT_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) {
      titlePrefixes.forEach((p) => detectedPrefixes.add(p));
    }
  }

  // 2. Busca por prefixo de title (otimizada)
  if (detectedPrefixes.size > 0) {
    const prefixConditions = Array.from(detectedPrefixes).map(prefix => `title.like.${prefix}%`);
    const { data } = await supabase
      .from("knowledge_base" as never)
      .select("content")
      .or(prefixConditions.join(', '))
      .limit(4);

    if (data?.length) {
      (data as { content: string }[]).forEach((d) => {
        if (!results.includes(d.content)) results.push(d.content);
      });
    }
  }

  // 3. Full-text search como complemento
  try {
    const searchQuery = query
      .replace(/[^a-záéíóúãõâêôçàüA-Z0-9 ]/g, " ")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 5)
      .join(" & ");

    if (searchQuery) {
      const { data } = await supabase
        .from("knowledge_base" as never)
        .select("content")
        .textSearch("content", searchQuery, { type: "plain", config: "portuguese" })
        .limit(3);

      if (data?.length) {
        (data as { content: string }[]).forEach((d) => {
          if (!results.includes(d.content)) results.push(d.content);
        });
      };
    }
  } catch {
    // full-text falhou, segue só com prefixo
  }

  return results.slice(0, 6).join("\n\n---\n\n");
}

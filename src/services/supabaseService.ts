import { supabase } from "@/integrations/supabase/client";
import { INTENT_MAP } from "../constants";

export async function searchKnowledge(query: string): Promise<string> {
  if (!supabase) return "";

  const lowerQuery = query.toLowerCase();
  const results: string[] = [];

  const detectedPrefixes = new Set<string>();
  for (const entry of INTENT_MAP) {
    if (entry.keywords.some(kw => lowerQuery.includes(kw))) {
      entry.titlePrefixes.forEach(p => detectedPrefixes.add(p));
    }
  }

  if (detectedPrefixes.size > 0) {
    try {
      const orCondition = Array.from(detectedPrefixes)
        .map(p => `title.like.${p}%`)
        .join(",");

      const { data, error } = await supabase
        .from("knowledge_base")
        .select("content")
        .or(orCondition)
        .limit(5);

      if (!error && data) {
        for (const item of data) {
          if (!results.includes(item.content)) {
            results.push(item.content);
          }
        }
      }
    } catch {
      // Query errors are non-blocking; return partial results
    }
  }

  try {
    const ftsQuery = query
      .replace(/[^a-zA-Z0-9áéíóúãõâêôç ]/g, " ")
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5)
      .join(" & ");

    if (ftsQuery) {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("content")
        .textSearch("content", ftsQuery, {
          type: "plain",
          config: "portuguese",
        })
        .limit(3);

      if (!error && data) {
        for (const item of data) {
          if (!results.includes(item.content)) {
            results.push(item.content);
          }
        }
      }
    }
  } catch {
    // FTS query errors are non-blocking
  }

  return results.slice(0, 6).join("\n\n---\n\n");
}

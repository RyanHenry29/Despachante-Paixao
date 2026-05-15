/**
 * @file supabaseService.ts
 * @description Serviço de busca na base de conhecimento do Supabase.
 * Implementa uma estratégia híbrida de busca por intenção e texto completo.
 */

import { supabase } from "@/integrations/supabase/client";
import { INTENT_MAP } from "../constants";

/**
 * Realiza uma busca inteligente na tabela 'knowledge_base'.
 * 
 * @param query A pergunta ou termo digitado pelo usuário
 * @returns Uma string contendo os fragmentos de conhecimento encontrados
 */
export async function searchKnowledge(query: string): Promise<string> {
  const lowerQuery = query.toLowerCase();
  const results: string[] = [];

  // 1. Detecção de Intenção baseada em palavras-chave
  const detectedPrefixes = new Set<string>();
  for (const entry of INTENT_MAP) {
    if (entry.keywords.some(kw => lowerQuery.includes(kw))) {
      entry.titlePrefixes.forEach(p => detectedPrefixes.add(p));
    }
  }

  // 2. Busca Otimizada por Prefixos de Título
  if (detectedPrefixes.size > 0) {
    try {
      // Constrói uma query única usando o operador OR para performance
      const orCondition = Array.from(detectedPrefixes)
        .map(p => `title.like.${p}%`)
        .join(",");

      const { data, error } = await supabase
        .from("knowledge_base" as never)
        .select("content")
        .or(orCondition)
        .limit(5);

      if (!error && data) {
        data.forEach((item: any) => {
          if (!results.includes(item.content)) {
            results.push(item.content);
          }
        });
      }
    } catch (err) {
      console.warn("Falha na busca por prefixo:", err);
    }
  }

  // 3. Busca Full-Text (FTS) como fallback ou complemento
  try {
    // Sanitização da query para o formato do PostgreSQL FTS
    const ftsQuery = query
      .replace(/[^a-zA-Z0-9áéíóúãõâêôç ]/g, " ")
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5)
      .join(" & ");

    if (ftsQuery) {
      const { data, error } = await supabase
        .from("knowledge_base" as never)
        .select("content")
        .textSearch("content", ftsQuery, { 
          type: "plain", 
          config: "portuguese" 
        })
        .limit(3);

      if (!error && data) {
        data.forEach((item: any) => {
          if (!results.includes(item.content)) {
            results.push(item.content);
          }
        });
      }
    }
  } catch (err) {
    console.warn("Falha na busca Full-Text:", err);
  }

  // Retorna os resultados formatados com separadores claros para o LLM
  return results.slice(0, 6).join("\n\n---\n\n");
}

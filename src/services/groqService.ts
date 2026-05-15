/**
 * @file groqService.ts
 * @description Serviço de integração com a API da Groq.
 * Implementa chamadas com streaming e sanitização de conteúdo.
 */

import Groq from "groq-sdk";
import { Message } from "../types";
import { SYSTEM_PROMPT_TEMPLATE, WHATSAPP_LINK } from "../constants";

/**
 * NOTA DE SEGURANÇA:
 * Em produção, a VITE_GROQ_API_KEY não deve ser exposta no frontend.
 * Recomenda-se criar uma API intermediária (Backend) para realizar estas chamadas.
 */
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

// Inicialização segura do cliente Groq
const groq = apiKey ? new Groq({ 
  apiKey, 
  dangerouslyAllowBrowser: true // Necessário para rodar no client-side (Vite)
}) : null;

/**
 * Envia o histórico de mensagens para a IA e processa a resposta via streaming.
 * 
 * @param messages Histórico de mensagens da conversa
 * @param ragContext Contexto recuperado da base de conhecimento
 * @param onUpdate Callback chamado a cada novo chunk de texto recebido
 * @returns Promessa com o conteúdo final completo da resposta
 */
export async function askAI(
  messages: Message[], 
  ragContext: string, 
  onUpdate: (content: string) => void
): Promise<string> {
  
  if (!groq) {
    const errorMsg = "Configuração ausente: VITE_GROQ_API_KEY não encontrada.";
    console.error(errorMsg);
    return "O sistema de IA está temporariamente indisponível. Por favor, configure a chave de API.";
  }

  const systemPrompt = SYSTEM_PROMPT_TEMPLATE(ragContext);

  try {
    // Chamada para o modelo Llama 3 da Groq com suporte a streaming
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content.replace(/[*_#]/g, "") // Sanitização simples para evitar quebras de markdown
        }))
      ],
      temperature: 0.1, // Baixa temperatura para respostas mais factuais e precisas
      max_tokens: 600,  // Limite generoso para explicações técnicas detalhadas
      stream: true,
    });

    let fullText = "";

    // Processamento dos chunks do stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullText += content;
        onUpdate(fullText);
      }
    }

    // Limpeza final do texto (remove asteriscos e espaços extras)
    return fullText.replace(/\*\*/g, "").replace(/\*/g, "").trim();

  } catch (error: any) {
    console.error("Erro na comunicação com Groq API:", error);
    
    // Tratamento específico para Rate Limit (Erro 429)
    if (error?.status === 429) {
      return `Muitas solicitações simultâneas. Por favor, aguarde um minuto ou fale conosco no WhatsApp: ${WHATSAPP_LINK}`;
    }

    throw error; // Repassa outros erros para o hook tratar
  }
}

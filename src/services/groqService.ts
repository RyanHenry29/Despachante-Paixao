import Groq from "groq-sdk";
import { Message } from "../types";
import { SYSTEM_PROMPT_TEMPLATE, WHATSAPP_LINK } from "../constants";

// ATENÇÃO: Em um ambiente de produção, esta chave de API NUNCA deve ser exposta no frontend.
// A chamada para a API da Groq DEVE ser feita a partir de um backend seguro (e.g., Node.js, Serverless Function).
// O dangerouslyAllowBrowser: true é usado AQUI APENAS para fins de demonstração/desenvolvimento local.
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey, dangerouslyAllowBrowser: true }) : null;

export async function askAI(messages: Message[], ragContext: string, onUpdate: (content: string) => void): Promise<string> {
  if (!groq) {
    return "Chave de API não configurada (VITE_GROQ_API_KEY). Por favor, configure-a em um backend seguro.";
  }

  const systemPrompt = SYSTEM_PROMPT_TEMPLATE(ragContext);

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Ou um modelo menor para casos mais simples, se houver roteamento de LLM
      temperature: 0,
      max_tokens: 400,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content.replace(/\*\*/g, "").replace(/\*/g, ""), // Sanitização básica contra markdown
        })),
      ],
      stream: true, // Habilita o streaming
    });

    let fullContent = "";
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullContent += content;
      onUpdate(fullContent); // Chama o callback para atualizar a UI em tempo real
    }

    return fullContent.replace(/\*\*/g, "").replace(/\*/g, "").trim();
  } catch (error: any) {
    console.error("Erro ao chamar a API da Groq:", error);
    const isRateLimit = error?.status === 429 || error?.message?.includes("429");
    return isRateLimit
      ? `Muitas mensagens em seguida. Aguarde um momento e tente novamente, ou fale diretamente: ${WHATSAPP_LINK}`
      : `Ops, erro técnico. Tente novamente ou fale conosco: ${WHATSAPP_LINK}`;
  }
}

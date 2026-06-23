import Groq from "groq-sdk";
import { Message } from "../types";
import { SYSTEM_PROMPT_TEMPLATE, WHATSAPP_LINK } from "../constants";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const groq = apiKey ? new Groq({ 
  apiKey, 
  dangerouslyAllowBrowser: true 
}) : null;

async function askAI(
  messages: Message[], 
  ragContext: string, 
  onUpdate: (content: string) => void
): Promise<string> {
  
  if (!groq) {
    return "Configuração de API ausente.";
  }

  const systemPrompt = SYSTEM_PROMPT_TEMPLATE(ragContext);

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content.replace(/[*_#]/g, "")
        }))
      ],
      temperature: 0.1,
      max_tokens: 600,
      stream: true,
    });

    let fullText = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullText += content;
        onUpdate(fullText);
      }
    }
    return fullText.replace(/\*\*/g, "").replace(/\*/g, "").trim();
  } catch (error: any) {
    if (error?.status === 429) {
      return `Aguarde um momento ou fale no WhatsApp: ${WHATSAPP_LINK}`;
    }
    throw error;
  }
}

export { askAI };

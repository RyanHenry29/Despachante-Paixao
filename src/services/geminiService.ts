import { Message } from "../types";
import { WHATSAPP_LINK } from "../constants";

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
  : null;

async function askAI(
  messages: Message[],
  ragContext: string,
  onUpdate: (content: string) => void
): Promise<string> {
  if (!EDGE_FUNCTION_URL) {
    return "Serviço de chat indisponível no momento.";
  }

  try {
    const res = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, ragContext }),
    });

    if (res.status === 429) {
      return `Aguarde um momento ou fale no WhatsApp: ${WHATSAPP_LINK}`;
    }

    const data = await res.json();
    const content = data.reply || "Desculpe, tive um problema. Tente novamente.";

    onUpdate(content);
    return content.replace(/\*\*/g, "").replace(/\*/g, "").trim();
  } catch {
    return `Desculpe, tive um problema técnico momentâneo. Por favor, tente novamente ou fale conosco: ${WHATSAPP_LINK}`;
  }
}

export { askAI };

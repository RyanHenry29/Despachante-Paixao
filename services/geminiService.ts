import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";
import { SYSTEM_PROMPT_TEMPLATE, WHATSAPP_LINK } from "../constants";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function askAI(
  messages: Message[],
  ragContext: string,
  onUpdate: (content: string) => void
): Promise<string> {
  if (!genAI) {
    return "Configuração de API ausente.";
  }

  const systemPrompt = SYSTEM_PROMPT_TEMPLATE(ragContext);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 600,
      },
    });

    const history = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.replace(/[*_#]/g, "") }],
    }));

    const lastMessage = history.pop()!;

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessageStream(lastMessage.parts[0].text);

    let fullText = "";
    for await (const chunk of result.stream) {
      const content = chunk.text();
      if (content) {
        fullText += content;
        onUpdate(fullText);
      }
    }
    return fullText.replace(/\*\*/g, "").replace(/\*/g, "").trim();
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("quota")) {
      return `Aguarde um momento ou fale no WhatsApp: ${WHATSAPP_LINK}`;
    }
    throw error;
  }
}

export { askAI };

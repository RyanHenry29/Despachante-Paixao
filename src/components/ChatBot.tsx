import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WHATSAPP_NUMBER = "5511953284566";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Gostaria de informações sobre os serviços do Despachante Paixão."
);

const SUGGESTIONS = [
  "Quais documentos para transferência?",
  "Qual o prazo do licenciamento?",
  "Vocês consultam multas?",
  "Como funciona o emplacamento?",
];

async function searchKnowledge(query: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("knowledge_base" as never)
      .select("content")
      .textSearch("content", query, { type: "plain", config: "portuguese" })
      .limit(3);

    if (error || !data?.length) return "";
    return (data as { content: string }[]).map((d) => d.content).join("\n---\n");
  } catch {
    return "";
  }
}

import Groq from "groq-sdk";

async function askAI(messages: Message[], ragContext: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return "Aviso: A chave da API da Groq (VITE_GROQ_API_KEY) não está configurada.";
  }

  try {
    // A flag dangerouslyAllowBrowser é necessária pois estamos rodando a Groq diretamente no Frontend
    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

as     const systemPrompt = `Você é o Consultor Técnico Sênior do Despachante Paixão. Sua missão é fornecer respostas definitivas e profissionais sobre o DETRAN-SP.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
1. CONSULTA AO CALENDÁRIO: Se perguntarem sobre licenciamento, use o CALENDÁRIO 2026 presente na BASE DE CONHECIMENTO abaixo. Informe o mês exato conforme o final da placa.
2. RIGOR TÉCNICO: Laudo CSV é o único obrigatório para transferência. Explique que o Cautelar é opcional.
3. ALERTA LEGAL: Sempre mencione as consequências de não realizar o serviço (multas, pontos, apreensão).
4. FECHAMENTO PROFISSIONAL: Convide para o WhatsApp (11) 95328-4566 para validar os dados no sistema oficial do DETRAN com o RENAVAM do cliente.

REGRAS CRÍTICAS:
- PRECISÃO: Use o Calendário SP 2026 da base. Final 1 e 2 = Julho, Final 3 e 4 = Agosto, etc.
- TERMINOLOGIA: Use "Laudo CSV", "ATPV-e", "Guia TFDTE".
- VALORES: Nunca forneça valores em R$.
- LINKS: Sempre use: https://wa.me/5511953284566

EXEMPLO DE TONE OF VOICE:
"Para realizar a transferência, é indispensável a apresentação do Laudo CSV (Vistoria de Identificação Veicular). A falta de transferência em 30 dias gera multa e bloqueio administrativo. Para consultar o calendário exato e valores, fale conosco: https://wa.me/5511953284566"

BASE DE CONHECIMENTO:
${ragContext}

DOCUMENTOS TRANSFERÊNCIA: RG/CNH original, ATPV-e (recibo digital) ou CRV assinado com firma reconhecida, Laudo de Vistoria (CSV/ECV) e Comprovante de Residência atualizado.`;

    // Converte as mensagens do formato do ChatBot para o formato da OpenAI/Groq
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content.replace(/\*\*/g, ""), // Remove asteriscos do histórico também
      })),
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0, // Rigidez total para evitar alucinações e seguir as regras de não chutar datas
      max_tokens: 600,
    });

    const rawResponse = chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui formular uma resposta. Chame nossa equipe no WhatsApp (11) 95328-4566.";
    // Força a remoção de qualquer markdown de negrito que a IA insista em mandar
    return rawResponse.replace(/\*\*/g, "");
  } catch (error) {
    console.error("Erro na Groq:", error);
    throw error;
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSugs, setShowSugs] = useState(true);
  const [greeted, setGreeted] = useState(false);
  const [lastUsedRag, setLastUsedRag] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      setTimeout(() => {
        setMessages([{
          role: "assistant",
          content: "Olá! 👋 Sou o assistente virtual do Despachante Paixão. Posso tirar dúvidas sobre transferência, licenciamento, multas e muito mais. Como posso te ajudar?",
        }]);
      }, 300);
    }
  }, [open, greeted]);

  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setShowSugs(false);
    setInput("");
    setLastUsedRag(false);

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const ragContext = await searchKnowledge(text);
      if (ragContext) setLastUsedRag(true);
      const reply = await askAI(newMessages, ragContext);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error: any) {
      setMessages([...newMessages, {
        role: "assistant",
        content: `Ops! Erro técnico: ${error.message || JSON.stringify(error)}`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-4 rounded-full shadow-2xl hover:bg-[#20BA5A] transition-all duration-300 ${open ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}`}
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold hidden sm:inline">Fale Conosco</span>
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
        style={{ maxHeight: "560px" }}
      >
        <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-lg">🚗</div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm leading-tight">Despachante Paixão</p>
            <p className="text-white/80 text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-200 inline-block" />
              Assistente com IA
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors" aria-label="Fechar chat">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={msgsRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50" style={{ minHeight: 260, maxHeight: 320 }}>
          {messages.map((msg, i) => {
            // Função para transformar URLs em links clicáveis
            const renderTextWithLinks = (text: string) => {
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              return text.split(urlRegex).map((part, index) => {
                if (part.match(urlRegex)) {
                  return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-900 hover:text-blue-700">{part}</a>;
                }
                return <span key={index}>{part}</span>;
              });
            };

            return (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "assistant" ? "bg-white text-gray-800 self-start rounded-bl-sm shadow-sm" : "bg-[#25D366] text-white self-end rounded-br-sm"}`}>
                {renderTextWithLinks(msg.content)}
              </div>
            );
          })}
          {loading && (
            <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-bl-sm text-sm bg-white text-gray-400 self-start shadow-sm flex items-center gap-2">
              <span className="animate-pulse">Buscando informações</span>
              <span className="animate-bounce">...</span>
            </div>
          )}
          {!loading && lastUsedRag && messages.length > 1 && (
            <div className="flex items-center gap-3 self-start px-1 mt-1">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <Database className="w-3 h-3" /> base interna
              </span>
            </div>
          )}
        </div>

        {showSugs && messages.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)} className="text-xs border border-[#25D366] text-[#25D366] rounded-full px-3 py-1 hover:bg-[#25D366] hover:text-white transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-[#25D366] transition-colors">
            Preferir falar com atendente pelo WhatsApp?
          </a>
        </div>

        <div className="flex gap-2 px-3 py-3 border-t border-gray-200 bg-white flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Digite sua dúvida..."
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-full outline-none focus:border-[#25D366] disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#20BA5A] disabled:opacity-50 transition-colors"
            aria-label="Enviar"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

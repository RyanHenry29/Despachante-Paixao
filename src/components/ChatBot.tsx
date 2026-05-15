import { Send, MessageCircle, X, Database } from "lucide-react";
import { SUGGESTIONS, WHATSAPP_HREF } from "../constants";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "../hooks/useChat";

export default function ChatBot() {
  const {
    open, setOpen,
    messages,
    input, setInput,
    loading,
    showSugs,
    usedRag,
    msgsRef,
    inputRef,
    sendMessage,
  } = useChat();

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-4 rounded-full shadow-2xl hover:bg-[#1ebe5d] active:scale-95 transition-all duration-300 ${
          open ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        }`}
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold hidden sm:inline">Fale Conosco</span>
      </button>

      {/* Janela do chat */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        style={{ height: "580px" }}
      >
        {/* Header */}
        <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-xl select-none">
            🚗
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">Despachante Paixão</p>
            <p className="text-white/80 text-xs flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-200 inline-block animate-pulse" />
              Assistente com IA · Guarulhos-SP
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
            aria-label="Fechar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagens */}
        <div
          ref={msgsRef}
          className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 bg-[#f0f2f5]"
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="max-w-[88%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white self-start shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          )}

          {!loading && usedRag && messages.length > 1 && (
            <div className="self-start flex items-center gap-1 text-[10px] text-gray-400 px-1">
              <Database className="w-3 h-3" />
              base interna consultada
            </div>
          )}
        </div>

        {/* Sugestões rápidas */}
        {showSugs && messages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-white border-t border-gray-100 flex-shrink-0">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs border border-[#25D366] text-[#25D366] rounded-full px-3 py-1 hover:bg-[#25D366] hover:text-white active:scale-95 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Link atendente humano */}
        <div className="px-4 py-1.5 bg-white border-t border-gray-100 flex-shrink-0">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-[#25D366] transition-colors"
          >
            Prefere falar com um atendente? WhatsApp ↗
          </a>
        </div>

        {/* Input */}
        <div className="flex gap-2 px-3 py-3 border-t border-gray-200 bg-white flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Digite sua dúvida..."
            disabled={loading}
            className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-full outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]/20 disabled:opacity-50 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-[#25D366] text-white p-2.5 rounded-full hover:bg-[#1ebe5d] disabled:opacity-40 active:scale-95 transition-all"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

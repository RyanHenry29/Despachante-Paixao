/**
 * @file ChatBot.tsx
 * @description Componente principal da interface do ChatBot.
 * Estilizado com Tailwind CSS e Lucide Icons.
 */

import React from "react";
import { Send, MessageCircle, X, Database, AlertCircle } from "lucide-react";
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
    error,
    msgsRef,
    inputRef,
    sendMessage,
  } = useChat();

  return (
    <div className="chatbot-container">
      {/* Botão Flutuante (Trigger) */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0B1D3D] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#0B1D3D]/90 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/10 ${
          open ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        }`}
        aria-label="Abrir chat de atendimento"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium text-sm hidden sm:inline">Assistente Virtual</span>
      </button>

      {/* Janela Principal do Chat */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out select-none ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-12 pointer-events-none"
        }`}
        style={{ height: "620px" }}
      >
        {/* Header Personalizado */}
          <div className="bg-[#0B1D3D] px-5 py-4 flex items-center gap-4 flex-shrink-0 shadow-md">
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-2xl shadow-inner select-none">
            🚗
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base leading-tight truncate">Despachante Paixão</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200"></span>
              </span>
              <p className="text-white/90 text-xs font-medium">Assistente Virtual</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
            aria-label="Fechar janela de chat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Área de Mensagens (Scrollable) */}
        <div
          ref={msgsRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#f0f2f5] scroll-smooth select-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {/* Indicador de Carregamento (Typing) */}
          {loading && (
            <div className="max-w-[80%] px-5 py-3 rounded-2xl rounded-tl-sm bg-white self-start shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Analisando...</span>
            </div>
          )}

          {/* Alerta de Erro */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-xs border border-red-100">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Badge de Fonte de Dados */}
          {!loading && usedRag && messages.length > 1 && (
            <div className="self-start flex items-center gap-1.5 text-[10px] text-gray-400/80 px-2 py-1 bg-gray-100/50 rounded-md">
              <Database className="w-3 h-3" />
              <span>Informação verificada na base interna</span>
            </div>
          )}
        </div>

        {/* Sugestões Rápidas (Chips) */}
        {showSugs && messages.length > 0 && (
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 w-max">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs whitespace-nowrap border border-[#0B1D3D] text-[#0B1D3D] rounded-full px-4 py-1.5 hover:bg-[#0B1D3D] hover:text-white active:scale-95 transition-all font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Área de Input */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex gap-3 items-center bg-gray-100 rounded-full px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B1D3D]/20 transition-all border border-transparent focus-within:border-[#0B1D3D]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Digite sua dúvida técnica..."
              disabled={loading}
              className="flex-1 py-2.5 text-sm bg-transparent outline-none disabled:opacity-50 text-gray-700 placeholder:text-gray-400"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="bg-[#0B1D3D] text-white p-2 rounded-full hover:bg-[#0B1D3D]/90 disabled:opacity-40 disabled:grayscale active:scale-90 transition-all shadow-sm"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

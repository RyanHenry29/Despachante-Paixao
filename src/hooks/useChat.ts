import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "../types";
import { searchKnowledge } from "../services/supabaseService";
import { askAI } from "../services/groqService";
import { WHATSAPP_LINK } from "../constants";

export function useChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSugs, setShowSugs] = useState(true);
  const [greeted, setGreeted] = useState(false);
  const [usedRag, setUsedRag] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Saudação inicial
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content:
              "Olá! 👋 Sou o assistente do Despachante Paixão. Posso tirar suas dúvidas sobre transferência, licenciamento, multas, vistoria e muito mais. Como posso te ajudar?",
          },
        ]);
      }, 300);
    }
  }, [open, greeted]);

  // Scroll automático
  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Foco no input ao abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 400);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setShowSugs(false);
    setInput("");
    setUsedRag(false);

    const newUserMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const ragContext = await searchKnowledge(text);
      if (ragContext) setUsedRag(true);

      let assistantReplyContent = "";
      const updateAssistantMessage = (content: string) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === "assistant" && lastMessage.content === "") {
            // Update existing streaming message
            return prev.map((msg, index) =>
              index === prev.length - 1 ? { ...msg, content: content } : msg
            );
          } else {
            // Add new streaming message placeholder
            return [...prev, { role: "assistant", content: content }];
          }
        });
      };

      // Add a placeholder for the assistant's streaming message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      assistantReplyContent = await askAI(
        [...messages, newUserMessage], // Pass all messages including the new user one
        ragContext,
        updateAssistantMessage
      );

      // Final update to ensure the message is complete and cleaned up
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, content: assistantReplyContent } : msg
        )
      );

    } catch (err: any) {
      console.error("Erro no chat:", err);
      const isRateLimit = err?.status === 429 || err?.message?.includes("429");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isRateLimit
            ? `Muitas mensagens em seguida. Aguarde um momento e tente novamente, ou fale diretamente: ${WHATSAPP_LINK}`
            : `Ops, erro técnico. Tente novamente ou fale conosco: ${WHATSAPP_LINK}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]); // Adicionado 'messages' como dependência para que o 'askAI' receba o histórico completo

  return {
    open, setOpen,
    messages, setMessages,
    input, setInput,
    loading,
    showSugs, setShowSugs,
    greeted,
    usedRag,
    msgsRef,
    inputRef,
    sendMessage,
  };
}

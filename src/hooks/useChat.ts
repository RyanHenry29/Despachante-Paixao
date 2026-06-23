/**
 * @file useChat.ts
 * @description Hook customizado para gerenciar toda a lógica do ChatBot.
 * Inclui gerenciamento de estado, chamadas de API (RAG + LLM) e streaming.
 */

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
  const [error, setError] = useState<string | null>(null);
  
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Saudação inicial ao abrir o chat pela primeira vez
   */
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content: "Olá! 👋 Sou o assistente especialista do Despachante Paixão. Posso tirar suas dúvidas técnicas sobre transferência, motores, multas, CNH e muito mais. Como posso te ajudar hoje?",
            timestamp: Date.now()
          },
        ]);
      }, 400);
    }
  }, [open, greeted]);

  /**
   * Scroll automático para a última mensagem
   */
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTo({
        top: msgsRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  /**
   * Foco automático no input ao abrir a janela
   */
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  /**
   * Função principal para envio de mensagens
   */
  const sendMessage = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    setShowSugs(false);
    setInput("");
    setUsedRag(false);
    setError(null);

    const newUserMessage: Message = { 
      role: "user", 
      content: trimmedText,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const ragContext = await searchKnowledge(trimmedText);
      if (ragContext) setUsedRag(true);

      let currentAssistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "...", timestamp: Date.now() }]);

      const updateUI = (content: string) => {
        currentAssistantContent = content;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex]?.role === "assistant") {
            newMessages[lastIndex] = { ...newMessages[lastIndex], content: currentAssistantContent };
          }
          return newMessages;
        });
      };

      const finalContent = await askAI(
        [...messages, newUserMessage], 
        ragContext, 
        updateUI
      );

      updateUI(finalContent);

    } catch (err: any) {
      setError("Ocorreu um erro ao processar sua mensagem.");
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Desculpe, tive um problema técnico momentâneo. Por favor, tente novamente ou fale conosco diretamente: ${WHATSAPP_LINK}`,
          timestamp: Date.now()
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  return {
    open, setOpen,
    messages, setMessages,
    input, setInput,
    loading,
    showSugs, setShowSugs,
    usedRag,
    error,
    msgsRef,
    inputRef,
    sendMessage,
  };
}

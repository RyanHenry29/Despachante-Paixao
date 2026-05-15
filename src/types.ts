/**
 * @file types.ts
 * @description Definições de tipos TypeScript para o ChatBot do Despachante Paixão.
 * Garante a integridade dos dados em toda a aplicação.
 */

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  /** Papel de quem enviou a mensagem */
  role: MessageRole;
  /** Conteúdo textual da mensagem */
  content: string;
  /** Timestamp opcional para controle de histórico */
  timestamp?: number;
}

export interface IntentMapEntry {
  /** Lista de palavras-chave que disparam esta intenção */
  keywords: string[];
  /** Prefixos de títulos na base de conhecimento (Supabase) relacionados */
  titlePrefixes: string[];
  /** Descrição amigável da intenção (opcional) */
  description?: string;
}

export interface KnowledgeResult {
  /** Conteúdo recuperado da base de conhecimento */
  content: string;
  /** Título do documento recuperado */
  title?: string;
  /** Score de relevância (se disponível) */
  similarity?: number;
}

export interface ChatState {
  messages: Message[];
  input: string;
  loading: boolean;
  open: boolean;
  usedRag: boolean;
  error: string | null;
}

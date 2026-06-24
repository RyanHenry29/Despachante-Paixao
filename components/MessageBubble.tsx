import React from "react";
import { Message } from "../types";
import { WHATSAPP_NUMBER } from "../constants";

interface MessageBubbleProps {
  msg: Message;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  const isBot = msg.role === "assistant";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = msg.content.split(urlRegex);

  return (
    <div
      className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
        isBot
          ? "bg-white text-gray-800 self-start rounded-tl-sm shadow-sm"
          : "bg-[#25D366] text-white self-end rounded-tr-sm"
      }`}
    >
      {parts.map((part, i) =>
        part.match(urlRegex) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline font-semibold ${isBot ? "text-green-700 hover:text-green-900" : "text-white"}`}
          >
            {part.includes(`wa.me/${WHATSAPP_NUMBER}`) ? "👉 Falar no WhatsApp" : part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
}

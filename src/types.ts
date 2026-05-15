export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface IntentMapEntry {
  keywords: string[];
  titlePrefixes: string[];
}

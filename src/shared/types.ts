export interface StorageData {
  apiKey?: string;
  model?: string;
  summaryLength?: "short" | "medium" | "long";
  theme?: "light" | "dark" | "auto";
}

export interface SummaryRequest {
  text: string;
  length: "short" | "medium" | "long";
}

export interface SummaryResponse {
  summary: string;
  error?: string;
}

export interface Message {
  type:
    | "GET_PAGE_TEXT"
    | "SUMMARIZE"
    | "SUMMARY_READY"
    | "ERROR"
    | "GET_CURRENT_SUMMARY";
  data?: any;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

export const MODELS = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5" },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
] as const;

export const DEFAULT_SETTINGS: StorageData = {
  model: "openai/gpt-4o-mini",
  summaryLength: "medium",
  theme: "auto",
};

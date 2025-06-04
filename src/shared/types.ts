import { ReadingTimeInfo } from "./reading-time";

export interface StorageData {
  apiKey?: string;
  model?: string;
  summaryLength?: "short" | "medium" | "long";
  summaryLanguage?: string;
  theme?: "light" | "dark" | "auto";
}

export interface SummaryRequest {
  text: string;
  length: "short" | "medium" | "long";
  language?: string;
}

export interface SummaryResponse {
  summary: string;
  tldr?: string;
  readingTime?: ReadingTimeInfo;
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

export const LANGUAGES = [
  { code: "auto", name: "Auto (Original Language)" },
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "tr", name: "Türkçe" },
  { code: "pl", name: "Polski" },
  { code: "nl", name: "Nederlands" },
  { code: "sv", name: "Svenska" },
  { code: "da", name: "Dansk" },
  { code: "no", name: "Norsk" },
  { code: "fi", name: "Suomi" },
] as const;

export const DEFAULT_SETTINGS: StorageData = {
  model: "openai/gpt-4o-mini",
  summaryLength: "medium",
  summaryLanguage: "auto",
  theme: "auto",
};

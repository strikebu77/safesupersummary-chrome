import { OpenRouterResponse, SummaryRequest } from "./types";
import { Storage } from "./storage";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export class OpenRouterAPI {
  static async summarize(request: SummaryRequest): Promise<string> {
    const settings = await Storage.getAll();

    if (!settings.apiKey) {
      throw new Error(
        "API key not configured. Please set your OpenRouter API key in the extension options.",
      );
    }

    const lengthMap = {
      short: 2,
      medium: 4,
      long: 8,
    };

    const sentences = lengthMap[request.length];

    const systemPrompt = `You are an expert summarizer. Your job is to produce clear, concise, and accurate summaries that capture the essential information and intent of the original text, while remaining highly readable. Prioritize the main ideas, key arguments, and critical details. Avoid unnecessary repetition or filler. Write in fluent, natural language, and ensure the summary is useful for someone who has not read the original.`;

    const userPrompt = `Summarize the following page content in approximately ${sentences} sentences. Be concise but comprehensive:\n\n${request.text}`;

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": chrome.runtime.getURL(""),
          "X-Title": "Page Summarizer Extension",
        },
        body: JSON.stringify({
          model: settings.model || "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `API request failed: ${response.statusText}`,
        );
      }

      const data: OpenRouterResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from AI model");
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to generate summary");
    }
  }
}

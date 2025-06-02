import { OpenRouterResponse, SummaryRequest, LANGUAGES } from "./types";
import { Storage } from "./storage";
import { ReadingTimeCalculator } from "./reading-time";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export class OpenRouterAPI {
  static async summarize(
    request: SummaryRequest,
  ): Promise<{ summary: string; readingTime: any }> {
    const settings = await Storage.getAll();

    if (!settings.apiKey) {
      throw new Error(
        "API key not configured. Please set your OpenRouter API key in the extension options.",
      );
    }

    // Calculate adaptive summary length based on text length
    const wordCount = request.text.split(/\s+/).length;

    // Base multipliers for different length preferences
    const lengthMultipliers = {
      short: 0.8,
      medium: 1.0,
      long: 1.3,
    };

    const multiplier = lengthMultipliers[request.length];

    // Calculate adaptive sentence count based on text length
    let targetSentences: number;
    let maxTokens: number;

    if (wordCount < 200) {
      // Very short text: 1-3 sentences
      targetSentences = Math.max(1, Math.ceil(2 * multiplier));
      maxTokens = 150;
    } else if (wordCount < 500) {
      // Short text: 2-5 sentences
      targetSentences = Math.max(2, Math.ceil(3 * multiplier));
      maxTokens = 250;
    } else if (wordCount < 1000) {
      // Medium text: 3-7 sentences
      targetSentences = Math.max(3, Math.ceil(5 * multiplier));
      maxTokens = 400;
    } else if (wordCount < 2000) {
      // Long text: 5-10 sentences
      targetSentences = Math.max(4, Math.ceil(7 * multiplier));
      maxTokens = 600;
    } else if (wordCount < 5000) {
      // Very long text: 8-15 sentences
      targetSentences = Math.max(6, Math.ceil(12 * multiplier));
      maxTokens = 900;
    } else {
      // Extremely long text: 10-20 sentences
      targetSentences = Math.max(8, Math.ceil(16 * multiplier));
      maxTokens = 1200;
    }

    // Determine the target language for the summary
    const targetLanguage =
      request.language || settings.summaryLanguage || "auto";

    // Get language name for the prompt
    const languageInfo = LANGUAGES.find((lang) => lang.code === targetLanguage);
    const languageName =
      languageInfo?.name || "the same language as the original text";

    const systemPrompt = `You are an expert summarizer. Your job is to produce clear, concise, and accurate summaries that capture the essential information and intent of the original text, while remaining highly readable. Prioritize the main ideas, key arguments, and critical details. Avoid unnecessary repetition or filler. Write in fluent, natural language, and ensure the summary is useful for someone who has not read the original.

The summary length should be proportional to the original text length - longer texts deserve more comprehensive summaries that preserve important details and context.`;

    let userPrompt: string;

    if (targetLanguage === "auto") {
      userPrompt = `Summarize the following page content in approximately ${targetSentences} sentences. Write the summary in the same language as the original text. The original text has ${wordCount} words, so provide a proportionally detailed summary that captures the key information comprehensively:\n\n${request.text}`;
    } else {
      userPrompt = `Summarize the following page content in approximately ${targetSentences} sentences. Write the summary in ${languageName}. The original text has ${wordCount} words, so provide a proportionally detailed summary that captures the key information comprehensively:\n\n${request.text}`;
    }

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
          max_tokens: maxTokens,
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

      const summary = data.choices[0].message.content.trim();

      // Calculate reading time information
      const readingTime = ReadingTimeCalculator.calculateReadingTimeInfo(
        request.text,
        summary,
      );

      return { summary, readingTime };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to generate summary");
    }
  }
}

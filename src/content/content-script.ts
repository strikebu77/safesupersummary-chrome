import { Message } from "@/shared/types";

// Simple readability extraction without external dependencies
function extractReadableText(): string {
  // Clone the document to avoid modifying the original
  const documentClone = document.cloneNode(true) as Document;

  // Remove script and style elements
  const scripts = documentClone.querySelectorAll("script, style, noscript");
  scripts.forEach((el) => el.remove());

  // Remove hidden elements
  const allElements = documentClone.querySelectorAll("*");
  allElements.forEach((el) => {
    const style = window.getComputedStyle(el as Element);
    if (style.display === "none" || style.visibility === "hidden") {
      el.remove();
    }
  });

  // Try to find main content areas
  const contentSelectors = [
    "main",
    "article",
    '[role="main"]',
    '[role="article"]',
    ".content",
    "#content",
    ".post",
    ".entry-content",
    ".article-content",
    ".post-content",
    ".main-content",
  ];

  let mainContent: Element | null = null;
  for (const selector of contentSelectors) {
    mainContent = documentClone.querySelector(selector);
    if (mainContent) break;
  }

  // If no main content found, use body
  if (!mainContent) {
    mainContent = documentClone.body;
  }

  // Extract text from paragraphs, headings, lists, etc.
  const textElements = mainContent.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, pre",
  );
  const textParts: string[] = [];

  textElements.forEach((el) => {
    const text = (el as HTMLElement).innerText?.trim();
    if (text && text.length > 20) {
      // Filter out very short text
      textParts.push(text);
    }
  });

  // If not enough content found, try a broader approach
  if (textParts.length < 5) {
    const bodyText = document.body.innerText;
    return bodyText.substring(0, 10000); // Limit to 10k chars
  }

  // Join and clean up
  let fullText = textParts.join("\n\n");

  // Remove excessive whitespace
  fullText = fullText.replace(/\n{3,}/g, "\n\n");
  fullText = fullText.replace(/\s{2,}/g, " ");

  // Limit total length to prevent API issues
  if (fullText.length > 10000) {
    fullText = fullText.substring(0, 10000) + "...";
  }

  return fullText;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    if (message.type === "GET_PAGE_TEXT") {
      try {
        const text = extractReadableText();
        sendResponse({ success: true, text });
      } catch (error) {
        sendResponse({
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to extract text",
        });
      }
    }
    return true; // Keep the message channel open for async response
  },
);

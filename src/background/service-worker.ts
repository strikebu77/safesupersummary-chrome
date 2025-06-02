import { Message, SummaryRequest } from "@/shared/types";
import { Storage } from "@/shared/storage";
import { OpenRouterAPI } from "@/shared/api";

// Store current summary and reading time in memory
let currentSummary: string | null = null;
let currentReadingTime: any = null;
let currentTabId: number | null = null;

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-page",
    title: "Summarize this page",
    contexts: ["page"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize-page" && tab?.id) {
    summarizeTab(tab.id);
  }
});

// Handle browser action clicks
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    summarizeTab(tab.id);
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.type === "SUMMARIZE") {
      handleSummarizeRequest(message.data)
        .then(sendResponse)
        .catch((error) => sendResponse({ error: error.message }));
      return true; // Keep channel open for async response
    }

    if (message.type === "GET_CURRENT_SUMMARY") {
      sendResponse({
        summary: currentSummary,
        readingTime: currentReadingTime,
      });
    }
  },
);

// Handle tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateBadgeForTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    updateBadgeForTab(tabId);
  }
});

async function summarizeTab(tabId: number) {
  try {
    // Update badge to show loading
    await chrome.action.setBadgeText({ text: "...", tabId });
    await chrome.action.setBadgeBackgroundColor({ color: "#FFA500", tabId });

    // Get page text from content script
    const response = await chrome.tabs.sendMessage(tabId, {
      type: "GET_PAGE_TEXT",
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to extract page text");
    }

    // Get user settings
    const settings = await Storage.getAll();

    // Generate summary
    const result = await OpenRouterAPI.summarize({
      text: response.text,
      length: settings.summaryLength || "medium",
      language: settings.summaryLanguage,
    });

    // Store summary and reading time
    currentSummary = result.summary;
    currentReadingTime = result.readingTime;
    currentTabId = tabId;

    // Update badge to show success
    await chrome.action.setBadgeText({ text: "✓", tabId });
    await chrome.action.setBadgeBackgroundColor({ color: "#4CAF50", tabId });

    // Open popup to show summary
    await chrome.action.openPopup();
  } catch (error) {
    console.error("Summarization error:", error);

    // Update badge to show error
    await chrome.action.setBadgeText({ text: "!", tabId });
    await chrome.action.setBadgeBackgroundColor({ color: "#F44336", tabId });

    // Store error message
    currentSummary = null;
    currentReadingTime = null;
    currentTabId = tabId;
  }
}

async function handleSummarizeRequest(data: SummaryRequest) {
  try {
    // Get user settings to include language preference
    const settings = await Storage.getAll();
    const requestWithLanguage = {
      ...data,
      language: data.language || settings.summaryLanguage,
    };

    const result = await OpenRouterAPI.summarize(requestWithLanguage);
    return {
      success: true,
      summary: result.summary,
      readingTime: result.readingTime,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate summary",
    };
  }
}

async function updateBadgeForTab(tabId: number) {
  if (tabId === currentTabId && currentSummary) {
    await chrome.action.setBadgeText({ text: "✓", tabId });
    await chrome.action.setBadgeBackgroundColor({ color: "#4CAF50", tabId });
  } else {
    await chrome.action.setBadgeText({ text: "", tabId });
  }
}

// Export for module
export {};

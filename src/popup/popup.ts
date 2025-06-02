import { Storage } from "@/shared/storage";

// DOM elements
const elements = {
  loading: document.getElementById("loading") as HTMLDivElement,
  error: document.getElementById("error") as HTMLDivElement,
  errorMessage: document.getElementById(
    "error-message",
  ) as HTMLParagraphElement,
  summaryContainer: document.getElementById(
    "summary-container",
  ) as HTMLDivElement,
  summaryText: document.getElementById("summary-text") as HTMLDivElement,
  noContent: document.getElementById("no-content") as HTMLDivElement,
  copyBtn: document.getElementById("copy-btn") as HTMLButtonElement,
  regenerateBtn: document.getElementById("regenerate-btn") as HTMLButtonElement,
  summarizeBtn: document.getElementById("summarize-btn") as HTMLButtonElement,
  settingsBtn: document.getElementById("settings-btn") as HTMLButtonElement,
};

// State
let currentSummary: string | null = null;

// Initialize popup
async function init() {
  // Check if we have a current summary
  const response = await chrome.runtime.sendMessage({
    type: "GET_CURRENT_SUMMARY",
  });

  if (response?.summary) {
    showSummary(response.summary);
  } else {
    showNoContent();
  }

  // Set up event listeners
  elements.copyBtn.addEventListener("click", copyToClipboard);
  elements.regenerateBtn.addEventListener("click", regenerateSummary);
  elements.summarizeBtn.addEventListener("click", summarizeCurrentPage);
  elements.settingsBtn.addEventListener("click", openOptions);
}

// Show different UI states
function showLoading() {
  hideAll();
  elements.loading.classList.remove("hidden");
}

function showError(message: string) {
  hideAll();
  elements.errorMessage.textContent = message;
  elements.error.classList.remove("hidden");
}

function showSummary(summary: string) {
  hideAll();
  currentSummary = summary;
  elements.summaryText.textContent = summary;
  elements.summaryContainer.classList.remove("hidden");
}

function showNoContent() {
  hideAll();
  elements.noContent.classList.remove("hidden");
}

function hideAll() {
  elements.loading.classList.add("hidden");
  elements.error.classList.add("hidden");
  elements.summaryContainer.classList.add("hidden");
  elements.noContent.classList.add("hidden");
}

// Actions
async function copyToClipboard() {
  if (!currentSummary) return;

  try {
    await navigator.clipboard.writeText(currentSummary);

    // Show feedback
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = "Copied!";
    elements.copyBtn.style.backgroundColor = "var(--primary-color)";

    setTimeout(() => {
      elements.copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy to Clipboard
      `;
      elements.copyBtn.style.backgroundColor = "";
    }, 2000);
  } catch (error) {
    console.error("Failed to copy:", error);
  }
}

async function regenerateSummary() {
  await summarizeCurrentPage();
}

async function summarizeCurrentPage() {
  showLoading();

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) {
      throw new Error("No active tab found");
    }

    // Check if API key is configured
    const apiKey = await Storage.get("apiKey");
    if (!apiKey) {
      showError(
        "Please configure your OpenRouter API key in the extension settings.",
      );
      return;
    }

    // Get page text
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "GET_PAGE_TEXT",
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to extract page text");
    }

    // Get settings
    const settings = await Storage.getAll();

    // Send to background for summarization
    const summaryResponse = await chrome.runtime.sendMessage({
      type: "SUMMARIZE",
      data: {
        text: response.text,
        length: settings.summaryLength || "medium",
      },
    });

    if (summaryResponse.success) {
      showSummary(summaryResponse.summary);
    } else {
      showError(summaryResponse.error || "Failed to generate summary");
    }
  } catch (error) {
    console.error("Summarization error:", error);
    showError(
      error instanceof Error ? error.message : "Failed to summarize page",
    );
  }
}

function openOptions() {
  chrome.runtime.openOptionsPage();
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);

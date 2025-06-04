import { Storage } from "@/shared/storage";
import { ReadingTimeCalculator } from "@/shared/reading-time";

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
  tldrContainer: document.getElementById("tldr-container") as HTMLDivElement,
  tldrText: document.getElementById("tldr-text") as HTMLDivElement,
  summaryText: document.getElementById("summary-text") as HTMLDivElement,
  readingTimeInfo: document.getElementById(
    "reading-time-info",
  ) as HTMLDivElement,
  timeSaved: document.getElementById("time-saved") as HTMLSpanElement,
  noContent: document.getElementById("no-content") as HTMLDivElement,
  copyBtn: document.getElementById("copy-btn") as HTMLButtonElement,
  regenerateBtn: document.getElementById("regenerate-btn") as HTMLButtonElement,
  summarizeBtn: document.getElementById("summarize-btn") as HTMLButtonElement,
  settingsBtn: document.getElementById("settings-btn") as HTMLButtonElement,
  toggleSettingsBtn: document.getElementById(
    "toggle-settings-btn",
  ) as HTMLButtonElement,
  settingsPanel: document.getElementById("settings-panel") as HTMLDivElement,
  popupModel: document.getElementById("popup-model") as HTMLSelectElement,
  popupSummaryLength: document.getElementById(
    "popup-summary-length",
  ) as HTMLSelectElement,
  popupSummaryLanguage: document.getElementById(
    "popup-summary-language",
  ) as HTMLSelectElement,
  popupTheme: document.getElementById("popup-theme") as HTMLSelectElement,
};

// State
let currentSummary: string | null = null;
let currentTldr: string | null = null;
let settingsPanelOpen = false;

// Initialize popup
async function init() {
  // Load settings first
  await loadSettings();

  // Check if we have a current summary
  const response = await chrome.runtime.sendMessage({
    type: "GET_CURRENT_SUMMARY",
  });

  if (response?.summary) {
    showSummary(response.summary, response.readingTime, response.tldr);
  } else {
    showNoContent();
  }

  // Set up event listeners
  elements.copyBtn.addEventListener("click", copyToClipboard);
  elements.regenerateBtn.addEventListener("click", regenerateSummary);
  elements.summarizeBtn.addEventListener("click", summarizeCurrentPage);
  elements.settingsBtn.addEventListener("click", openOptions);
  elements.toggleSettingsBtn.addEventListener("click", toggleSettingsPanel);

  // Settings change listeners
  elements.popupModel.addEventListener("change", saveSettings);
  elements.popupSummaryLength.addEventListener("change", saveSettings);
  elements.popupSummaryLanguage.addEventListener("change", saveSettings);
  elements.popupTheme.addEventListener("change", (e) => {
    saveSettings();
    const theme = (e.target as HTMLSelectElement).value as
      | "light"
      | "dark"
      | "auto";
    applyTheme(theme);
  });
}

// Load settings from storage
async function loadSettings() {
  const settings = await Storage.getAll();

  if (settings.model) {
    elements.popupModel.value = settings.model;
  }

  if (settings.summaryLength) {
    elements.popupSummaryLength.value = settings.summaryLength;
  }

  if (settings.summaryLanguage) {
    elements.popupSummaryLanguage.value = settings.summaryLanguage;
  }

  if (settings.theme) {
    elements.popupTheme.value = settings.theme;
    applyTheme(settings.theme);
  }
}

// Save settings to storage
async function saveSettings() {
  try {
    await Storage.setMultiple({
      model: elements.popupModel.value,
      summaryLength: elements.popupSummaryLength.value as
        | "short"
        | "medium"
        | "long",
      summaryLanguage: elements.popupSummaryLanguage.value,
      theme: elements.popupTheme.value as "light" | "dark" | "auto",
    });
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

// Apply theme
function applyTheme(theme: "light" | "dark" | "auto") {
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

// Toggle settings panel
function toggleSettingsPanel() {
  settingsPanelOpen = !settingsPanelOpen;

  if (settingsPanelOpen) {
    elements.settingsPanel.classList.remove("hidden");
    elements.toggleSettingsBtn.classList.add("rotated");
  } else {
    elements.settingsPanel.classList.add("hidden");
    elements.toggleSettingsBtn.classList.remove("rotated");
  }
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

function showSummary(summary: string, readingTime?: any, tldr?: string) {
  hideAll();
  currentSummary = summary;
  currentTldr = tldr || null;

  // Display TL;DR if available
  if (tldr) {
    elements.tldrText.textContent = tldr;
    elements.tldrContainer.style.display = "block";
  } else {
    elements.tldrContainer.style.display = "none";
  }

  elements.summaryText.textContent = summary;

  // Display reading time information if available
  if (readingTime) {
    elements.timeSaved.textContent = ReadingTimeCalculator.formatTimeSaved(
      readingTime.timeSavedMinutes,
      readingTime.timeSavedPercentage,
    );
    elements.readingTimeInfo.style.display = "block";
  } else {
    elements.readingTimeInfo.style.display = "none";
  }

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
    let textToCopy = "";

    // Add TL;DR if available
    if (currentTldr) {
      textToCopy += `TL;DR: ${currentTldr}\n\n`;
    }

    // Add main summary
    textToCopy += currentSummary;

    await navigator.clipboard.writeText(textToCopy);

    // Show feedback
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
        language: settings.summaryLanguage,
      },
    });

    if (summaryResponse.success) {
      showSummary(
        summaryResponse.summary,
        summaryResponse.readingTime,
        summaryResponse.tldr,
      );
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

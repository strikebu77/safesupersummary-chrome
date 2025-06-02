import { Storage } from "@/shared/storage";
import { DEFAULT_SETTINGS } from "@/shared/types";

// DOM elements
const elements = {
  apiKeyInput: document.getElementById("api-key") as HTMLInputElement,
  toggleVisibilityBtn: document.getElementById(
    "toggle-visibility",
  ) as HTMLButtonElement,
  modelSelect: document.getElementById("model") as HTMLSelectElement,
  summaryLengthSelect: document.getElementById(
    "summary-length",
  ) as HTMLSelectElement,
  summaryLanguageSelect: document.getElementById(
    "summary-language",
  ) as HTMLSelectElement,
  themeSelect: document.getElementById("theme") as HTMLSelectElement,
  saveBtn: document.getElementById("save-btn") as HTMLButtonElement,
  resetBtn: document.getElementById("reset-btn") as HTMLButtonElement,
  status: document.getElementById("status") as HTMLDivElement,
};

// State
let isApiKeyVisible = false;

// Initialize
async function init() {
  await loadSettings();
  setupEventListeners();
}

// Load current settings
async function loadSettings() {
  const settings = await Storage.getAll();

  if (settings.apiKey) {
    elements.apiKeyInput.value = settings.apiKey;
  }

  if (settings.model) {
    elements.modelSelect.value = settings.model;
  }

  if (settings.summaryLength) {
    elements.summaryLengthSelect.value = settings.summaryLength;
  }

  if (settings.summaryLanguage) {
    elements.summaryLanguageSelect.value = settings.summaryLanguage;
  }

  if (settings.theme) {
    elements.themeSelect.value = settings.theme;
    applyTheme(settings.theme);
  }
}

// Setup event listeners
function setupEventListeners() {
  elements.toggleVisibilityBtn.addEventListener(
    "click",
    toggleApiKeyVisibility,
  );
  elements.saveBtn.addEventListener("click", saveSettings);
  elements.resetBtn.addEventListener("click", resetSettings);
  elements.themeSelect.addEventListener("change", (e) => {
    const theme = (e.target as HTMLSelectElement).value as
      | "light"
      | "dark"
      | "auto";
    applyTheme(theme);
  });
}

// Toggle API key visibility
function toggleApiKeyVisibility() {
  isApiKeyVisible = !isApiKeyVisible;
  elements.apiKeyInput.type = isApiKeyVisible ? "text" : "password";

  // Update icon
  elements.toggleVisibilityBtn.innerHTML = isApiKeyVisible
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`;
}

// Save settings
async function saveSettings() {
  try {
    const apiKey = elements.apiKeyInput.value.trim();
    const model = elements.modelSelect.value;
    const summaryLength = elements.summaryLengthSelect.value as
      | "short"
      | "medium"
      | "long";
    const summaryLanguage = elements.summaryLanguageSelect.value;
    const theme = elements.themeSelect.value as "light" | "dark" | "auto";

    // Validate API key format
    if (apiKey && !apiKey.startsWith("sk-or-")) {
      showStatus(
        'Invalid API key format. OpenRouter keys start with "sk-or-"',
        "error",
      );
      return;
    }

    // Save to storage
    await Storage.setMultiple({
      apiKey,
      model,
      summaryLength,
      summaryLanguage,
      theme,
    });

    showStatus("Settings saved successfully!", "success");
  } catch (error) {
    console.error("Failed to save settings:", error);
    showStatus("Failed to save settings", "error");
  }
}

// Reset settings to defaults
async function resetSettings() {
  try {
    // Clear storage and set defaults
    await Storage.clear();
    await Storage.setMultiple(DEFAULT_SETTINGS);

    // Reload settings
    await loadSettings();

    // Clear API key field
    elements.apiKeyInput.value = "";

    showStatus("Settings reset to defaults", "success");
  } catch (error) {
    console.error("Failed to reset settings:", error);
    showStatus("Failed to reset settings", "error");
  }
}

// Show status message
function showStatus(message: string, type: "success" | "error") {
  elements.status.textContent = message;
  elements.status.className = `status ${type}`;
  elements.status.classList.remove("hidden");

  // Hide after 3 seconds
  setTimeout(() => {
    elements.status.classList.add("hidden");
  }, 3000);
}

// Apply theme
function applyTheme(theme: "light" | "dark" | "auto") {
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);

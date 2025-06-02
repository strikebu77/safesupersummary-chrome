# Page Summarizer Chrome Extension

A production-ready Chrome Extension that uses AI to generate concise summaries of web pages.

## Features

- 🤖 **AI-Powered Summaries**: Uses OpenRouter API to access multiple LLMs (GPT-4, Claude, Gemini, etc.)
- 📝 **Smart Text Extraction**: Automatically detects and extracts main content from web pages
- ⚡ **Quick Access**: Summarize via browser action, context menu, or popup
- 🎨 **Modern UI**: Clean interface with dark/light mode support
- ⚙️ **Customizable**: Choose AI model, summary length, and theme
- 📋 **Copy to Clipboard**: Easy sharing of generated summaries

## How to Install & Test

### Prerequisites

- Node.js 18+ and npm
- Chrome browser (version 105+)
- OpenRouter API key from [openrouter.ai/keys](https://openrouter.ai/keys)

### Build Instructions

1. **Clone and install dependencies:**

   ```bash
   cd page-summarizer
   npm install
   ```

2. **Replace placeholder icons (IMPORTANT):**
   Replace the placeholder files in `src/assets/` with actual PNG icons:

   - `icon-16.png` - 16x16 pixels
   - `icon-48.png` - 48x48 pixels
   - `icon-128.png` - 128x128 pixels

3. **Build the extension:**

   ```bash
   npm run build
   ```

   This creates a `dist/` folder with the compiled extension.

4. **For development (with watch mode):**
   ```bash
   npm run dev
   ```

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder
5. The extension icon should appear in your toolbar

### Initial Setup

1. Click the extension icon and then the settings gear
2. Enter your OpenRouter API key
3. Select your preferred AI model
4. Choose summary length preference
5. Save settings

### Usage Demo

1. **Summarize current page:**

   - Click the extension icon in the toolbar
   - Click "Summarize Current Page" button
   - Wait for the AI to generate the summary

2. **Context menu:**

   - Right-click anywhere on a webpage
   - Select "Summarize this page"

3. **Visual feedback:**

   - Badge shows "..." while processing
   - Green checkmark (✓) when summary is ready
   - Red exclamation (!) if an error occurs

4. **Copy summary:**
   - Click "Copy to Clipboard" to share the summary
   - Button shows "Copied!" confirmation

### Create Distribution Package

```bash
npm run zip
```

This creates `page-summarizer.zip` ready for Chrome Web Store submission.

## Project Structure

```
page-summarizer/
├── src/
│   ├── background/      # Service worker
│   ├── content/         # Content script for text extraction
│   ├── popup/           # Popup UI
│   ├── options/         # Settings page
│   ├── shared/          # Shared utilities and types
│   └── assets/          # Icons (replace placeholders)
├── public/              # Static files (manifest.json)
└── dist/                # Built extension (generated)
```

## Important Notes

- **MUST replace placeholder icon files** in `src/assets/` with actual PNG icons before building
- The extension requires an active internet connection for AI summaries
- API usage is subject to OpenRouter's pricing and rate limits
- Text extraction works best on article-style content

## Development

- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- Modify `vite.config.ts` for build customization

## License

MIT

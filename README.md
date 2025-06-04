# Page Summarizer Chrome Extension

A production-ready Chrome Extension that uses AI to generate concise summaries of web pages.

## Features

- 🤖 **AI-Powered Summaries**: Uses OpenRouter API to access multiple LLMs (GPT-4, Claude, Gemini, etc.)
- ⚡ **TL;DR Generation**: Automatically generates ultra-concise one-sentence summaries alongside detailed summaries
- 📏 **Adaptive Summary Length**: Automatically adjusts summary length based on original text size - short articles get concise summaries, long articles get comprehensive ones
- ⏱️ **Reading Time Analysis**: Shows estimated reading time for original content vs summary, with time savings percentage
- 🌍 **Multi-Language Support**: Choose summary language or auto-detect from original content
- 📝 **Smart Text Extraction**: Automatically detects and extracts main content from web pages
- ⚡ **Quick Access**: Summarize via browser action, context menu, or popup
- 🎨 **Modern UI**: Clean interface with dark/light mode support
- ⚙️ **Customizable**: Choose AI model, summary length preference (concise/balanced/detailed), language, and theme
- 📋 **Copy to Clipboard**: Easy sharing of generated summaries with TL;DR included
- 🔧 **Quick Settings**: Access and modify all settings directly from the popup interface

## TL;DR Feature

The extension now includes an intelligent TL;DR (Too Long; Didn't Read) feature that provides instant understanding of any content:

### What is TL;DR?

- **Ultra-concise summary**: A single sentence that captures the most essential point of the entire content
- **Instant understanding**: Get the main takeaway without reading the full summary
- **Dual AI processing**: Separate AI requests ensure both TL;DR and detailed summary are optimized for their purpose

### How it Works

1. **Dual Generation**: When you summarize content, the extension makes two separate AI requests:

   - One for the detailed summary (adaptive length based on content)
   - One specifically for the TL;DR (always one sentence)

2. **Smart Display**: The TL;DR appears prominently above the main summary with distinctive styling

3. **Language Consistency**: TL;DR respects your language settings, appearing in the same language as your summary preference

### Visual Design

- **Prominent placement**: TL;DR appears at the top with a green border and "TL;DR:" label
- **Clear hierarchy**: Visually distinct from the main summary while maintaining design consistency
- **Responsive layout**: Adapts to different themes (light/dark mode)

### Copy Functionality

When you copy the summary to clipboard, both TL;DR and the full summary are included:

```
TL;DR: [One sentence summary]

[Full detailed summary]
```

### Benefits

- **Quick scanning**: Instantly understand if the full content is worth your time
- **Meeting preparation**: Get key points for discussions without reading everything
- **Social sharing**: Perfect length for sharing the essence of articles
- **Information triage**: Quickly categorize and prioritize content consumption

## Reading Time Analysis

The extension now includes intelligent reading time analysis that helps you understand the time savings from using summaries:

### What it Shows

- **Time Saved**: Shows both absolute time saved and percentage reduction from reading the summary instead of the full content

### How it Works

- Uses an average reading speed of 180 words per minute (realistic for web content reading)
- Accurately counts words in both original text and summary
- Displays time in a user-friendly format (minutes for short content, hours and minutes for longer content)
- Shows percentage savings to help you understand the efficiency gain

### Example Display

```
Time saved: 6 min (75%)
```

This feature helps you:

- **Understand the value** of using summaries for time management
- **Make informed decisions** about when to read the full content vs the summary
- **Track your reading efficiency** across different types of content

## Quick Settings in Popup

The extension now features a convenient settings panel directly in the popup interface:

### Accessing Quick Settings

1. Click the extension icon to open the popup
2. Click the dropdown arrow (⌄) next to the settings gear icon
3. The settings panel will expand, showing all available options

### Available Quick Settings

- **Model Selection**: Choose between GPT-4o, GPT-4o Mini, Claude Sonnet 4, Gemini, and Grok 3 Beta
- **Summary Length**: Select Concise, Balanced, or Detailed preferences
- **Language**: Choose from 20+ supported languages or use Auto-detect
- **Theme**: Switch between Auto (System), Light, or Dark themes

### Benefits

- **Instant Access**: No need to open the full settings page for common adjustments
- **Real-time Changes**: Settings are saved automatically as you change them
- **Theme Preview**: See theme changes applied immediately
- **Compact Design**: Settings panel fits seamlessly within the popup interface

## Language Support

The extension supports summaries in multiple languages:

### Supported Languages

- **Auto (Original Language)**: Automatically detects and uses the same language as the source content
- **English** - English
- **Русский** - Russian
- **Español** - Spanish
- **Français** - French
- **Deutsch** - German
- **Italiano** - Italian
- **Português** - Portuguese
- **中文** - Chinese
- **日本語** - Japanese
- **한국어** - Korean
- **العربية** - Arabic
- **हिन्दी** - Hindi
- **Türkçe** - Turkish
- **Polski** - Polish
- **Nederlands** - Dutch
- **Svenska** - Swedish
- **Dansk** - Danish
- **Norsk** - Norwegian
- **Suomi** - Finnish

### How Language Selection Works

1. **Auto Mode (Default)**: The AI automatically detects the language of the original content and generates the summary in the same language
2. **Specific Language**: Choose any supported language to force summaries in that language, regardless of the source content language
3. **Intelligent Translation**: When a specific language is selected, the AI not only translates but also adapts the summary to be natural and culturally appropriate for that language

## Adaptive Summary System

The extension now features an intelligent summary length system that adapts to the original text size:

### How it Works

- **Very short texts** (< 200 words): 1-3 sentences
- **Short texts** (200-500 words): 2-5 sentences
- **Medium texts** (500-1000 words): 3-7 sentences
- **Long texts** (1000-2000 words): 5-10 sentences
- **Very long texts** (2000-5000 words): 8-15 sentences
- **Extremely long texts** (5000+ words): 10-20 sentences

### Length Preferences

Your length preference (Concise/Balanced/Detailed) acts as a multiplier:

- **Concise**: 20% shorter summaries
- **Balanced**: Standard adaptive length
- **Detailed**: 30% longer summaries

This ensures that:

- Short articles aren't over-summarized into meaningless fragments
- Long articles get comprehensive summaries that preserve important details
- User preferences are still respected across all text lengths

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
4. Choose summary length preference (Concise/Balanced/Detailed)
5. Select summary language (Auto for original language, or choose a specific language)
6. Choose your preferred theme (Auto/Light/Dark)
7. Save settings

### Usage Demo

1. **Summarize current page:**

   - Click the extension icon in the toolbar
   - Click "Summarize Current Page" button
   - Wait for the AI to generate the summary

2. **Quick settings adjustment:**

   - Click the extension icon to open popup
   - Click the dropdown arrow (⌄) to expand settings panel
   - Adjust model, length, language, or theme as needed
   - Settings are saved automatically

3. **Context menu:**

   - Right-click anywhere on a webpage
   - Select "Summarize this page"

4. **Visual feedback:**

   - Badge shows "..." while processing
   - Green checkmark (✓) when summary is ready
   - Red exclamation (!) if an error occurs

5. **Copy summary:**
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

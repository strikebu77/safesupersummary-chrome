import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        "service-worker": resolve(
          __dirname,
          "src/background/service-worker.ts",
        ),
        "content-script": resolve(__dirname, "src/content/content-script.ts"),
        sidepanel: resolve(__dirname, "src/sidepanel/sidepanel.html"),
        options: resolve(__dirname, "src/options/options.html"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep service worker and content script names as expected by manifest
          if (chunkInfo.name === "service-worker") return "service-worker.js";
          if (chunkInfo.name === "content-script") return "content-script.js";
          return "[name].js";
        },
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          // Place HTML files in root, CSS files in root, other assets in assets folder
          if (assetInfo.name?.endsWith(".html")) return "[name].[ext]";
          if (assetInfo.name?.endsWith(".css")) return "[name].[ext]";
          return "assets/[name].[ext]";
        },
      },
    },
    target: "chrome105",
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV === "development",
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json",
          dest: ".",
        },
        {
          src: "src/assets/*",
          dest: "assets",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

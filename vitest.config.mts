/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  resolve: {
    // 🛡️ UNIFICACIÓN DE IDENTIDAD: Forzamos a Vitest a usar el motor de navegador
    conditions: ["browser", "development"],
    alias: {
      "@": path.resolve(__dirname, "./apps/web-pro/src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    globals: true,
    css: true,
    fileParallelism: false,
    maxWorkers: 1,
    exclude: ["**/node_modules/**", "**/dist/**", "**/apps/**/e2e/**"],

    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["apps/web-pro/src/__tests__/unit/**/*.test.{ts,tsx}"],
        },
      },
      {
        plugins: [
          react({ jsxRuntime: "automatic" }),
          tsconfigPaths({ root: path.resolve(__dirname, ".") }),
        ],
        test: {
          name: "components",
          environment: "jsdom",
          setupFiles: [
            path.resolve(__dirname, "apps/web-pro/src/__tests__/setup.ts"),
          ],
          include: ["apps/web-pro/src/__tests__/components/**/*.test.{ts,tsx}"],
          server: {
            deps: {
              inline: ["react", "react-dom", "@testing-library/react"],
            },
          },
        },
      },
    ],
  },
});

// vitest.config.mts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/apps/**/e2e/**"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});

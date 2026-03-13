import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/apps/**/e2e/**"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});

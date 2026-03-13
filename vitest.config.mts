import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});

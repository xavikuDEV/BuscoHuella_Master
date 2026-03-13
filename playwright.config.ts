import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps',
  testMatch: '**/e2e/*.test.ts',
  use: {
    trace: 'on-first-retry',
  },
});

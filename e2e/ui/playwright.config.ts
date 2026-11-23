import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  outputDir: '/tmp/weather-footer-playwright-results',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium' },
  webServer: {
    command: 'node serve.mjs',
    // The second preview starts last; waiting for it makes both builds ready.
    url: 'http://127.0.0.1:5174',
    timeout: 120000,
    reuseExistingServer: false,
  },
});

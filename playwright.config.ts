import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';

dotenv.config({
  path: '.env.e2e',
});

const frontendUrl = 'http://localhost:5174';

export default defineConfig({
  testDir: './e2e',

  outputDir: './test-results',

  use: {
    baseURL: frontendUrl,
  },

  webServer: {
    command: 'npm run e2e:dev',
    url: frontendUrl,
    reuseExistingServer: true,
  },
});

import { defineConfig } from "@playwright/test";
const baseURL = "http://127.0.0.1:4173" + (process.env.VITE_BASE_PATH ?? "/");
export default defineConfig({
  testDir: "./tests",
  use: { baseURL, headless: true,
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] } : {} },
  webServer: { command: "npm run preview -- --host 127.0.0.1", url: baseURL, reuseExistingServer: !process.env.CI }
});

import { defineConfig, devices } from "@playwright/test";
import { scryptSync, randomUUID } from "node:crypto";
import { join } from "node:path";
import { tmpdir } from "node:os";
const encoded = `e2e-salt:${scryptSync("e2e-password-strong", "e2e-salt", 64).toString("hex")}`;
export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.ts",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    env: {
      APP_URL: "http://localhost:3100",
      DATABASE_PATH: join(tmpdir(), `dk-e2e-${randomUUID()}.sqlite`),
      SESSION_SECRET: "test-only-secret-at-least-thirty-two-characters",
      ADMIN_PASSWORD_HASH: encoded,
      STAFF_PASSWORD_HASH: encoded,
      VIEWER_PASSWORD_HASH: encoded,
    },
  },
});

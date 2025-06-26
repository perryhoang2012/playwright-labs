import { defineConfig } from "@playwright/test";
import MyReporter from "./tests/my-awesome-reporter";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    actionTimeout: 15000,
    headless: true,
    trace: "on-first-retry",
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    // ["./tests/my-awesome-reporter.ts"],
    ["html", { open: "always" }],
  ],
  /* Configure projects for major browsers */

  outputDir: "test-results",
});

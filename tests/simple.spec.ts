import { test, expect } from "@playwright/test";
import { sendWebhookNotification } from "./helpers/webhook";

let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  hasFailed: false,
};

// Test case bị skip vì điều kiện không thỏa mãn
test.skip("skip test with condition", async () => {
  testResults.total++;
  testResults.skipped++;
  try {
    expect(1 + 1).toBe(2);
    testResults.passed++;
  } catch (error) {
    testResults.hasFailed = true;
    testResults.failed++;
    throw error;
  }
});

// Test case bị skip dựa trên điều kiện
test("skip test based on condition", async ({ browserName }) => {
  testResults.total++;
  if (browserName === "firefox") {
    testResults.skipped++;
  }
  test.skip(browserName === "firefox", "This test is not supported in Firefox");
  try {
    expect(2 + 2).toBe(4);
    testResults.passed++;
  } catch (error) {
    testResults.hasFailed = true;
    testResults.failed++;
    throw error;
  }
});

// Test case bị skip khi chạy trên Windows
test("skip test on Windows", async () => {
  testResults.total++;
  if (process.platform === "win32") {
    testResults.skipped++;
  }
  test.skip(
    process.platform === "win32",
    "This test is not supported on Windows"
  );
  try {
    expect(3 + 3).toBe(6);
    testResults.passed++;
  } catch (error) {
    testResults.hasFailed = true;
    testResults.failed++;
    throw error;
  }
});

// Test case bị skip khi test trước đó fail
test("skip if previous test failed", async () => {
  testResults.total++;
  if (testResults.hasFailed) {
    testResults.skipped++;
  }
  test.skip(testResults.hasFailed, "Skipping because previous test failed");
  try {
    expect(4 + 4).toBe(8);
    testResults.passed++;
  } catch (error) {
    testResults.hasFailed = true;
    testResults.failed++;
    throw error;
  }
});

// Test case bị skip với fixme
test.fixme("test that needs fixing", async () => {
  testResults.total++;
  testResults.skipped++;
  try {
    expect(5 + 5).toBe(10);
    testResults.passed++;
  } catch (error) {
    testResults.hasFailed = true;
    testResults.failed++;
    throw error;
  }
});

// Send webhook notification after all tests complete
test.afterAll(async () => {
  const summary = [
    `✅ Passed: ${testResults.passed}`,
    `❌ Failed: ${testResults.failed}`,
    `⏭️ Skipped: ${testResults.skipped}`,
    `📊 Total: ${testResults.total}`,
  ].join(" | ");

  if (testResults.failed === 0) {
    await sendWebhookNotification("All tests", "passed", summary);
  } else {
    await sendWebhookNotification("All tests", "failed", summary);
  }
});

import { test, expect } from "@playwright/test";
import { sendWebhookNotification } from "./helpers/webhook";

test("True assertion test", async () => {
  try {
    const isTrue = true;
    await expect(isTrue).toBe(true);
    await sendWebhookNotification("True assertion test", "passed");
  } catch (error) {
    await sendWebhookNotification("True assertion test", "failed");
    throw error;
  }
});

test("False assertion test", async () => {
  try {
    const isFalse = false;
    await expect(isFalse).toBe(false);
    await sendWebhookNotification("False assertion test", "passed");
  } catch (error) {
    await sendWebhookNotification("False assertion test", "failed");
    throw error;
  }
});

test("Boolean comparison test", async () => {
  try {
    const a = 5;
    const b = 10;
    await expect(a < b).toBe(true);
    await sendWebhookNotification("Boolean comparison test", "passed");
  } catch (error) {
    await sendWebhookNotification("Boolean comparison test", "failed");
    throw error;
  }
});

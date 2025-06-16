import { test, expect } from "@playwright/test";
import { sendWebhookNotification } from "./helpers/webhook";

test("simple test", async () => {
  try {
    expect(1 + 1).toBe(3);
    await sendWebhookNotification("simple test", "passed");
  } catch (error) {
    console.log(error);
    await sendWebhookNotification("simple test", "failed", error);
    throw error;
  }
});

test("another simple test", async () => {
  try {
    const text = "hello";
    expect(text).toBe("hello");
    await sendWebhookNotification("another simple test", "passed");
  } catch (error) {
    await sendWebhookNotification("another simple test", "failed", error);
    throw error;
  }
});

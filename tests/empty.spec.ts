import { test, expect } from "@playwright/test";

test("Empty test", async ({}) => {
  await expect(true).toBe(true);
});

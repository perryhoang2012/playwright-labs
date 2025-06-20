import { expect, test } from "@playwright/test";

test("True assertion test", async () => {
  try {
    const isTrue = true;
    await expect(isTrue).toBe(true);
  } catch (error) {
    throw error;
  }
});

test("False assertion test", async () => {
  try {
    const isFalse = false;
    await expect(isFalse).toBe(false);
  } catch (error) {
    throw error;
  }
});

test("Boolean comparison test", async () => {
  try {
    const a = 5;
    const b = 10;
    await expect(a < b).toBe(true);
  } catch (error) {
    throw error;
  }
});

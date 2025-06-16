import { test, expect } from "@playwright/test";

test("True assertion test", async ({}) => {
  const isTrue = true;
  await expect(isTrue).toBe(true);
});

test("False assertion test", async ({}) => {
  const isFalse = false;
  await expect(isFalse).toBe(false);
});

test("Boolean comparison test", async ({}) => {
  const a = 5;
  const b = 10;
  await expect(a < b).toBe(true);
});

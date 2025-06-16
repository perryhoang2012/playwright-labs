import { test, expect } from "@playwright/test";

test("Basic number test", async ({}) => {
  const number = 5;
  await expect(number).toBe(5);
});

test("Basic string test", async ({}) => {
  const text = "Hello World";
  await expect(text).toBe("Hello World");
});

test("Basic array test", async ({}) => {
  const array = [1, 2, 3];
  await expect(array).toContain(2);
});

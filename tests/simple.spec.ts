import { test, expect } from "@playwright/test";

test("simple test", async () => {
  expect(1 + 1).toBe(2);
});

test("another simple test", async () => {
  const text = "hello";
  expect(text).toBe("hello");
});

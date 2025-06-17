import { expect, test } from "@playwright/test";

// Test case bị skip vì điều kiện không thỏa mãn
test.skip("skip test with condition", async () => {
  try {
    expect(1 + 1).toBe(2);
  } catch (error) {
    throw error;
  }
});

// Test case bị skip dựa trên điều kiện
test("skip test based on condition", async ({ browserName }) => {
  test.skip(browserName === "firefox", "This test is not supported in Firefox");
  try {
    expect(2 + 2).toBe(4);
  } catch (error) {
    throw error;
  }
});

// Test case bị skip khi chạy trên Windows
test("skip test on Windows", async () => {
  test.skip(
    process.platform === "win32",
    "This test is not supported on Windows"
  );
  try {
    expect(3 + 3).toBe(6);
  } catch (error) {
    throw error;
  }
});

// Test case bị skip khi test trước đó fail
test("skip if previous test failed", async () => {
  test.skip(false, "Skipping because previous test failed");
  try {
    expect(4 + 4).toBe(9);
  } catch (error) {
    throw error;
  }
});

// Test case bị skip với fixme
test.fixme("test that needs fixing", async () => {
  try {
    expect(5 + 5).toBe(10);
  } catch (error) {
    throw error;
  }
});

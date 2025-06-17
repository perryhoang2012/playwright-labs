import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from "@playwright/test/reporter";
import { sendWebhookNotification } from "./helpers/webhook";

class MyReporter implements Reporter {
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;
  private totalTests = 0;
  private failedTestCases: { title: string; error?: string }[] = [];

  constructor() {}

  onBegin(config: FullConfig, suite: Suite) {
    this.totalTests = suite.allTests().length;
  }

  onTestBegin(test: TestCase) {}

  onTestEnd(test: TestCase, result: TestResult) {
    switch (result.status) {
      case "passed":
        this.passedTests++;
        break;
      case "failed":
        this.failedTests++;
        this.failedTestCases.push({
          title: test.title,
          error: result.error?.message,
        });
        break;
      case "skipped":
        this.skippedTests++;
        break;
    }
  }

  async onEnd(result: FullResult) {
    const summary = [
      `✅ Passed: ${this.passedTests}`,
      `❌ Failed: ${this.failedTests}`,
      `⏭️ Skipped: ${this.skippedTests}`,
      `📊 Total: ${this.totalTests}`,
    ].join(" | ");

    try {
      if (this.failedTests === 0) {
        await sendWebhookNotification("Test Suite", "passed", summary);
      } else {
        const failedTestsDetails = this.failedTestCases
          .map(
            (test) =>
              `- \`${test.title}\`${test.error ? `\n ${test.error}` : ""}`
          )
          .join("\n");

        await sendWebhookNotification(
          "Test Suite",
          "failed",
          summary,
          `Failed tests:\n${failedTestsDetails}`
        );
      }
    } catch (error) {
      console.error("Failed to send webhook notification:", error);
    }
  }
}

export default MyReporter;

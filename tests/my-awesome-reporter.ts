import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from "@playwright/test/reporter";

class MyReporter implements Reporter {
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;

  constructor(options: { customOption?: string } = {}) {
    console.log(
      `my-awesome-reporter setup with customOption set to ${options.customOption}`
    );
  }

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);

    switch (result.status) {
      case "passed":
        this.passedTests++;
        break;
      case "failed":
        this.failedTests++;
        break;
      case "skipped":
        this.skippedTests++;
        break;
    }
  }

  onEnd(result: FullResult) {
    const totalTests = this.passedTests + this.failedTests + this.skippedTests;

    const summary = [
      `✅ Passed: ${this.passedTests}`,
      `❌ Failed: ${this.failedTests}`,
      `⏭️ Skipped: ${this.skippedTests}`,
      `📊 Total: ${totalTests}`,
    ].join(" | ");

    const message = `🔔 E2E Test Run Complete\nStatus: ${result.status.toUpperCase()}\n${summary}`;
    console.log(message);
  }
}
export default MyReporter;

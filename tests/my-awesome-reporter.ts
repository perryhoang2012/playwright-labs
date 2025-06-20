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
  private failedTestCases: {
    title: string;
    error?: string;
    api?: string;
    method?: string;
    payload?: any;
    response?: string;
  }[] = [];

  constructor() {}

  onBegin(config: FullConfig, suite: Suite) {
    this.totalTests = suite.allTests().length;
  }

  onTestBegin(test: TestCase) {}

  onTestEnd(test: TestCase, result: TestResult) {
    console.log("test", test);
    console.log("result", result);
    switch (result.status) {
      case "passed":
        this.passedTests++;
        break;
      case "failed":
        this.failedTests++;

        const requestAttachments = result.attachments.filter((a) =>
          a.name.startsWith("api-request")
        );
        const responseAttachments = result.attachments.filter((a) =>
          a.name.startsWith("api-response")
        );

        let requestData: any = null;
        if (requestAttachments.length > 0 && requestAttachments[0].body) {
          try {
            requestData = JSON.parse(requestAttachments[0].body.toString());
          } catch {}
        }
        const responseData =
          responseAttachments.length > 0
            ? responseAttachments[0].body?.toString()
            : undefined;

        this.failedTestCases.push({
          title: test.title,
          error: result.error?.message,
          api: requestData
            ? `${requestData.method} ${requestData.url}`
            : undefined,
          method: requestData ? requestData.method : undefined,
          payload: requestData ? requestData.payload : undefined,
          response: responseData,
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

    console.log(this.failedTestCases);
    try {
      if (this.failedTests === 0) {
        await sendWebhookNotification("Test Suite", "passed", summary);
      } else {
        const failedTestsDetails =
          "```\n" +
          this.failedTestCases
            .map(
              (test) =>
                `❌ ${test.title}\n` +
                `🌐 ${test.method || ""} / ${
                  test.api ? test.api.split(" ").slice(1).join(" ") : ""
                }\n` +
                (test.payload
                  ? `📦 Payload: ${JSON.stringify(test.payload)}\n`
                  : "") +
                (test.response ? `📩 Response: ${test.response}` : "")
            )
            .join("\n\n") +
          "\n```";

        await sendWebhookNotification(
          "Test Suite",
          "failed",
          summary,
          `\n${failedTestsDetails}`
        );
      }
    } catch (error) {
      console.error("Failed to send webhook notification:", error);
    }
  }
}

export default MyReporter;

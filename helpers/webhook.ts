import axios from "axios";

function stripAnsi(str: string) {
  return str.replace(
    /[\u001b\u009b][[\\\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

function convertErrorMessage(error: string): string {
  // Remove ANSI color codes
  const cleanError = stripAnsi(error);

  // Split into lines and process each line
  const lines = cleanError.split("\n");
  const processedLines = lines
    .map((line) => {
      // Remove common prefixes and suffixes
      line = line.replace(/^Error: /, "");
      line = line.replace(
        /^expect\(.*\)\.toBe\(.*\) \/\/ Object\.is equality$/,
        ""
      );
      line = line.trim();

      // Skip empty lines
      if (!line) return null;

      // Format expected/received lines with inline code
      if (line.startsWith("Expected:")) {
        const value = line.replace("Expected:", "").trim();
        return `Expected: \`${value}\``;
      }
      if (line.startsWith("Received:")) {
        const value = line.replace("Received:", "").trim();
        return `Received: \`${value}\``;
      }

      return line;
    })
    .filter(Boolean);

  // Join lines with proper formatting
  return processedLines.join("\n");
}

export async function sendWebhookNotification(
  testName: string,
  status: "passed" | "failed",
  summary?: string,
  error?: Error | string,
  htmlContent?: string
) {
  let message = "";

  // Add status header
  message +=
    status === "passed"
      ? "🎉 **Test Suite Passed Successfully!**\n\n"
      : "❌ **Test Suite Failed!**\n\n";

  // Add summary if provided
  if (summary) {
    message += `📊 **Test Summary:**\n${summary}\n\n`;
  }

  // Add failed test cases details
  if (status === "failed" && error) {
    message += "🔍 **Failed Test Cases:**\n";
    if (typeof error === "string") {
      message += convertErrorMessage(error);
    } else {
      message += convertErrorMessage(error.message);
      if (error.stack) {
        message += `\n\n**Stack Trace:**\n\`\`\`\n${stripAnsi(
          error.stack
        )}\n\`\`\``;
      }
    }
    message += "\n\n";
  }

  // Add HTML report link if provided
  if (htmlContent) {
    message += "📋 **HTML Report:**\n";
    message += "A detailed HTML report is available for this test run.\n\n";
  }

  try {
    const payload = {
      target: "grp_2yWp96RAONNHFQYzt90WPX7kQ6t",
      text: message,
    };

    const response = await axios.post(
      "https://api.gluegroups.com/webhook/wbh_2yZh5T3LGghnqssM9FiLmuvOaL1/hwOrFjdYaWOrGjCFnRDbMRmCB4SRozGOsOruu89i8UE",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Webhook notification sent successfully for test: ${testName}`);
  } catch (error) {
    console.error("Failed to send webhook notification:", error);
    throw error;
  }
}

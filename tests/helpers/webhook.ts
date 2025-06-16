import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function sendWebhookNotification(
  testName: string,
  status: "passed" | "failed"
) {
  const message =
    status === "passed"
      ? `Test "${testName}" passed successfully!`
      : `Test "${testName}" failed!`;

  try {
    const response = await fetch(
      "https://api.gluegroups.com/webhook/wbh_2yZh5T3LGghnqssM9FiLmuvOaL1/hwOrFjdYaWOrGjCFnRDbMRmCB4SRozGOsOruu89i8UE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: "grp_2yWp96RAONNHFQYzt90WPX7kQ6t",
          text: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Webhook notification sent successfully for test: ${testName}`);
  } catch (error) {
    console.error("Failed to send webhook notification:", error);
    throw error; // Re-throw to handle in the test
  }
}

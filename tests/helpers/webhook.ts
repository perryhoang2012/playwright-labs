import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function stripAnsi(str: string) {
  return str.replace(
    /[\u001b\u009b][[\\\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

export async function sendWebhookNotification(
  testName: string,
  status: "passed" | "failed",
  error?: Error | string
) {
  let message = "";

  if (status === "passed") {
    message = `✅ Test "${testName}" passed successfully!`;
  } else {
    message = `❌ Test "${testName}" failed!\n\n`;
    if (error) {
      let errorMsg = "";
      let stackMsg = "";
      if (typeof error === "string") {
        errorMsg = stripAnsi(error).split("\n")[0];
      } else {
        errorMsg = stripAnsi(error.message).split("\n")[0];
        stackMsg = error.stack ? stripAnsi(error.stack) : "";
      }
      message += `**Error message:**\n\n${"```"}\n${errorMsg}\n${"```"}\n`;
      if (stackMsg) {
        message += `**Stack trace:**\n\n${"```"}\n${stackMsg}\n${"```"}\n`;
      }
    }
  }

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
    throw error;
  }
}

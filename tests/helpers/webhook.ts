import axios from "axios";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

function stripAnsi(str: string) {
  return str.replace(
    /[\u001b\u009b][[\\\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

export async function sendWebhookNotification(
  testName: string,
  status: "passed" | "failed",
  error?: Error | string,
  htmlContent?: string
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
    const payload: any = {
      target: "grp_2yWp96RAONNHFQYzt90WPX7kQ6t",
      text: message,
    };

    if (htmlContent) {
      payload.html = htmlContent;
    }

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

export async function sendHtmlReport(htmlContent: string) {
  try {
    const payload = {
      target: "grp_2yWp96RAONNHFQYzt90WPX7kQ6t",
      text: "📊 Test Report",
      html: htmlContent,
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

    console.log("HTML report sent successfully");
  } catch (error) {
    console.error("Failed to send HTML report:", error);
    throw error;
  }
}

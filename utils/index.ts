import Vars from "../helpers/Vars";
import fs from "fs";

export function checkFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
/**
 * Thay thế các biến kiểu {{ var }} trong request YAML
 */
export async function evaluateVars(context: Vars, input: any): Promise<any> {
  if (typeof input === "string") {
    return context.interpolate(input);
  }

  if (Array.isArray(input)) {
    return Promise.all(input.map((item) => evaluateVars(context, item)));
  }

  if (typeof input === "object" && input !== null) {
    const result: any = {};
    for (const key of Object.keys(input)) {
      //   if (key === "body") {
      //     result[key] = context.get(input[key]);
      //   } else {
      result[key] = await evaluateVars(context, input[key]);
      //   }
    }
    return result;
  }

  return input;
}

export function makeid(length = 5) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

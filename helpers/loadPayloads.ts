import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Dynamically imports all default exports from a folder
 */
export default async function loadPayloads(dir: string = "./helpers/payloads") {
  const absolutePath = path.resolve(__dirname, dir);
  const files = fs
    .readdirSync(absolutePath)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  const payloads: Record<string, any> = {};

  for (const file of files) {
    const filePath = path.join(absolutePath, file);
    const fileURL = pathToFileURL(filePath).href;

    try {
      const module = await import(fileURL);
      const value = module.default;
      const key = path.basename(file, path.extname(file));
      payloads[key] = typeof value === "function" ? value() : value;
    } catch (err) {
      console.error(`❌ Failed to import ${filePath}:`, err);
    }
  }

  return payloads;
}

import { parse } from "yaml";
import fs from "fs";
import path from "path";

import { checkFileExists } from "../utils/index.ts";

interface RequestItem {
  name: string;
  requests: any;
}

interface ImportSchemaTag {
  identify: (value: any) => boolean;
  tag: string;
  resolve: (include: string) => any;
}

export default function LoadConfig(): any {
  const configFilePath = process.env.CONFIG_SPEC_FILE || "tests-data/yaml.yml";

  const absoluteConfigPath = path.isAbsolute(configFilePath)
    ? configFilePath
    : path.resolve(process.cwd(), configFilePath);

  if (!checkFileExists(absoluteConfigPath)) {
    throw new Error(`Config file does not exist: ${absoluteConfigPath}`);
  }

  const importSchemaTag: ImportSchemaTag = {
    identify: (value: any): boolean => typeof value === "string",
    tag: "!include",
    resolve(include: string): any {
      const configDir = path.dirname(absoluteConfigPath);
      const includeFilePath = path.resolve(configDir, include);

      function readNestedFiles(directory: string): RequestItem[] {
        let result: RequestItem[] = [];

        const items = fs.readdirSync(directory);

        for (const item of items) {
          const fullPath = path.join(directory, item);
          const stat = fs.lstatSync(fullPath);

          if (stat.isDirectory()) {
            // Recursively scan subfolders
            const subfolderContents = readNestedFiles(fullPath);
            result.push({
              name: String(item).toUpperCase(),
              requests: subfolderContents,
            });
          } else if (fullPath.endsWith(".yaml")) {
            // Process YAML files
            const fileData = fs.readFileSync(fullPath, "utf8");
            const fileDataParsed = parse(fileData, {
              customTags: [importSchemaTag],
            });

            result.push({
              name: path.basename(fullPath, ".yaml").toUpperCase(),
              requests: fileDataParsed,
            });
          }
        }

        return result;
      }

      if (!fs.existsSync(includeFilePath)) {
        throw new Error(`Included path does not exist: ${include}`);
      }

      if (fs.lstatSync(includeFilePath).isDirectory()) {
        // Read all YAML files recursively
        return readNestedFiles(includeFilePath);
      } else {
        // If it's a single file, parse it normally
        const fileData = fs.readFileSync(includeFilePath, "utf8");
        return parse(fileData, { customTags: [importSchemaTag] });
      }
    },
  };

  const configFile = fs.readFileSync(absoluteConfigPath, "utf8");
  return parse(configFile, { customTags: [importSchemaTag] });
}

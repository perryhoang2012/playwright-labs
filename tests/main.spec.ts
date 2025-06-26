import { test } from "@playwright/test";
import { request } from "playwright";
import LoadConfig from "../helpers/LoadConfigFile.js";
import Vars from "../helpers/Vars.js";
import convertPayload from "../helpers/convertPayload";
import { evaluateVars } from "../utils/index.js";

// Load test cases from YAML configuration files
const cases = LoadConfig();

// Initialize a global variable context for managing test variables
const VarContext = new Vars();

let requestContext: any = null;

// Set up a request context before all tests to maintain consistent settings
test.beforeAll(async () => {
  // Tạo context tạm để gọi login
  // const tempContext = await request.newContext({
  //   baseURL: process.env.BASE_URL || "https://jsonplaceholder.typicode.com",
  //   ignoreHTTPSErrors: true,
  // });
  // // Gọi API login
  // const loginResponse = await tempContext.post("/api/auth/login", {
  //   data: {
  //     username: process.env.TEST_USER || "your-username",
  //     password: process.env.TEST_PASS || "your-password",
  //   },
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // const loginData = await loginResponse.json();
  // const accessToken = loginData.access_token;

  requestContext = await request.newContext({
    baseURL: process.env.BASE_URL || "https://dummyjson.com",
    timeout: 5 * 60000,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      // Authorization: `Bearer ${accessToken}`,
      "x-account": "khoa",
    },
  });
});

// Function to create and define a test case in Playwright
const createTestCase = (request: any, index: number) => {
  test(request?.name + " " + (index + 1), async () => {
    const evaluatedRequest = await evaluateVars(VarContext, request);
    const { body, name, method, path } = evaluatedRequest;

    const options: any = {
      method: String(method).toUpperCase(),
    };

    const payload = convertPayload(body);

    options["data"] = payload;

    const response = await requestContext.fetch(path, options);
    let json: any;
    try {
      json = await response?.json();
    } catch (err) {
      json = await response.text();
    }

    // Attach for debugging
    await test.info().attach(`api-request`, {
      body: JSON.stringify(
        { endpoint: path, method, payload: payload },
        null,
        2
      ),
    });
    await test.info().attach(`api-response`, {
      body: JSON.stringify(json, null, 2),
    });

    // Lưu lại id nếu có
    if (json?.id && request.id) {
      VarContext.set(`${request.id}.id`, json.id);
    }
  });
};

// Function to group test cases into describe blocks for better execution control
const createDescribe = ({ name, requests, mode }: any, serial?: boolean) => {
  test.describe(name, async () => {
    if (serial || mode) {
      test.describe.configure({ mode: mode ? mode : "default" });
    }
    for (let index = 0; index < requests.length; index++) {
      const request = requests[index];
      // if (Object.keys(request).includes("requests")) {
      //   // createDescribe(request, true);
      // } else {
      createTestCase(request, index);
      // }
    }
  });
};

// Iterate over endpoints and generate describe blocks for each
for (const testCase of cases) {
  createDescribe(testCase);
}

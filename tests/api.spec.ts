import test, { expect } from "@playwright/test";

test("Login API should return token and user info /Login", async ({
  request,
}, testInfo) => {
  const payload = {
    username: "emilys",
    password: "12312",
  };
  const response = await request.post("https://dummyjson.com/auth/login", {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

  const attachmentName = `api-request`;
  testInfo.attach(attachmentName, {
    body: JSON.stringify({
      url: "https://dummyjson.com/auth/login",
      method: "POST",
      payload,
    }),
    contentType: "application/json",
  });
  testInfo.attach(`api-response`, {
    body: await response.text(),
    contentType: "application/json",
  });

  expect(response.ok()).toBeTruthy();
});

test("Get todo API should return todo item /GetTodo", async ({
  request,
}, testInfo) => {
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/todos/"
  );
  const attachmentName = `api-request`;
  testInfo.attach(attachmentName, {
    body: JSON.stringify({
      url: "https://jsonplaceholder.typicode.com/todos/1",
      method: "GET",
    }),
    contentType: "application/json",
  });
  testInfo.attach(`api-response`, {
    body: await response.text(),
    contentType: "application/json",
  });

  expect(response.ok()).toBeTruthy();
});

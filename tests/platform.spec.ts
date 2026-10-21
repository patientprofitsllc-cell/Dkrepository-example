import { test, expect } from "@playwright/test";
const headers = { Origin: "http://localhost:3100" };
test("public routes render, navigation fits mobile and assistant routes", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/dumpster-rentals",
    "/sell-your-property",
    "/homeowner-solutions",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Ask Ava" }).click();
  await page
    .getByRole("button", { name: "Dumpster rental", exact: true })
    .click();
  await expect(page.getByRole("log")).toContainText("human will confirm");
  await page.getByRole("button", { name: "Human", exact: true }).click();
  await expect(page.getByRole("log")).toContainText("does not transfer");
});
test("lead intake persists and is visible in secured CRM", async ({ page }) => {
  await page.goto("/dumpster-rentals");
  const name = `Browser Test ${Date.now()}`;
  await page.getByLabel("Your name").fill(name);
  await page.getByLabel("Phone *").fill("6785550123");
  await page.getByLabel("Email", { exact: true }).fill("browser@example.com");
  await page
    .getByLabel("Service address")
    .fill("123 Test Street, Columbus, GA");
  await page
    .getByLabel("Debris type")
    .selectOption("Construction / renovation");
  await page.getByLabel("Estimated size").selectOption("Need guidance");
  await page.getByLabel("Site access").fill("Open driveway");
  await page.getByRole("button", { name: "Request a quote" }).click();
  await expect(page.getByRole("status")).toContainText("inquiry is saved");
  await page.goto("/admin");
  await page.getByLabel("Password").fill("e2e-password-strong");
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await expect(page.getByRole("button", { name: `${name} ↗` })).toBeVisible();
  await page.getByRole("button", { name: `${name} ↗` }).click();
  await page.getByLabel("Lead status").selectOption("contacted");
  await expect(
    page.getByText("Status changed to contacted", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Time (your local time zone)").fill("2030-10-21T10:00");
  await page.getByRole("button", { name: "Record appointment" }).click();
  await expect(page.getByText(/Internal appointment recorded/)).toBeVisible();
});
test("authorization, validation, CSRF, opt-out and outbound boundaries", async ({
  request,
}) => {
  expect((await request.get("/api/admin/leads")).status()).toBe(401);
  expect(
    (
      await request.post("/api/leads", { headers, data: { name: "x" } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/leads", {
        headers: { Origin: "https://evil.test" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/outbound", { data: { number: "6785550100" } })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/webhooks/vapi", { data: { id: "fake" } })
    ).status(),
  ).toBe(503);
  const opted = await request.post("/api/opt-out", {
    headers,
    data: { contact: "6785550123" },
  });
  expect(opted.status()).toBe(200);
  await request.post("/api/admin/login", {
    headers,
    data: { role: "viewer", password: "e2e-password-strong" },
  });
  const data = await (await request.get("/api/admin/leads")).json();
  expect(data.role).toBe("viewer");
  expect(data.leads.some((l: { suppressed: boolean }) => l.suppressed)).toBe(
    true,
  );
  expect(
    (
      await request.patch("/api/admin/leads", {
        headers,
        data: { id: data.leads[0].id, status: "closed" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/admin/appointments", { headers, data: {} })
    ).status(),
  ).toBe(403);
});

test("property and homeowner divisions persist independent inquiry payloads", async ({
  request,
}) => {
  const base = {
    name: "Division Intake Test",
    email: "division@example.com",
    phone: "6785550198",
    address: "456 Test Avenue, Columbus",
    notes: "Test inquiry",
    consent: false,
    website: "",
  };
  for (const fields of [
    {
      division: "property",
      condition: "Needs repairs",
      occupancy: "Vacant",
      timeline: "Just exploring",
      relationship: "Owner",
      price: "",
    },
    { division: "homeowner", situation: "Repairs" },
  ]) {
    const res = await request.post("/api/leads", {
      headers,
      data: { ...base, ...fields },
    });
    expect([200, 201]).toContain(res.status());
    const payload = await res.json();
    expect(payload.id).toMatch(/^[0-9a-f-]{36}$/);
  }
});

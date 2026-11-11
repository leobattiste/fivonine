// Isolated DOM fixture: no account, server submission, or external payment is used.
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(
    (process.env.BASE_URL ?? "http://localhost:3040") + "/en/submit",
  );
  await page
    .locator("fieldset")
    .evaluateAll((els) => els.forEach((el) => (el.disabled = false)));
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.equal(
    await page.locator(".form-step-title").innerText(),
    "Fundraiser",
  );
  await page.locator("[name=title]").fill("Support a school library");
  await page
    .locator("[name=fundraising_url]")
    .fill("https://example.com/library");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.equal(await page.locator(".form-step-title").innerText(), "Story");
  await page
    .locator("[name=story]")
    .fill("Books and learning materials for a community school.");
  await page.locator("[name=country]").fill("Haiti");
  await page.locator("[name=region]").fill("Jacmel");
  await page.locator("[name=intended_use]").fill("Books and shelves");
  await page
    .locator("[name=distribution]")
    .fill("Organizer buys and delivers the books.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.equal(await page.locator(".form-step-title").innerText(), "Organizer");
  await page.locator("[name=organizer_name]").fill("Example organizer");
  await page.locator("[name=relationship]").fill("School volunteer");
  await page.locator("[name=beneficiary]").fill("Community school");
  await page
    .locator("[name=support_text]")
    .fill("Support the library at https://example.com/library");
  await page.locator("[name=consent]").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.equal(await page.locator(".form-step-title").innerText(), "Review");
  await page.locator("[name=accuracy]").check();
  await page.locator("[name=terms]").check();
  assert.ok(
    (await page.locator(".submission-review").innerText()).includes(
      "Support a school library",
    ),
  );
  assert.equal(
    await page.locator(".submission-review a").first().getAttribute("href"),
    "https://example.com/library",
  );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  assert.equal(
    await page.locator("[name=support_text]").inputValue(),
    "Support the library at https://example.com/library",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const payload = await page
    .locator("form.campaign-form")
    .evaluate((el) => Object.fromEntries(new FormData(el)));
  assert.equal(payload.title, "Support a school library");
  assert.equal(payload.fundraising_url, "https://example.com/library");
  assert.equal(payload.organizer_name, "Example organizer");
  assert.equal(payload.consent, "on");
  assert.equal(payload.terms, "on");
  assert.equal(
    await page
      .getByRole("button", { name: "Submit for review", exact: true })
      .isDisabled(),
    true,
  );
  await page.screenshot({
    path: "test-results/submission-review-390.png",
    fullPage: true,
  });
  console.log(
    "PASS: fundraiser/story/organizer/review validation, retained form data, checked URL preview and policy agreement; no server write",
  );
} finally {
  await browser.close();
}

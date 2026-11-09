import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3040";
for (let attempt = 0; attempt < 50; attempt++) {
  try {
    const response = await fetch(base + "/robots.txt");
    if (response.ok) break;
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 200));
}
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ??
    (fs.existsSync("/usr/bin/chromium")
      ? "/usr/bin/chromium"
      : chromium.executablePath()),
  args: ["--no-sandbox"],
});
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + "/en");
    await page.getByRole("heading", { level: 1 }).waitFor();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(await page.locator(".campaign-card").count(), 3);
    assert.equal(
      await page.locator(".preview-banner, .campaign-label").count(),
      0,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    fs.mkdirSync("test-results", { recursive: true });
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    if (width < 960) {
      await page.locator(".menu-toggle").click();
      await page.locator('.menu-list a[href="/en/explore"]').click();
    } else {
      await page.locator('.desktop-nav a[href="/en/explore"]').click();
    }
    await page.waitForURL("**/en/explore");
    assert.equal(await page.locator(".campaign-card").count(), 6);
    await page.locator("input[name=q]").fill("classroom");
    await page.locator(".explore-filters button").click();
    await page.waitForURL("**/en/explore?q=**");
    assert.equal(await page.locator(".campaign-card").count(), 1);
    await page.locator(".campaign-card a").click();
    await page.waitForURL("**/en/campaigns/example-1");
    assert.equal(await page.locator(".support-text a").count(), 0);
    assert.ok(
      (await page.locator(".support-text").innerText()).includes(
        "Support instructions have not been provided yet.",
      ),
    );
    await page.screenshot({
      path: `test-results/campaign-${width}.png`,
      fullPage: true,
    });
    if (width < 960) {
      await page.locator(".menu-toggle").click();
      await page.locator("dialog").waitFor({ state: "visible" });
      assert.equal(
        await page
          .locator("dialog")
          .evaluate((el) => el.getBoundingClientRect().right <= innerWidth),
        true,
      );
      await page.keyboard.press("Escape");
      await page.locator("dialog").waitFor({ state: "hidden" });
      assert.equal(
        await page
          .locator(".menu-toggle")
          .evaluate((el) => el === document.activeElement),
        true,
      );
    }
    await page.goto(base + "/en/submit");
    assert.equal(await page.locator("[name=support_text]").count(), 1);
    assert.equal(await page.locator("fieldset:visible").count(), 1);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    assert.equal(
      await page.locator("fieldset:visible legend").innerText(),
      "02 · Organizer",
    );
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    assert.equal(await page.locator("[name=support_text]").isVisible(), true);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Submit for review", exact: true })
        .isDisabled(),
      true,
    );
    await page.getByRole("button", { name: "Back", exact: true }).click();
    assert.equal(await page.locator("[name=support_text]").isVisible(), true);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `test-results/submit-${width}.png`,
      fullPage: true,
    });
    await page.goto(base + "/en/admin");
    assert.equal(await page.locator(".admin .tabs a").count(), 5);
    assert.equal(
      await page.locator("meta[name=robots]").getAttribute("content"),
      "noindex, nofollow",
    );
    for (const locale of ["ht", "fr"]) {
      await page.goto(`${base}/${locale}/help`);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.ok(
        (await page.getByRole("heading", { level: 1 }).innerText()).length > 0,
      );
      await page.goto(`${base}/${locale}`);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.goto(`${base}/${locale}/submit`);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${width}px: homepage, responsive navigation, search, campaign disclosure, accessible menu, submission steps, preview form guards, admin tabs and locale pages`,
    );
    await page.close();
  }
  const context = await browser.newContext();
  const response = await context.request.get(
    base + "/api/out?campaign=example-1&url=https://example.com",
  );
  assert.equal(response.status(), 404);
  const cron = await context.request.get(base + "/api/cron/email");
  assert.equal(cron.status(), 401);
  const root = await context.request.get(base + "/");
  assert.equal(root.url(), base + "/ht");
  console.log(
    "PASS: external destination validation, protected email worker and default language redirect",
  );
  await context.close();
} finally {
  await browser.close();
}

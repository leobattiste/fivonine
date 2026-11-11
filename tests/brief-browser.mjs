import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const base = process.env.BASE_URL ?? "http://localhost:3040";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + "/en");
    await page.evaluate(() => document.fonts.ready);
    const sections = await page
      .locator("[data-home-section]")
      .evaluateAll((els) => els.map((el) => el.dataset.homeSection));
    assert.deepEqual(sections, [
      "hero",
      "categories",
      "how",
      "trust",
      "submit",
    ]);
    assert.equal(
      await page.locator(".wordmark").first().innerText(),
      "pote kole.",
    );
    assert.ok(
      (
        await page
          .locator("body")
          .evaluate((el) => getComputedStyle(el).fontFamily)
      )
        .toLowerCase()
        .includes("geist"),
    );
    assert.equal(
      await page
        .locator(".site-header")
        .evaluate((el) => getComputedStyle(el).position),
      "sticky",
    );
    assert.equal(
      await page
        .locator(".icon")
        .first()
        .evaluate((el) => el.getBoundingClientRect().width),
      20,
    );
    if (width === 1440)
      assert.equal(await page.locator(".desktop-nav a").count(), 3);
    await page.screenshot({
      path: `test-results/pote-kole-home-${width}.png`,
      fullPage: true,
    });
    await page.goto(base + "/en/explore");
    if (width < 800) {
      await page.locator(".mobile-filter-toggle").click();
      await page.locator(".filter-sheet").waitFor({ state: "visible" });
      await page
        .locator(".filter-sheet [name=lifecycle]")
        .selectOption("completed");
      await page.locator(".filter-sheet button[type=submit]").click();
    } else {
      await page
        .locator(".desktop-filters [name=lifecycle]")
        .selectOption("completed");
      await page.locator(".explore-search-submit").click();
    }
    await page.waitForURL("**/en/explore?**lifecycle=completed**");
    assert.equal(await page.locator(".campaign-card").count(), 0);
    await page.goto(base + "/en/explore?location=Haiti&sort=updated");
    assert.equal(await page.locator(".campaign-card").count(), 0);
    await page.screenshot({
      path: `test-results/pote-kole-explore-${width}.png`,
      fullPage: true,
    });
    await page.locator(".language select").selectOption("fr");
    await page.waitForURL("**/fr/explore?**");
    await page.goto(base + "/");
    assert.equal(new URL(page.url()).pathname, "/fr");
    await page.goto(base + "/en/admin");
    assert.equal(new URL(page.url()).pathname, "/en/login");
    await page.screenshot({
      path: `test-results/pote-kole-admin-${width}.png`,
      fullPage: true,
    });
    await page.goto(base + "/en/submit");
    await page.screenshot({
      path: `test-results/pote-kole-submit-${width}.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${width}px: ordered homepage, Geist/Hugeicons, sticky header, responsive filters, remembered language and private admin redirect`,
    );
  }
} finally {
  await browser.close();
}

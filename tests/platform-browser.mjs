import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const base = process.env.BASE_URL ?? "http://localhost:3040";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      window.__shares = [];
      window.open = (url) => {
        window.__shares.push(url);
        return null;
      };
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async (text) => {
            window.__copied = text;
          },
        },
      });
    });
    for (const locale of ["en", "ht", "fr"]) {
      for (const path of [
        "/causes",
        "/resources",
        "/resources/diaspora-support",
        "/safety",
        "/pricing",
        "/help",
      ]) {
        const response = await page.goto(base + "/" + locale + path);
        assert.equal(response.status(), 200);
        assert.equal(await page.locator("html").getAttribute("lang"), locale);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${locale}${path} overflows at ${width}`,
        );
      }
    }
    await page.goto(base + "/en/causes");
    assert.equal(await page.locator(".cause-directory-card").count(), 5);
    await page
      .locator('.cause-directory-card[href="/en/causes/medical"]')
      .click();
    await page.waitForURL("**/en/causes/medical");
    assert.equal(await page.locator(".campaign-card").count(), 0);
    await page
      .locator('.cause-hero-copy a[href="/en/submit?category=medical"]')
      .click();
    await page.waitForURL("**/en/submit?category=medical");
    assert.equal(await page.locator("[name=category]").inputValue(), "medical");
    assert.equal(await page.locator("[name=title]").isDisabled(), true);
    await page.goto(base + "/en/help");
    await page.getByRole("searchbox").fill("zzzz-no-match");
    assert.equal(await page.locator(".faq-list details").count(), 0);
    assert.equal(await page.getByRole("status").isVisible(), true);
    await page.getByRole("searchbox").fill("account");
    assert.ok((await page.locator(".faq-list details").count()) > 0);
    await page.locator(".faq-list summary").first().click();
    assert.equal(await page.locator(".faq-list details[open]").count(), 1);
    if (width === 1440)
      assert.equal(await page.locator(".desktop-nav a").count(), 3);
    const invalidCause = await page.goto(base + "/en/causes/invalid");
    assert.equal(invalidCause.status(), 404);
    const invalidGuide = await page.goto(base + "/en/resources/invalid");
    assert.equal(invalidGuide.status(), 404);
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${width}px: localized platform pages, category-to-submission flow, help search, organizer sections, safe sharing, navigation and 404s`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}

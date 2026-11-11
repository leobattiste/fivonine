import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3080";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  fs.mkdirSync("test-results/agency", { recursive: true });
  for (const width of process.env.WIDTHS
    ? process.env.WIDTHS.split(",").map(Number)
    : [390, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "",
      "/explore",
      "/causes",
      "/causes/medical",
      "/about",
      "/how-it-works",
      "/help",
      "/resources",
      "/resources/tell-your-story",
      "/safety",
      "/pricing",
      "/contact",
      "/legal",
      "/login",
      "/submit",
      "/missing-page",
    ]) {
      const response = await page.goto(base + "/en" + route);
      assert.equal(response.status(), route === "/missing-page" ? 404 : 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        route + " overflow " + width,
      );
      await page.screenshot({
        path:
          "test-results/agency/" +
          (route ? route.slice(1).replaceAll("/", "-") : "home") +
          "-" +
          width +
          ".png",
        fullPage: true,
      });
    }
    if (!process.env.VISUAL_ONLY) {
      await page.goto(base + "/en/how-it-works");
      await page.getByRole("tab", { name: "I’m here to help" }).click();
      assert.ok(
        (await page.getByRole("tabpanel").innerText()).includes(
          "Find your cause",
        ),
      );
      await page.goto(
        base + "/en/explore?q=school&category=education&location=Haiti",
      );
      assert.equal(await page.locator(".filter-chips a").count(), 3);
      await page
        .locator(".filter-chips a")
        .filter({ hasText: "Haiti" })
        .click();
      await page.waitForURL((url) => !url.searchParams.has("location"));
      assert.ok(!new URL(page.url()).searchParams.has("location"));
    }
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${width}px: all public page layouts, task screens, localized recovery, journey switch and removable filters`,
    );
  }
} finally {
  await browser.close();
}

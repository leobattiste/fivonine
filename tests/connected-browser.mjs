// Optional live rehearsal using an explicitly provisioned temporary QA identity.
// Does not publish campaigns or send mail. Run only against the dedicated test context.
import { createServerClient } from "@supabase/ssr";
import { chromium } from "playwright-core";
import fs from "node:fs";
import assert from "node:assert/strict";
const q = JSON.parse(fs.readFileSync(process.env.QA_IDENTITY_FILE, "utf8"));
const base = process.env.BASE_URL ?? "http://localhost:3070";
const cookies = [];
const db = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    cookies: {
      getAll: () => cookies,
      setAll: (list) => {
        for (const c of list) {
          const i = cookies.findIndex((v) => v.name === c.name);
          if (i >= 0) cookies.splice(i, 1);
          cookies.push(c);
        }
      },
    },
  },
);
const result = await db.auth.signInWithPassword({
  email: q.email,
  password: q.password,
});
assert.equal(result.error, null, result.error?.message);
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await context.addCookies(
    cookies.map((c) => ({
      name: c.name,
      value: c.value,
      url: base,
      ...(c.options?.maxAge
        ? { expires: Date.now() / 1000 + c.options.maxAge }
        : {}),
    })),
  );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/en/dashboard");
  assert.equal(new URL(page.url()).pathname, "/en/dashboard");
  await page.goto(base + "/en/admin");
  assert.equal(await page.locator(".admin").count(), 0);
  await page.goto(base + "/en/submit");
  assert.equal(await page.locator("[name=title]").isEnabled(), true);
  await page.locator("[name=title]").fill("QA private workflow rehearsal");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await page.reload();
  await page.getByText("Your saved draft is ready", { exact: true }).waitFor();
  assert.equal(
    await page.locator("[name=title]").inputValue(),
    "QA private workflow rehearsal",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const [key, value] of Object.entries({
    story: "Private functional test; never publish this listing.",
    country: "Haiti",
    region: "Jacmel",
    intended_use: "Test only",
    distribution: "Test only",
  }))
    await page.locator(`[name=${key}]`).fill(value);
  await page
    .locator("input[type=file]")
    .setInputFiles("public/photos/learning.webp");
  await page
    .getByRole("button", { name: "Use this photo", exact: true })
    .click();
  try {
    await page.waitForFunction(
      () =>
        document
          .querySelector("[name=photo_url]")
          .value.includes("/storage/v1/object/authenticated/covers/"),
      { timeout: 15000 },
    );
  } catch (error) {
    console.log(await page.locator(".photo-upload").innerText());
    throw error;
  }
  const photo = await page.locator("[name=photo_url]").inputValue();
  fs.writeFileSync("/tmp/pote-qa-photo-reference", photo);
  const path = photo.split("/covers/")[1];
  const noPhoto = await context.request.get(
    base + "/api/cover?path=" + encodeURIComponent(path),
  );
  assert.equal(noPhoto.status(), 404, "Unpublished cover must not be public");
  const ownPreview = await db.storage.from("covers").createSignedUrl(path, 60);
  assert.equal(ownPreview.error, null);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const [key, value] of Object.entries({
    organizer_name: "QA test identity",
    relationship: "Test only",
    beneficiary: "Test only",
    support_text: "Test instructions with https://example.com/test",
  }))
    await page.locator(`[name=${key}]`).fill(value);
  await page.locator("[name=consent]").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator("[name=accuracy]").check();
  await page.locator("[name=terms]").check();
  await page
    .getByRole("button", { name: "Submit for review", exact: true })
    .click();
  await page.locator(".submission-confirmation").waitFor({ timeout: 20000 });
  assert.equal(
    await page.evaluate(() =>
      Object.keys(localStorage).some((k) => k.startsWith("pote-kole:draft:")),
    ),
    false,
  );
  await page.goto(base + "/en/dashboard");
  assert.ok(
    (await page.locator(".dashboard-list").innerText()).includes(
      "QA private workflow rehearsal",
    ),
  );
  const anon = await browser.newPage();
  await anon.goto(base + "/en/explore");
  assert.equal(await anon.locator(".campaign-card").count(), 0);
  await anon.close();
  await page.screenshot({
    path: "test-results/connected-organizer-390.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  await context.close();
  console.log(
    "PASS: actual Supabase sign-in/session, private admin boundary, four-step submission, private photo crop/upload, draft restore/cleanup, pending dashboard and public isolation; no email sent",
  );
} finally {
  await db.auth.signOut();
  await browser.close();
}

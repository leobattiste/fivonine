import { createServerClient } from "@supabase/ssr";
import { chromium } from "playwright-core";
import fs from "node:fs";
import assert from "node:assert/strict";
const q = JSON.parse(fs.readFileSync(process.env.QA_IDENTITY_FILE, "utf8")),
  base = process.env.BASE_URL ?? "http://localhost:3100",
  cookies = [];
const db = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    cookies: {
      getAll: () => cookies,
      setAll: (list) => {
        for (const c of list) {
          const i = cookies.findIndex((x) => x.name === c.name);
          if (i >= 0) cookies.splice(i, 1);
          cookies.push(c);
        }
      },
    },
  },
);
assert.equal(
  (await db.auth.signInWithPassword({ email: q.email, password: q.password }))
    .error,
  null,
);
const { data, error } = await db
  .from("campaigns")
  .select("id")
  .eq("owner_id", q.id)
  .order("created_at", { ascending: false })
  .limit(1);
assert.equal(error, null);
assert.equal(data.length, 1);
const id = data[0].id;
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    await context.addCookies(
      cookies.map((c) => ({ name: c.name, value: c.value, url: base })),
    );
    const page = await context.newPage();
    const response = await page.goto(`${base}/en/dashboard/${id}/preview`);
    assert.equal(response.status(), 200);
    assert.equal(await page.locator(".owner-preview").count(), 1);
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll(".campaign-main img")).some(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `test-results/agency/owner-preview-${width}.png`,
      fullPage: true,
    });
    await context.close();
  }
  const anon = await browser.newPage();
  await anon.goto(`${base}/en/dashboard/${id}/preview`);
  assert.equal(new URL(anon.url()).pathname, "/en/login");
  assert.equal((await anon.goto(`${base}/en/campaigns/${id}`)).status(), 404);
  await anon.close();
  console.log(
    "PASS: populated owner-only listing preview, private cover rendering, mobile/desktop layout, sign-in boundary and public isolation",
  );
} finally {
  await db.auth.signOut();
  await browser.close();
}

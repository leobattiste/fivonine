import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
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
const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false } },
);
assert.ok(
  (
    await anon.rpc("website_action", {
      action_name: "message",
      payload: {
        kind: "contact",
        email: q.email,
        body: "Should not be inserted",
      },
      backend_secret: "invalid",
    })
  ).error,
);
assert.ok((await anon.from("organizer_profiles").select("*")).error);
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.addCookies(
    cookies.map((c) => ({ name: c.name, value: c.value, url: base })),
  );
  const page = await context.newPage();
  await page.goto(base + "/en/admin");
  assert.equal(await page.locator(".admin .tabs a").count(), 9);
  assert.equal(await page.locator(".admin-metrics article").count(), 4);
  await page.goto(base + "/en/admin?tab=queue");
  assert.ok(
    (await page.locator(".admin").innerText()).includes(
      "QA private workflow rehearsal",
    ),
  );
  await page.screenshot({
    path: "test-results/connected-admin-1440.png",
    fullPage: true,
  });
  await page.locator(".admin-table-wrap details summary").first().click();
  const reviewForm = page
    .locator("form")
    .filter({ has: page.locator("[name=record_kind][value=revision]") })
    .first();
  await reviewForm
    .locator("[name=review_note]")
    .fill("QA private moderation rehearsal; do not publish.");
  await reviewForm
    .getByRole("button", { name: "Request changes", exact: true })
    .click();
  await page.waitForTimeout(1000);
  const revision = await db
    .from("campaign_revisions")
    .select("status")
    .eq("status", "needs_changes")
    .limit(1);
  assert.equal(revision.error, null);
  assert.equal(revision.data.length, 1);

  // A real contact message through the public form, retained privately until cleanup.
  const publicPage = await browser.newPage();
  await publicPage.goto(base + "/en/contact");
  await publicPage.locator("[name=name]").fill("QA private rehearsal");
  await publicPage.locator("[name=email]").fill(q.email);
  await publicPage
    .locator("[name=body]")
    .fill("QA private browser contact test");
  await publicPage
    .locator("form.form button[type=submit], form.form button.button")
    .last()
    .click();
  await publicPage.locator("p.notice.success").waitFor({ timeout: 20000 });
  await page.goto(base + "/en/admin?tab=reports&kind=contact");
  assert.ok(
    (await page.locator(".admin").innerText()).includes(
      "QA private browser contact test",
    ),
  );
  await publicPage.close();
  await context.close();
  console.log(
    "PASS: actual admin authorization/queue, server contact write, private inbox, anonymous RPC rejection and private contact protection",
  );
} finally {
  await db.auth.signOut();
  await browser.close();
}

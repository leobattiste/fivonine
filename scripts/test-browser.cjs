const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright-core");
const ts = require("typescript");

// Deliberately separate from `npm test`: this suite starts a local Next server and Chromium.
if (process.env.NODE_TEST_CONTEXT) {
  require("node:test").test("local browser suite", { skip: "Run npm run test:browser explicitly (requires Chromium)." }, () => {});
}

const root = path.resolve(__dirname, "..");
const results = [];
const output = process.env.LAUNCH_BROWSER_OUTPUT || path.join(os.tmpdir(), "fivonine-launch-browser");
const PORT = Number(process.env.LAUNCH_BROWSER_PORT || 3139);
const base = `http://127.0.0.1:${PORT}`;
const slug = "ede-marie-peye-operasyon-li";
let server;

function importTs(file) {
  const filename = path.resolve(root, file);
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } });
  const localRequire = (name) => name.startsWith(".") ? importTs(path.relative(root, path.resolve(path.dirname(filename), `${name}.ts`))) : require(name);
  new Function("require", "module", "exports", outputText)(localRequire, module, module.exports);
  return module.exports;
}

async function check(name, fn) {
  const started = Date.now();
  try {
    await fn();
    results.push({ name, status: "passed", durationMs: Date.now() - started });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, status: "failed", durationMs: Date.now() - started, error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function stopServer() {
  if (!server) return;
  const child = server;
  server = undefined;
  if (child.exitCode !== null) return;
  try { process.kill(-child.pid, "SIGTERM"); } catch {}
  await Promise.race([new Promise((resolve) => child.once("exit", resolve)), new Promise((resolve) => setTimeout(resolve, 5000))]);
  if (child.exitCode === null) { try { process.kill(-child.pid, "SIGKILL"); } catch {} }
}

async function startServer(viewer) {
  await stopServer();
  const log = fs.openSync(path.join(output, `next-${viewer || "anonymous"}.log`), "w");
  // Strip real credentials even if the parent shell has them. These are local UI fixtures.
  const env = {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    NEXT_PUBLIC_SITE_URL: base,
    NEXT_PUBLIC_SUPABASE_URL: "",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    APP_BACKEND_SECRET: "",
    RESEND_API_KEY: "",
    RESEND_FROM: "",
    CRON_SECRET: "",
    PUBLIC_LAUNCH: "false",
    FIVONINE_FIXTURES: "1",
    FIVONINE_FIXTURE_USER: viewer,
    FIVONINE_FIXTURE_NEW: "",
    FIVONINE_FIXTURE_EMERGENCY: "",
  };
  server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--hostname", "127.0.0.1", "--port", String(PORT)], { cwd: root, env, detached: true, stdio: ["ignore", log, log] });
  fs.closeSync(log);
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next exited (${server.exitCode}); see ${output}`);
    try {
      const response = await fetch(`${base}/en`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Local Next server did not become ready; see ${output}`);
}

async function goto(page, route) {
  const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  assert.ok(response && response.status() < 400, `${route}: HTTP ${response?.status()}`);
}

async function expectVisible(locator) {
  await locator.waitFor({ state: "visible", timeout: 15000 });
}

async function checkLayout(page, name) {
  const overflow = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
  assert.ok(overflow.content <= overflow.width + 1, `${name}: horizontal page overflow (${overflow.content}/${overflow.width})`);
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
}

async function anonymousChecks(browser, locales, translate) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const locale of locales) {
    const d = translate(locale);
    await check(`${locale}: public desktop and mobile content`, async () => {
      await goto(page, `/${locale}`);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      await expectVisible(page.getByRole("heading", { name: d.x.home.title, exact: true }));
      assert.deepEqual(await page.locator("#lang-wide option").evaluateAll((options) => options.map((option) => option.value).sort()), ["en", "es", "fr", "ht"]);
      await checkLayout(page, `${locale}-home-desktop`);
      await goto(page, `/${locale}/campaigns/${slug}`);
      await expectVisible(page.getByRole("heading", { name: d.x.detail.support, exact: true }));
      assert.ok((await page.locator("main").innerText()).includes(d.x.detail.goalNote));
      await checkLayout(page, `${locale}-campaign-desktop`);
      await page.setViewportSize({ width: 390, height: 844 });
      await checkLayout(page, `${locale}-campaign-mobile`);
      await goto(page, `/${locale}`);
      await page.getByRole("button", { name: d.x.nav.openMenu, exact: true }).click();
      await expectVisible(page.locator("dialog[open] #lang-drawer"));
      assert.deepEqual(await page.locator("#lang-drawer option").evaluateAll((options) => options.map((option) => option.value).sort()), ["en", "es", "fr", "ht"]);
      await page.getByRole("button", { name: d.x.nav.closeMenu, exact: true }).click();
      await checkLayout(page, `${locale}-home-mobile`);
      await page.setViewportSize({ width: 1440, height: 1000 });
    });
    await check(`${locale}: search empty state and safety guidance`, async () => {
      await goto(page, `/${locale}/explore?q=no-such-fundraiser-987654321`);
      await expectVisible(page.getByRole("heading", { name: d.x.explore.emptyTitle, exact: true }));
      await goto(page, `/${locale}/safety`);
      await expectVisible(page.getByRole("heading", { name: d.pages.safety.title, exact: true }));
      assert.ok((await page.locator("main").innerText()).includes(d.x.pages.safety.limits));
    });
    await check(`${locale}: member routes require login`, async () => {
      for (const route of ["create", "dashboard", "admin"]) {
        await goto(page, `/${locale}/${route}`);
        const url = new URL(page.url());
        assert.equal(url.pathname, `/${locale}/login`);
        assert.equal(url.searchParams.get("next"), `/${locale}/${route}`);
      }
    });
    await check(`${locale}: sign-in, signup, magic-link failure UX`, async () => {
      await goto(page, `/${locale}/login`);
      await page.locator('input[name="email"]').fill("browser-test@example.invalid");
      await page.locator('input[name="password"]').fill("never-a-real-password");
      await page.locator("main form").getByRole("button", { name: d.auth.signIn, exact: true }).click();
      await expectVisible(page.getByRole("status").filter({ hasText: d.auth.notConfigured }));
      await page.getByRole("tab", { name: d.auth.signUp, exact: true }).click();
      await page.locator('input[name="name"]').fill("Local Browser Test");
      await page.locator('input[name="email"]').fill("browser-test@example.invalid");
      await page.locator('input[name="password"]').fill("short");
      assert.equal(await page.locator('input[name="password"]').evaluate((input) => input.checkValidity()), false);
      await page.locator('input[name="password"]').fill("never-a-real-password");
      await page.locator("main form").getByRole("button", { name: d.auth.signUp, exact: true }).click();
      await expectVisible(page.getByRole("status").filter({ hasText: d.auth.notConfigured }));
      await page.getByRole("tab", { name: d.auth.signIn, exact: true }).click();
      await page.getByRole("button", { name: d.auth.magic, exact: true }).click();
      await page.locator('input[name="email"]').fill("browser-test@example.invalid");
      await page.locator("main form").getByRole("button", { name: d.auth.magic, exact: true }).click();
      await expectVisible(page.getByRole("status").filter({ hasText: d.auth.notConfigured }));
    });
  }
  await check("expired callback fails locally and cannot follow an external return URL", async () => {
    await goto(page, "/es/auth/callback?code=invalid-local-test&next=https%3A%2F%2Fevil.invalid");
    assert.equal(new URL(page.url()).pathname, "/es/login");
    assert.equal(new URL(page.url()).searchParams.get("error"), "link");
    await expectVisible(page.getByText(translate("es").auth.linkError, { exact: true }));
  });
  await check("language switching keeps login return path, query, and section", async () => {
    const next = "/fr/campaigns/need-help?tab=updates#support";
    await goto(page, `/fr/login?${new URLSearchParams({ next })}#login`);
    await page.locator("#lang-wide").selectOption("es");
    await page.waitForURL((url) => url.pathname === "/es/login");
    const url = new URL(page.url());
    assert.equal(url.hash, "#login");
    assert.equal(url.searchParams.get("next"), "/es/campaigns/need-help?tab=updates#support");
  });
  await check("public pages have no uncaught browser exceptions", async () => { assert.deepEqual(errors, []); });
  await page.close();
}

async function ownerChecks(browser, locales, translate) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    for (const locale of locales) await check(`${locale}: organizer compose and account layouts`, async () => {
      const d = translate(locale);
      await goto(page, `/${locale}/create`);
      await expectVisible(page.getByRole("heading", { name: d.x.form.title, exact: true }));
      await checkLayout(page, `${locale}-compose-mobile`);
      await goto(page, `/${locale}/dashboard/campaigns/c1`);
      await expectVisible(page.locator('textarea[name="body"]'));
      await checkLayout(page, `${locale}-manage-mobile`);
      await goto(page, `/${locale}/dashboard?tab=profile`);
      assert.equal(new URL(page.url()).pathname, `/${locale}/dashboard`);
      await checkLayout(page, `${locale}-profile-mobile`);
    });
  } finally { await page.close(); }
}

async function run() {
  // This script has no remote base-URL override. It cannot create production accounts,
  // upload real documents, or send emails, even if production env vars are inherited.
  fs.mkdirSync(output, { recursive: true });
  const { locales, t } = importTs("lib/i18n.ts");
  const executablePath = process.env.CHROMIUM_PATH || ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].find((file) => fs.existsSync(file));
  assert.ok(executablePath, "Chromium is required; set CHROMIUM_PATH to its executable.");
  const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
  try {
    await startServer("");
    await anonymousChecks(browser, locales, t);
    await stopServer();
    await startServer("owner");
    await ownerChecks(browser, locales, t);
  } finally {
    await stopServer();
    await browser.close();
    const report = { checkedAt: new Date().toISOString(), evidence: "Local fixture UI and isolated component checks. No live Supabase Auth, Storage, email delivery, or production writes.", results };
    fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
    console.log(`Browser evidence: ${output}`);
  }
  if (results.some((result) => result.status === "failed")) process.exitCode = 1;
}

if (!process.env.NODE_TEST_CONTEXT) run().catch((error) => { console.error(error); process.exitCode = 1; });

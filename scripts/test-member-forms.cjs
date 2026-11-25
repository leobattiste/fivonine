const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { before, after, test } = require("node:test");
const ts = require("typescript");
const { chromium } = require("playwright-core");

const root = path.resolve(__dirname, "..");

// Exercise the real React form components in a browser, with only network and
// server boundaries replaced. No credentials, member accounts or database writes.
function browserBundle() {
  const replacements = new Map([
    [path.join(root, "app/actions.ts"), "exports.postUpdate = exports.submitAppeal = (previous, data) => window.__action(previous, data);"],
    [path.join(root, "lib/upload.ts"), "exports.uploadImage = (...args) => window.__upload(...args);"],
    [path.join(root, "lib/format.ts"), "exports.mediaUrl = () => 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; exports.fmtDate = (value) => value.slice(0, 10);"],
    [path.join(root, "components/Icon.tsx"), "exports.__esModule = true; exports.default = () => null;"],
    [path.join(root, "lib/i18n.ts"), `exports.t = () => ({
      dash: { updateBody: "Update", updateHint: "Tell supporters what happened.", addProof: "Add a photo", publish: "Publish", appealTitle: "Appeal", appealHint: "Tell us what happened", appealSend: "Send appeal" },
      create: { uploadFailed: "Photo upload failed. Try again.", uploading: "Uploading…", uploaded: "Uploaded" }
    });`],
  ]);
  const modules = [], known = new Map();
  const resolve = (specifier, from) => {
    let filename = specifier.startsWith("@/") ? path.join(root, specifier.slice(2)) : specifier.startsWith(".") ? path.resolve(path.dirname(from), specifier) : null;
    if (!filename) return require.resolve(specifier, { paths: [path.dirname(from)] });
    return [filename, `${filename}.ts`, `${filename}.tsx`, `${filename}.js`].find((candidate) => replacements.has(candidate) || fs.existsSync(candidate));
  };
  function add(filename) {
    if (known.has(filename)) return known.get(filename);
    const id = modules.length;
    known.set(filename, id);
    modules.push(null);
    let code = replacements.get(filename) ?? fs.readFileSync(filename, "utf8");
    if (/\.tsx?$/.test(filename)) code = ts.transpileModule(code, { fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const imports = {};
    for (const match of code.matchAll(/\brequire\(["']([^"']+)["']\)/g)) imports[match[1]] = add(resolve(match[1], filename));
    modules[id] = `{code: function(module, exports, require) {\n${code}\n}, imports: ${JSON.stringify(imports)}}`;
    return id;
  }
  const react = add(require.resolve("react"));
  const client = add(require.resolve("react-dom/client"));
  const uploads = add(path.join(root, "components/Uploads.tsx"));
  const appeals = add(path.join(root, "components/AppealHistory.tsx"));
  const appealForm = add(path.join(root, "components/AppealForm.tsx"));
  return `const process = {env: {NODE_ENV: "production"}};
    const modules = [${modules.join(",\n")}], cache = {};
    function load(id) { if (cache[id]) return cache[id].exports; const module = cache[id] = {exports: {}}; modules[id].code(module, module.exports, (name) => load(modules[id].imports[name])); return module.exports; }
    const React = load(${react}), client = load(${client}), root = client.createRoot(document.getElementById("root"));
    window.__calls = [];
    window.__action = async (_, data) => { window.__calls.push(Object.fromEntries(data)); return {ok: true, message: "Published"}; };
    window.__upload = async () => "member/photo.webp";
    window.__mountUpdate = () => root.render(React.createElement(load(${uploads}).UpdateForm, {locale: "en", id: "campaign-id"}));
    window.__mountAppeal = () => root.render(React.createElement(load(${appealForm}).default, {locale: "en"}));
    window.__mountAppeals = (items, locale) => root.render(React.createElement(load(${appeals}).default, {items, locale}));`;
}

let server, browser, origin;
before(async () => {
  const bundle = browserBundle();
  server = http.createServer((request, response) => {
    response.setHeader("content-type", request.url === "/bundle.js" ? "application/javascript; charset=utf-8" : "text/html; charset=utf-8");
    response.end(request.url === "/bundle.js" ? bundle : '<!doctype html><html><body><div id="root"></div><script src="/bundle.js"></script></body></html>');
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
});
after(async () => { await browser?.close(); await new Promise((resolve) => server?.close(resolve)); });

async function pageFor(t) {
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  t.after(async () => { await page.close(); assert.deepEqual(errors, []); });
  await page.goto(origin);
  return page;
}

const image = { name: "proof.png", mimeType: "image/png", buffer: Buffer.from("test-image") };

test("updates block in-flight uploads, retain failed posts, and never reuse proof after success", async (t) => {
  const page = await pageFor(t);
  await page.evaluate(() => window.__mountUpdate());
  const body = page.locator('textarea[name="body"]'), proof = page.locator('input[name="proof"]'), publish = page.getByRole("button", { name: "Publish", exact: true });
  await body.fill("The roof repairs are underway.");
  await page.evaluate(() => { window.__upload = () => new Promise((resolve) => { window.__finishUpload = resolve; }); });
  await page.locator('input[type="file"]').setInputFiles(image);
  await page.waitForFunction(() => document.querySelector('button[type="submit"], button:not([type])').disabled);
  assert.equal(await publish.isDisabled(), true);
  await page.locator("form").evaluate((form) => form.requestSubmit());
  assert.equal(await page.evaluate(() => window.__calls.length), 0);
  await page.evaluate(() => window.__finishUpload("member/first.webp"));
  await page.waitForFunction(() => document.querySelector('input[name="proof"]').value === '["member/first.webp"]');
  await page.evaluate(() => { window.__action = (_, data) => { window.__calls.push(Object.fromEntries(data)); return new Promise((resolve) => { window.__finishAction = resolve; }); }; });
  await publish.click();
  await page.waitForFunction(() => Boolean(window.__finishAction));
  assert.equal(await page.locator('input[type="file"]').isDisabled(), true);
  assert.equal(await page.getByRole("button", { name: "Remove supporting photo 1" }).isDisabled(), true);
  assert.equal(await body.isDisabled(), true);
  await page.evaluate(() => window.__finishAction({ ok: false, message: "Could not publish" }));
  await page.getByRole("status").filter({ hasText: "Could not publish" }).waitFor();
  assert.equal(await body.inputValue(), "The roof repairs are underway.");
  assert.equal(await proof.inputValue(), '["member/first.webp"]');
  await page.evaluate(() => { window.__action = async (_, data) => { window.__calls.push(Object.fromEntries(data)); return { ok: true, message: "Published" }; }; });
  await publish.click();
  await page.waitForFunction(() => document.querySelector('input[name="proof"]').value === "[]" && document.querySelector("textarea").value === "");
  assert.equal(await page.getByRole("button", { name: "Remove supporting photo 1" }).count(), 0);
  await body.fill("A second update without photos.");
  await publish.click();
  await page.waitForFunction(() => window.__calls.length === 3);
  const calls = await page.evaluate(() => window.__calls);
  assert.equal(calls[0].body, "The roof repairs are underway.");
  assert.equal(calls[1].proof, '["member/first.webp"]');
  assert.equal(calls[2].proof, "[]");
});

test("upload failures stay visible and removed photos are excluded from the next update", async (t) => {
  const page = await pageFor(t);
  await page.evaluate(() => window.__mountUpdate());
  await page.locator("textarea").fill("A new receipt from the clinic.");
  await page.evaluate(() => { window.__upload = async () => { throw new Error("network"); }; });
  await page.locator('input[type="file"]').setInputFiles(image);
  await page.getByRole("alert").waitFor();
  assert.equal(await page.locator('input[name="proof"]').inputValue(), "[]");
  assert.equal(await page.locator("textarea").inputValue(), "A new receipt from the clinic.");
  await page.evaluate(() => { window.__upload = async () => "member/retry.webp"; });
  await page.locator('input[type="file"]').setInputFiles(image);
  await page.getByRole("button", { name: "Remove supporting photo 1" }).click();
  assert.equal(await page.locator('input[name="proof"]').inputValue(), "[]");
  assert.equal(await page.getByRole("alert").count(), 0);
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page.waitForFunction(() => window.__calls.length === 1);
  assert.equal(await page.evaluate(() => window.__calls[0].proof), "[]");
});

test("appeal history shows each decision and response in every language, with safe text rendering", async (t) => {
  const page = await pageFor(t);
  const items = [
    { id: "open", status: "open", body: "Please reconsider the account restriction.", admin_note: null, created_at: "2026-11-24T09:00:00Z" },
    { id: "accepted", status: "accepted", body: "The new evidence is attached.", admin_note: "Accepted after reviewing your evidence. <script>window.__unsafe=true</script>", created_at: "2026-11-23T09:00:00Z" },
    { id: "declined", status: "declined", body: "Please review my campaign.", admin_note: "The campaign does not meet the guidelines.", created_at: "2026-11-22T09:00:00Z" },
  ];
  const statuses = { en: ["Under review", "Accepted", "Declined"], fr: ["En cours d'examen", "Accepté", "Refusé"], ht: ["An egzamen", "Aksepte", "Refize"], es: ["En revisión", "Aceptada", "Rechazada"] };
  for (const [locale, expected] of Object.entries(statuses)) {
    await page.evaluate(({ items, locale }) => window.__mountAppeals(items, locale), { items, locale });
    await page.getByText(expected[0], { exact: true }).waitFor();
    assert.deepEqual(await page.locator(".tag").allTextContents(), expected);
    assert.equal(await page.locator("time").count(), 3);
    assert.ok((await page.locator("#root").innerText()).includes(items[1].admin_note));
    assert.equal(await page.evaluate(() => window.__unsafe), undefined);
    assert.equal(await page.locator("#root script").count(), 0);
  }
  await page.evaluate(() => window.__mountAppeals([], "en"));
  await page.getByText("You haven't sent an appeal yet.").waitFor();
});

test("failed appeals keep the member's request for retry and clear it only after success", async (t) => {
  const page = await pageFor(t);
  await page.evaluate(() => {
    window.__mountAppeal();
    window.__action = async (_, data) => { window.__calls.push(Object.fromEntries(data)); return { ok: false, message: "Could not send appeal" }; };
  });
  const body = page.locator("textarea");
  await body.fill("Please reconsider the decision using my additional evidence.");
  await page.getByRole("button", { name: "Send appeal" }).click();
  await page.getByRole("status").filter({ hasText: "Could not send appeal" }).waitFor();
  assert.equal(await body.inputValue(), "Please reconsider the decision using my additional evidence.");
  await page.evaluate(() => { window.__action = async (_, data) => { window.__calls.push(Object.fromEntries(data)); return { ok: true, message: "Appeal sent" }; }; });
  await page.getByRole("button", { name: "Send appeal" }).click();
  await page.waitForFunction(() => document.querySelector("textarea").value === "");
  assert.equal(await page.evaluate(() => window.__calls[0].body === window.__calls[1].body), true);
});

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

// Load the TypeScript helpers directly: these rules decide whether supporters' money reaches the right account.
require.extensions[".ts"] = (module, filename) => {
  const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } });
  module._compile(out.outputText, filename);
};
const root = path.resolve(__dirname, "..");
const pf = require(path.join(root, "lib/payment-fields.ts"));
const wallet = (holder, phone) => pf.formatPayment("moncash", { holder, phone }, "en");

test("Haitian wallet numbers need 8 digits, optionally with 509", () => {
  for (const ok of ["3712 3456", "37123456", "+509 3712-3456", "50937123456"]) assert.equal(pf.walletNumberOk(ok), true, ok);
  for (const bad of ["37 12", "123456789", "3712345a", "+1 407 555 0100"]) assert.equal(pf.walletNumberOk(bad), false, bad);
  assert.equal(pf.formatWalletNumber("50937123456"), "+509 3712 3456");
});

test("wallet details with a wrong number are rejected", () => {
  assert.deepEqual(pf.paymentIssues("moncash", wallet("Marie Joseph", "37 12"), ""), ["phone"]);
  assert.equal(pf.paymentValid("moncash", wallet("Marie Joseph", "37 12"), ""), false);
  assert.equal(pf.paymentValid("moncash", wallet("Marie Joseph", "3712 3456"), ""), true);
  assert.deepEqual(pf.paymentIssues("moncash", wallet("12", "3712 3456"), ""), ["holder"]);
});

test("bank accounts and app handles are checked", () => {
  const bank = (account) => pf.formatPayment("unibank", { holder: "Marie Joseph", account, currency: "HTG" }, "en");
  assert.equal(pf.paymentValid("unibank", bank("1234"), ""), false);
  assert.equal(pf.paymentValid("unibank", bank("0012-345678"), ""), true);
  const app = (method, handle) => pf.formatPayment(method, { holder: "Marie Joseph", handle }, "en");
  assert.equal(pf.paymentValid("zelle", app("zelle", "marie@example.com"), ""), true);
  assert.equal(pf.paymentValid("zelle", app("zelle", "marie"), ""), false);
  assert.equal(pf.paymentValid("cash_app", app("cash_app", "$MarieJ"), ""), true);
  assert.equal(pf.paymentValid("paypal", app("paypal", "paypal.me/mariej"), ""), true);
  // A link alone still satisfies an empty optional handle.
  assert.equal(pf.paymentValid("paypal", app("paypal", ""), "https://paypal.me/mariej"), true);
});

test("free-text methods keep their old rule", () => {
  assert.equal(pf.paymentValid("other", "Cash at the church office", ""), true);
  assert.deepEqual(pf.paymentIssues("other", "Cash at the church office", ""), []);
});

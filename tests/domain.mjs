import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const load = (file, imports = {}) => {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      exports,
      URL,
      FormData,
      require: (name) => {
        if (!(name in imports)) throw new Error(`Unexpected import ${name}`);
        return imports[name];
      },
    },
  );
  return exports;
};
const i18n = load("lib/i18n.ts"),
  domain = load("lib/domain.ts", { "./i18n": i18n });
assert.equal(domain.safeExternal("javascript:alert(1)"), null);
assert.equal(domain.safeExternal("http://example.com/donate"), null);
assert.equal(domain.safeExternal("https://localhost/x"), null);
assert.equal(domain.safeExternal("https://127.0.0.1/x"), null);
assert.equal(domain.safeExternal("https://user:pass@example.com/x"), null);
assert.equal(
  domain.safeExternal("https://example.com/donate"),
  "https://example.com/donate",
);
const parts = domain.supportParts(
  "Support at https://example.com/help. Thank you! <script>bad()</script>",
);
assert.equal(parts.filter((p) => p.url).length, 1);
assert.equal(parts.find((p) => p.url).url, "https://example.com/help");
const values = {
  title: "Community classroom",
  story: "A real story supplied by an organizer.",
  category: "education",
  country: "Haiti",
  region: "Jacmel",
  organizer_name: "Organizer",
  relationship: "Community member",
  beneficiary: "Students",
  intended_use: "Learning materials",
  distribution: "Delivered by the organizer",
  support_text: "Contact the community group or visit https://example.com/help",
  photo_url: "https://example.com/photo.webp",
  goal: "1200.50",
  currency: "USD",
  language: "ht",
  consent: "on",
  accuracy: "on",
};
const form = (changes = {}) => {
  const f = new FormData();
  Object.entries({ ...values, ...changes }).forEach(([k, v]) => f.set(k, v));
  return f;
};
assert.equal(domain.parseCampaign(form()).goal, 1200.5);
assert.equal(domain.parseCampaign(form({ goal: "" })).goal, null);
for (const change of [
  { consent: "" },
  { accuracy: "" },
  { goal: "-20" },
  { goal: "NaN" },
  { category: "investment" },
  { language: "xx" },
  { currency: "XYZ" },
  { support_text: "Use http://example.com/help" },
  { photo_url: "javascript:alert(1)" },
  { title: "a".repeat(161) },
  { story: "" },
])
  assert.throws(() => domain.parseCampaign(form(change)));
for (const l of i18n.locales) {
  const dictionary = i18n.t(l);
  assert.equal(
    Object.keys(dictionary).length,
    Object.keys(i18n.t("en")).length,
  );
  for (const key of Object.keys(dictionary))
    assert.ok(dictionary[key], `${l}.${key}`);
}
const sql = fs.readFileSync("supabase/schema.sql", "utf8");
assert.ok(!/create table.*(?:donor|wallet|payment|payout)/i.test(sql));
for (const table of [
  "organizer_profiles",
  "campaigns",
  "campaign_revisions",
  "campaign_updates",
  "reports",
  "contact_messages",
  "review_events",
  "email_outbox",
  "request_limits",
  "campaign_metrics",
])
  assert.ok(
    sql.includes(`alter table public.${table} enable row level security`),
  );
console.log(
  "PASS: support-link safety, text preservation, campaign validation, locale coverage and schema safeguards",
);

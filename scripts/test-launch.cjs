const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
// Run the actual TypeScript actions with only framework/network boundaries replaced.
// These tests establish validation and API calls, not real Supabase authentication or RLS.
function load(file, overrides = {}, cache = new Map()) {
  file = path.resolve(root, file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const requireLocal = (name) => {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name === "server-only") return {};
    if (name.startsWith("@/") || name.startsWith(".")) {
      const target = name.startsWith("@/") ? path.join(root, name.slice(2)) : path.resolve(path.dirname(file), name);
      const candidate = [target, `${target}.ts`, `${target}.tsx`, `${target}.js`].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
      if (candidate) return load(candidate, overrides, cache);
    }
    return require(name);
  };
  const { outputText } = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: file,
  });
  new Function("require", "module", "exports", "__filename", "__dirname", outputText)(requireLocal, module, module.exports, file, path.dirname(file));
  return module.exports;
}

const { locales, t } = load("lib/i18n.ts");
const { safeNext, profileReady } = load("lib/auth.ts", {
  react: { cache: (fn) => fn },
  "next/navigation": {},
  "./supabase/server": {},
});
const { storyHtml, storyText, cleanStory } = load("lib/story.ts");
const OWNER = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";
const CAMPAIGN = "33333333-3333-4333-8333-333333333333";
const form = (values) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, String(value));
  return data;
};
const writes = (h) => h.queries.filter((q) => ["insert", "upsert", "update", "delete"].includes(q.operation));

function harness({ user = { id: OWNER, email: "owner@example.test" }, configured = true, auth = {}, sessionError = null, resolve, uploaded = true } = {}) {
  const queries = [], calls = [], scheduled = [];
  const sb = {
    storage: { from: (bucket) => ({ list: async (folder, options) => {
      calls.push({ name: "storage.list", args: { bucket, folder, search: options.search } });
      return { data: uploaded ? [{ name: options.search }] : [], error: null };
    } }) },
    auth: {
      getUser: async () => ({ data: { user }, error: sessionError }),
      ...Object.fromEntries(["signInWithPassword", "signUp", "signInWithOtp", "updateUser", "signOut"].map((name) => [name, async (args) => {
        calls.push({ name, args });
        return auth[name] ?? { data: { user: { id: OWNER, identities: [{}] }, session: null }, error: null };
      }])),
    },
    from(table) {
      const q = { table, operation: "select", value: undefined, filters: [] };
      let execution;
      const finish = () => execution ??= Promise.resolve().then(() => {
        queries.push(q);
        if (resolve) return resolve(q);
        if (table === "profiles") return { data: { display_name: "Marie Joseph", bio: "Organizer helping my family.", department: "Nord", city: "Cap-Haïtien", role: "user", banned: false }, error: null };
        return { data: null, error: null };
      });
      const chain = new Proxy({}, {
        get(_, name) {
          if (name === "then") return (yes, no) => finish().then(yes, no);
          if (["single", "maybeSingle"].includes(name)) return () => finish();
          if (["insert", "upsert", "update", "delete"].includes(name)) return (value) => { q.operation = name; q.value = value; return chain; };
          if (["eq", "neq", "in", "is"].includes(name)) return (...args) => { q.filters.push([name, ...args]); return chain; };
          return () => chain;
        },
      });
      return chain;
    },
    rpc: async (name, args) => {
      calls.push({ name, args });
      return { data: "ok", error: null };
    },
  };
  const overrides = {
    "@/lib/supabase/server": { db: async () => configured ? sb : null },
    "./supabase/server": { db: async () => configured ? sb : null },
    "next/cache": { revalidatePath: () => {} },
    "next/headers": { headers: async () => new Headers({ origin: "http://localhost:3000" }) },
    "next/navigation": { redirect: (url) => { throw Object.assign(new Error("redirect"), { url }); } },
    "next/server": { after: (fn) => scheduled.push(fn) },
    "@/lib/email": { drainOutbox: async () => { throw new Error("Unit tests must not send email"); } },
    react: { cache: (fn) => fn },
  };
  return { actions: load("app/actions.ts", overrides), admin: load("app/admin-actions.ts", overrides), queries, calls, scheduled };
}

test("sign-in return paths cannot redirect to another origin", () => {
  const fallback = "/ht/dashboard";
  for (const value of [null, "", "https://evil.test", "//evil.test", "/\\evil.test", "/\n/evil.test", "javascript:alert(1)"]) {
    assert.equal(safeNext(value, fallback), fallback, String(value));
  }
  for (const value of ["/es/create", "/en/campaigns/need?tab=updates#support", "/fr/dashboard?message=a%20b"]) assert.equal(safeNext(value, fallback), value);
});

test("a public organizer profile requires a real name, location, and useful biography", () => {
  const profile = { display_name: "Marie Joseph", bio: "I help my family and neighbors.", department: "Nord", city: null };
  assert.equal(profileReady(profile), true);
  assert.equal(profileReady({ ...profile, department: null, city: "Cap-Haïtien" }), true);
  for (const patch of [{ display_name: "Member" }, { display_name: "Yon kout men member" }, { display_name: " " }, { bio: "short" }, { department: null, city: null }]) assert.equal(profileReady({ ...profile, ...patch }), false);
});

test("campaign stories preserve useful formatting while removing executable HTML and unsafe links", () => {
  const untrusted = '<p onclick="steal()">Help <strong>Marie</strong><script>alert(1)</script><a href="javascript:alert(1)">unsafe</a><a href="https://hospital.example.test/bill">bill</a><img src=x onerror=steal()></p>';
  const html = storyHtml(untrusted);
  assert.match(html, /<strong>Marie<\/strong>/);
  assert.match(html, /href="https:\/\/hospital.example.test\/bill"/);
  if (html.includes('target="_blank"')) assert.match(html, /rel="[^"]*noopener/);
  assert.doesNotMatch(html, /javascript:|onclick|onerror|<script|<img/);
  assert.doesNotMatch(cleanStory(untrusted), /javascript:|onclick|onerror|<script|<img/);
  assert.equal(storyHtml("<script>alert(1)</script>\n\nText & need"), "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p><p>Text &amp; need</p>");
  assert.equal(storyText("<p>Marie &amp; Jean</p><p>Hospital bill</p>"), "Marie & Jean\nHospital bill");
});

test("all four languages show a configured-backend failure instead of pretending auth succeeded", async () => {
  for (const locale of locales) {
    const h = harness({ configured: false });
    for (const action of ["signIn", "signUp", "magicLink"]) assert.deepEqual(await h.actions[action](null, form({ locale, email: "test@example.test", password: "correct-password", name: "Marie" })), { ok: false, message: t(locale).auth.notConfigured });
    assert.equal(h.calls.length, 0);
  }
});

test("signup validates before contacting auth and preserves locale and a safe callback destination", async () => {
  const h = harness();
  assert.equal((await h.actions.signUp(null, form({ locale: "es", name: "Marie", email: "invalid", password: "correct-password" }))).ok, false);
  assert.deepEqual(await h.actions.signUp(null, form({ locale: "es", name: "Marie", email: "marie@example.test", password: "short" })), { ok: false, message: t("es").auth.weak });
  assert.equal(h.calls.length, 0);
  const result = await h.actions.signUp(null, form({ locale: "es", name: " Marie Joseph ", email: " MARIE@EXAMPLE.TEST ", password: "correct-password", next: "https://evil.test/steal" }));
  assert.deepEqual(result, { ok: true, message: t("es").auth.confirmSent });
  const { args } = h.calls.find((c) => c.name === "signUp");
  assert.equal(args.email, "marie@example.test");
  assert.deepEqual(args.options.data, { display_name: "Marie Joseph", locale: "es" });
  const callback = new URL(args.options.emailRedirectTo);
  assert.equal(callback.pathname, "/es/auth/callback");
  assert.equal(callback.searchParams.get("next"), "/es/dashboard");
});

test("successful sign-in redirects locally, while bad credentials and rate limits stay localized", async () => {
  for (const locale of locales) {
    const values = { locale, email: "marie@example.test", password: "correct-password", next: "//evil.test" };
    const success = harness();
    await assert.rejects(success.actions.signIn(null, form(values)), (e) => e.url === `/${locale}/dashboard`);
    for (const [error, message] of [[{ status: 400, message: "Invalid login credentials" }, t(locale).auth.invalid], [{ status: 429, message: "rate limit" }, t(locale).auth.rate]]) {
      const h = harness({ auth: { signInWithPassword: { error } } });
      assert.deepEqual(await h.actions.signIn(null, form(values)), { ok: false, message });
    }
  }
});

test("magic links do not create users and preserve the campaign return path", async () => {
  const h = harness();
  const next = "/ht/campaigns/help-marie#support";
  assert.deepEqual(await h.actions.magicLink(null, form({ locale: "ht", email: " MARIE@EXAMPLE.TEST ", next })), { ok: true, message: t("ht").auth.magicSent });
  const { args } = h.calls.find((c) => c.name === "signInWithOtp");
  assert.equal(args.options.shouldCreateUser, false);
  assert.equal(args.email, "marie@example.test");
  assert.equal(new URL(args.options.emailRedirectTo).searchParams.get("next"), next);
});

test("anonymous visitors cannot perform member mutations", async () => {
  const h = harness({ user: null });
  const input = form({ locale: "en", id: CAMPAIGN, campaign_id: CAMPAIGN, amount: "100", body: "A real update that should not be posted anonymously.", payload: "{}" });
  for (const name of ["saveCampaign", "postUpdate", "addContribution", "submitAppeal", "changePassword"]) assert.deepEqual(await h.actions[name](null, input), { ok: false, message: t("en").common.signInFirst }, name);
  assert.equal(writes(h).length, 0);
});

test("auth infrastructure failures cannot masquerade as signed-out sessions", async () => {
  const h = harness({ user: null, sessionError: { status: 503, code: "unexpected_failure" } });
  await assert.rejects(h.actions.changePassword(null, form({ locale: "en", password: "new-password" })), /temporarily unavailable/);
  assert.equal(writes(h).length, 0);
});

test("support acknowledgements validate money and preserve anonymous privacy", async () => {
  const h = harness();
  for (const amount of ["0", "-1", "not-a-number", "Infinity", "50000001"]) assert.equal((await h.actions.addContribution(null, form({ locale: "en", campaign_id: CAMPAIGN, amount }))).ok, false);
  assert.equal(writes(h).length, 0);
  const result = await h.actions.addContribution(null, form({ locale: "en", campaign_id: CAMPAIGN, amount: "1,234.567", currency: "USD", method: "moncash", anonymous: "on", display_name: "Private Person", message: "Thank you" }));
  assert.equal(result.ok, true);
  const insert = writes(h).find((q) => q.table === "contributions");
  assert.equal(insert.value.amount, 1234.57);
  assert.equal(insert.value.currency, "USD");
  assert.equal(insert.value.user_id, OWNER);
  assert.equal(insert.value.anonymous, true);
  assert.equal(insert.value.display_name, null);
  assert.equal(insert.value.message, "Thank you");
});

test("updates reject attachments owned by another account without creating a post", async () => {
  const h = harness();
  const own = `${OWNER}/receipt-one.webp`;
  const result = await h.actions.postUpdate(null, form({ locale: "fr", id: CAMPAIGN, body: "We paid the hospital deposit.", proof: JSON.stringify([own, `${OTHER}/private-receipt.webp`, 42]) }));
  assert.equal(result.ok, false);
  assert.equal(writes(h).length, 0);
});

test("an owner-prefixed receipt path must refer to an actual upload", async () => {
  const h = harness({ uploaded: false });
  const result = await h.actions.postUpdate(null, form({ locale: "en", id: CAMPAIGN, body: "Hospital deposit paid.", proof: JSON.stringify([`${OWNER}/receipt-one.webp`]) }));
  assert.equal(result.ok, false); assert.equal(writes(h).length, 0);
});

test("a second update without attachments does not inherit the first update's proof", async () => {
  const h = harness();
  await h.actions.postUpdate(null, form({ locale: "en", id: CAMPAIGN, body: "Deposit paid.", proof: JSON.stringify([`${OWNER}/receipt-one.webp`]) }));
  await h.actions.postUpdate(null, form({ locale: "en", id: CAMPAIGN, body: "Recovery is going well.", proof: "[]" }));
  const updates = writes(h).filter((q) => q.table === "campaign_updates");
  assert.deepEqual(updates.map((q) => q.value.proof), [[`${OWNER}/receipt-one.webp`], []]);
  // This covers the action boundary; the browser suite separately checks controlled UI reset.
});

test("non-admin and banned accounts cannot make moderation decisions", async () => {
  for (const profile of [{ role: "user", banned: false }, { role: "admin", banned: true }]) {
    const h = harness({ resolve: (q) => ({ data: q.table === "profiles" ? profile : null, error: null }) });
    const result = await h.admin.moderate(null, form({ locale: "en", id: CAMPAIGN, decision: "approve", tier: "id_checked" }));
    assert.equal(result.ok, false);
    assert.equal(writes(h).length, 0);
  }
});

const verifiedPayload = () => ({ title: "Help Marie pay a hospital bill", story: "Marie needs help paying a hospital bill and recovering safely at home.", cause: "medical", department: "Nord", beneficiary_name: "Marie Joseph", beneficiary_relation: "self", cover_path: `${OWNER}/cover-photo.webp`, methods: [{ method: "moncash", details: "Marie Joseph +509 3712 0000" }], consent: true, priv: { contact_name: "Marie Joseph", contact_email: "owner@example.test", contact_details: "WhatsApp +509 3712 0000", id_front_path: `${OWNER}/front-identity.webp`, selfie_path: `${OWNER}/selfie-identity.webp` } });
test("campaign submission requires identity, recipient details, contact and consent before writes", async () => {
  for (const change of [p => { p.priv.id_front_path = null; }, p => { p.beneficiary_name = ""; }, p => { p.priv.contact_details = ""; }, p => { p.consent = false; }]) {
    const h = harness(), payload = verifiedPayload(); change(payload);
    const result = await h.actions.saveCampaign(null, form({ locale: 'en', intent: 'submit', payload: JSON.stringify(payload) }));
    assert.equal(result.ok, false); assert.equal(writes(h).length, 0);
  }
  const h = harness({ uploaded: false });
  assert.equal((await h.actions.saveCampaign(null, form({ locale: 'en', intent: 'submit', payload: JSON.stringify(verifiedPayload()) }))).ok, false);
  assert.equal(writes(h).length, 0);
});
test("an organizer cannot overwrite another account's campaign", async () => {
  const h = harness({ resolve: q => ({ data: q.table === 'profiles' ? { display_name: 'Marie Joseph', bio: 'I help my family and neighbors.', department: 'Nord', city: 'Cap-Haïtien' } : q.table === 'campaigns' ? { id: CAMPAIGN, owner_id: OTHER, status: 'draft' } : null, error: null }) });
  const result = await h.actions.saveCampaign(null, form({ locale: 'en', intent: 'draft', payload: JSON.stringify({ ...verifiedPayload(), id: CAMPAIGN }) }));
  assert.equal(result.ok, false); assert.equal(writes(h).length, 0);
});
test("public edits create a proposal without overwriting the published campaign", async () => {
  const h = harness({ resolve: q => ({ data: q.table === 'profiles' ? { display_name: 'Marie Joseph', bio: 'I help my family and neighbors.', department: 'Nord', city: 'Cap-Haïtien' } : q.table === 'campaigns' ? { id: CAMPAIGN, owner_id: OWNER, status: 'live' } : null, error: null }) });
  await assert.rejects(h.actions.saveCampaign(null, form({ locale: 'ht', intent: 'submit', payload: JSON.stringify({ ...verifiedPayload(), id: CAMPAIGN }) })), e => e.url === `/ht/dashboard/campaigns/${CAMPAIGN}?changes=1`);
  assert.ok(writes(h).some(q => q.table === 'campaign_changes' && q.operation === 'upsert'));
  assert.equal(writes(h).some(q => q.table === 'campaigns'), false);
});

test("replacing published identity evidence resubmits the withdrawn draft for review", async () => {
  let evidenceUpdated = false;
  const h = harness({ resolve: q => {
    if (q.table === 'campaign_private' && q.operation === 'upsert') evidenceUpdated = true;
    const data = q.table === 'profiles' ? { display_name: 'Marie Joseph', bio: 'I help my family and neighbors.', department: 'Nord', city: 'Cap-Haïtien' }
      : q.table === 'campaigns' && q.operation === 'select' ? { id: CAMPAIGN, owner_id: OWNER, status: evidenceUpdated ? 'needs_changes' : 'live' }
      : q.table === 'support_methods' && q.operation === 'select' ? [] : null;
    return { data, error: null };
  } });
  await assert.rejects(h.actions.saveCampaign(null, form({ locale: 'en', intent: 'submit', payload: JSON.stringify({ ...verifiedPayload(), id: CAMPAIGN }) })), e => e.url === `/en/dashboard/campaigns/${CAMPAIGN}?sent=1`);
  assert.equal(writes(h).some(q => q.table === 'campaign_changes'), false);
  assert.ok(writes(h).some(q => q.table === 'campaigns' && q.value.status === 'pending'));
});

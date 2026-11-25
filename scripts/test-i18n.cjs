const assert = require("node:assert/strict");
const fs = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

// Use the project's existing compiler so tests need no extra runtime dependency.
require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { locales, isLocale, localeNames, storyLanguages, htmlLang, t, localizedPath } = require("../lib/i18n.ts");
const { fmtDate, fmtNumber, fmtMoney } = require("../lib/format.ts");
const { emptyForm } = require("../lib/form.ts");
const { fxCategories } = require("../lib/fixtures.ts");

function checkDictionary(reference, translation, location) {
  assert.equal(typeof translation, typeof reference, `${location}: value type`);
  if (typeof reference === "string") {
    assert.ok(translation.trim().length, `${location}: missing text`);
    assert.doesNotMatch(translation, /\b(?:TODO|TRANSLATE|undefined)\b/, `${location}: unfinished translation`);
    if (/\.guides\.\d+\.id$/.test(location)) assert.equal(translation, reference, `${location}: section anchor must remain stable`);
    return;
  }
  if (typeof reference === "function") {
    assert.equal(translation.length, reference.length, `${location}: interpolation arguments`);
    const numeric = /\.(?:results|supporters|unread|page|stepOf|ready)$/.test(location);
    const samples = numeric ? [[0, 7], [1, 7], [3, 7]] : [["Marie & Jean — Haïti"]];
    for (const args of samples) {
      const expected = reference(...args), actual = translation(...args);
      assert.equal(typeof actual, "string", `${location}: interpolated result`);
      assert.ok(actual.trim().length, `${location}: empty interpolated result`);
      assert.doesNotMatch(actual, /undefined|NaN/, `${location}: broken interpolation`);
      for (const value of args) {
        if (expected.includes(String(value))) assert.ok(actual.includes(String(value)), `${location}: dropped interpolation ${value}`);
      }
    }
    return;
  }
  assert.equal(Array.isArray(translation), Array.isArray(reference), `${location}: array type`);
  if (Array.isArray(reference)) assert.equal(translation.length, reference.length, `${location}: array length`);
  assert.deepEqual(Object.keys(translation).sort(), Object.keys(reference).sort(), `${location}: translation keys`);
  for (const key of Object.keys(reference)) checkDictionary(reference[key], translation[key], `${location}.${key}`);
}

test("all four interface and story languages have native labels and HTML language codes", () => {
  assert.deepEqual([...locales].sort(), ["en", "es", "fr", "ht"]);
  assert.equal(localeNames.ht, "Kreyòl");
  assert.equal(localeNames.es, "Español");
  for (const locale of locales) {
    assert.equal(isLocale(locale), true);
    assert.equal(htmlLang[locale], locale);
    assert.equal(storyLanguages[locale], localeNames[locale]);
    assert.equal(emptyForm(locale).language, locale);
  }
  for (const invalid of ["de", "EN", "fr-FR", "", "undefined"]) assert.equal(isLocale(invalid), false);
});

for (const locale of ["fr", "ht", "es"]) {
  test(`${locale} preserves every dictionary key, array entry, and interpolation`, () => {
    checkDictionary(t("en"), t(locale), locale);
  });
}

test("new language headlines and primary actions use translated copy", () => {
  for (const locale of ["ht", "es"]) {
    const d = t(locale);
    assert.notEqual(d.x.home.title, t("en").x.home.title);
    assert.notEqual(d.x.home.title, t("fr").x.home.title);
    assert.notEqual(d.auth.signIn, t("en").auth.signIn);
    assert.notEqual(d.common.error, t("en").common.error);
  }
});

test("switching between every language keeps the page, search filters, and section anchor", () => {
  for (const from of locales) for (const to of locales) {
    const suffix = "/campaigns/help-marie?q=Cap-Ha%C3%AFtien&cause=medical&page=2#updates";
    assert.equal(localizedPath(`/${from}${suffix}`, to), `/${to}${suffix}`);
    assert.equal(localizedPath(`/${from}`, to), `/${to}`);
    assert.equal(localizedPath(`/${from}/`, to), `/${to}/`);
  }
  assert.equal(localizedPath("/english-story?q=help#story", "ht"), "/ht/english-story?q=help#story");
});

test("language switching preserves and localizes the sign-in return destination", () => {
  for (const from of locales) for (const to of locales) {
    const next = `/${from}/campaigns/help-marie?tab=updates&term=Jean%2BPierre#support`;
    const query = new URLSearchParams({ next, mode: "up", message: "Jean & Marie" });
    const result = new URL(localizedPath(`/${from}/login?${query}#sign-in`, to), "https://example.test");
    assert.equal(result.pathname, `/${to}/login`);
    assert.equal(result.hash, "#sign-in");
    assert.equal(result.searchParams.get("next"), `/${to}/campaigns/help-marie?tab=updates&term=Jean%2BPierre#support`);
    assert.equal(result.searchParams.get("mode"), "up");
    assert.equal(result.searchParams.get("message"), "Jean & Marie");
  }
});

test("language switching does not follow external URLs or rewrite external return destinations", () => {
  for (const href of ["https://example.com/fr/create", "//example.com/fr/create", "javascript:alert(1)"]) {
    assert.equal(localizedPath(href, "es"), "/es");
  }
  for (const next of ["https://example.com/fr/create", "//example.com/fr/create", "/assets/guide.pdf"]) {
    const query = new URLSearchParams({ next });
    const result = new URL(localizedPath(`/fr/login?${query}`, "ht"), "https://example.test");
    assert.equal(result.pathname, "/ht/login");
    assert.equal(result.searchParams.get("next"), next);
  }
});

test("dates display Haitian Creole months and use UTC across year boundaries", () => {
  const months = ["janvye", "fevriye", "mas", "avril", "me", "jen", "jiyè", "out", "septanm", "oktòb", "novanm", "desanm"];
  for (const [index, month] of months.entries()) {
    const iso = new Date(Date.UTC(2026, index, 15)).toISOString();
    assert.equal(fmtDate(iso, "ht"), `15 ${month} 2026`);
  }
  assert.equal(fmtDate("2026-12-31T23:30:00-05:00", "ht"), "1 janvye 2027");
  assert.match(fmtDate("2026-11-13T00:00:00Z", "es"), /noviembre/);
  assert.match(fmtDate("2026-11-13T00:00:00Z", "fr"), /novembre/);
  assert.match(fmtDate("2026-11-13T00:00:00Z", "en"), /November/);
  for (const locale of locales) {
    assert.ok(fmtNumber(12345, locale).length > 4);
    assert.ok(fmtMoney(12345, "HTG", locale).endsWith(" HTG"));
  }
});

test("preview categories supply a translated label for every supported language", () => {
  assert.equal(fxCategories.length, 5);
  for (const category of fxCategories) for (const locale of locales) {
    assert.ok(category[`name_${locale}`]?.trim(), `${category.slug}: ${locale} label missing`);
  }
  assert.equal(fxCategories.find((category) => category.slug === "education").name_es, "Educación");
});

function offlineWorker(cachedResponse) {
  const listeners = {};
  vm.runInNewContext(fs.readFileSync(`${__dirname}/../public/sw.js`, "utf8"), {
    self: { addEventListener: (name, listener) => { listeners[name] = listener; } },
    location: { origin: "https://example.test" },
    URL,
    Response,
    fetch: async () => { throw new Error("offline"); },
    caches: { match: async () => cachedResponse },
  });
  return (pathname) => {
    let response;
    listeners.fetch({
      request: { url: `https://example.test${pathname}`, method: "GET", mode: "navigate" },
      respondWith: (result) => { response = result; },
    });
    return response;
  };
}

test("offline navigation gives first-time visitors instructions in the page language", async () => {
  const navigate = offlineWorker();
  const titles = { en: "You're offline", fr: "Vous êtes hors ligne", ht: "Ou pa gen entènèt", es: "No tienes conexión" };
  for (const [locale, title] of Object.entries(titles)) {
    const response = await navigate(`/${locale}/campaigns/help-marie`);
    assert.match(response.headers.get("content-type"), /text\/html/);
    const html = await response.text();
    assert.ok(html.includes(`<html lang="${locale}">`));
    assert.ok(html.includes(`<h1>${title}</h1>`));
  }
  const fallback = await navigate("/unsupported-page");
  assert.ok((await fallback.text()).includes('<html lang="fr">'));
});

test("offline navigation retains an already opened campaign instead of replacing it with generic copy", async () => {
  const cached = new Response('<html lang="es"><h1>Ayuda para Marie</h1></html>');
  const navigate = offlineWorker(cached);
  const response = await navigate("/es/campaigns/help-marie");
  assert.equal(await response.text(), '<html lang="es"><h1>Ayuda para Marie</h1></html>');
  // Member pages continue to bypass public offline caching.
  for (const route of ["/es/login", "/ht/create", "/fr/dashboard", "/en/admin"]) assert.equal(navigate(route), undefined);
});

test("offline cache stores only responses explicitly marked anonymous by the server", async () => {
  for (const anonymous of [false, true]) {
    const listeners = {}, stored = [];
    vm.runInNewContext(fs.readFileSync(`${__dirname}/../public/sw.js`, "utf8"), {
      self: { addEventListener: (name, listener) => { listeners[name] = listener; } },
      location: { origin: "https://example.test" }, URL, Response,
      fetch: async () => new Response("<h1>Campaign</h1>", { headers: anonymous ? { "X-Fivonine-Public-Cache": "1" } : {} }),
      caches: { open: async () => ({ put: async (request, response) => stored.push(await response.text()) }) },
    });
    let response;
    listeners.fetch({ request: { url: "https://example.test/en/campaigns/help-marie", method: "GET", mode: "navigate" }, respondWith: (result) => { response = result; } });
    assert.equal(await (await response).text(), "<h1>Campaign</h1>");
    assert.equal(stored.length, anonymous ? 1 : 0);
  }
});

// Isolated component fixture. No administrator is created and no mutation is sent.
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const require = createRequire(import.meta.url);
function load(file, imports = {}) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    {
      exports,
      URL,
      FormData,
      console,
      require: (name) => (name in imports ? imports[name] : require(name)),
    },
  );
  return exports;
}
const i18n = load("lib/i18n.ts"),
  brief = load("lib/brief.ts"),
  editorial = load("lib/editorial.ts"),
  platform = load("lib/platform-content.ts"),
  domain = load("lib/domain.ts", { "./i18n": i18n });
const icon = load("components/Icon.tsx"),
  support = load("components/SupportText.tsx", {
    "./Icon": icon,
    "@/lib/domain": domain,
  });
const media = {
  __esModule: true,
  default: ({ alt }) =>
    React.createElement(
      "div",
      { className: "campaign-cover" },
      React.createElement("div", { className: "cover-fallback" }, alt),
    ),
};
const common = {
  "@/lib/i18n": i18n,
  "@/lib/brief": brief,
  "@/lib/editorial": editorial,
  "@/lib/domain": domain,
  "./Icon": icon,
  "./SupportText": support,
  "./Media": media,
  "next/link": {
    __esModule: true,
    default: ({ href, children, ...props }) =>
      React.createElement("a", { href, ...props }, children),
  },
};
const actions = new Proxy(
  {},
  { get: () => async () => ({ ok: false, message: "" }) },
);
const forms = load("components/Forms.tsx", {
  ...common,
  "@/app/actions": actions,
  "./PhotoUpload": { __esModule: true, default: () => null },
  "./Turnstile": { __esModule: true, default: () => null },
});
const queue = load("components/ReviewQueue.tsx", {
  ...common,
  "./Forms": forms,
});
const content = {
  title: "Private component fixture",
  story: "A submission awaiting review.",
  organizer_name: "Fixture organizer",
  category: "education",
  country: "Haiti",
  region: "Jacmel",
  beneficiary: "Community school",
  relationship: "Teacher",
  intended_use: "Classroom books",
  distribution: "Local delivery",
  support_text: "Support instructions supplied by the organizer.",
  fundraising_url: "",
  photo_url: "",
  goal: null,
  currency: "USD",
  language: "en",
};
const html = renderToStaticMarkup(
  React.createElement(queue.default, {
    locale: "en",
    rows: [
      {
        id: "fixture",
        title: content.title,
        status: "pending",
        kind: "revision",
        created_at: "2026-11-11T00:00:00Z",
        content,
        before: { ...content, intended_use: "Earlier intended use" },
        history: [
          {
            action: "submission",
            note: "Private fixture",
            created_at: "2026-11-11T00:00:00Z",
          },
        ],
      },
    ],
  }),
);
assert.ok(html.includes("Classroom books"));
assert.ok(html.includes("Earlier intended use"));
assert.ok(html.includes("Request changes"));
assert.ok(html.includes("review_note"));
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const fontFile = fs
      .readdirSync("node_modules/geist/dist/fonts/geist-sans")
      .find((f) => f.endsWith(".woff2") && f.includes("Regular"));
    const font = fs
      .readFileSync("node_modules/geist/dist/fonts/geist-sans/" + fontFile)
      .toString("base64");
    const css = fs.readFileSync("app/globals.css", "utf8");
    const navigation = brief.brief.en.admin
      .map((label) => `<a href="#">${label}</a>`)
      .join("");
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>@font-face{font-family:FixtureGeist;src:url(data:font/woff2;base64,${font})} :root{--font-geist-sans:FixtureGeist}${css}</style></head><body><main><section class="page section admin"><header class="page-head"><p class="eyebrow">Private component fixture</p><h1>Reviews</h1></header><nav class="tabs">${navigation}</nav>${html}</section></main></body></html>`,
    );
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page
        .locator(".review-workspace")
        .evaluate((el) => getComputedStyle(el).display),
      "grid",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `test-results/agency/review-fixture-${width}.png`,
      fullPage: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(
  "PASS: isolated review workspace, proposed/current values, history, decision controls and responsive layout; no live privileges or mutations",
);

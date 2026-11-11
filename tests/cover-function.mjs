import fs from "node:fs";
import ts from "typescript";
import vm from "node:vm";
import assert from "node:assert/strict";
let handler,
  published = false,
  downloads = 0;
const chain = {
  select() {
    return this;
  },
  eq() {
    return this;
  },
  async limit() {
    return { data: published ? [{ id: "approved" }] : [], error: null };
  },
};
const createClient = (_, key) =>
  key === "public"
    ? { from: () => chain }
    : {
        storage: {
          from: () => ({
            download: async () => {
              downloads++;
              return { data: new Blob(["image-fixture"]), error: null };
            },
          }),
        },
      };
let source = fs
  .readFileSync("supabase/functions/campaign-cover/index.ts", "utf8")
  .replace(/^import .*?;\n/, "");
vm.runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText,
  {
    createClient,
    URL,
    Response,
    Blob,
    Deno: {
      env: {
        get: (key) =>
          key === "SUPABASE_URL"
            ? "https://project.supabase.co"
            : key === "SUPABASE_ANON_KEY"
              ? "public"
              : "service",
      },
      serve: (fn) => (handler = fn),
    },
  },
);
const path =
  "10000000-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000001.webp";
const request = {
  method: "GET",
  url: "https://project.supabase.co/functions/v1/campaign-cover?path=" + path,
};
assert.equal((await handler(request)).status, 404);
assert.equal(downloads, 0);
published = true;
const response = await handler(request);
assert.equal(response.status, 200);
assert.equal(response.headers.get("Content-Type"), "image/webp");
assert.equal(response.headers.get("Cache-Control"), "private, no-store");
assert.equal(downloads, 1);
assert.equal(
  (
    await handler({
      method: "GET",
      url: "https://project.supabase.co/functions/v1/campaign-cover?path=../secret",
    })
  ).status,
  404,
);
console.log(
  "PASS: public cover gate denies unpublished/traversal paths and downloads only after a published snapshot match",
);

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { getLaunchReadiness, canIndexPublicSite } = require('../lib/launch-readiness.ts');
const { processEmailBatch, DeliveryFailure } = require('../lib/email-worker.ts');
const { magicLinkFailure } = require('../lib/auth-errors.ts');
const { checked } = require('../lib/data-errors.ts');

test('public indexing requires all launch configuration and completed QA', () => {
  const env = { NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-key', APP_BACKEND_SECRET: 'private-worker-token', RESEND_API_KEY: 'private-mail-token', RESEND_FROM: 'Platform <support@example.test>', CRON_SECRET: 'private-cron-token', NEXT_PUBLIC_SITE_URL: 'https://example.test', SITE_OPERATOR_NAME: 'Test Operator', SITE_OPERATOR_COUNTRY: 'HT', SITE_SUPPORT_EMAIL: 'support@example.test', SITE_DOCUMENT_RETENTION: 'An owner-supplied retention policy.', LAUNCH_CHECKS_PASSED: 'true', PUBLIC_LAUNCH: 'true' };
  assert.equal(canIndexPublicSite(env), true);
  for (const key of Object.keys(env)) {
    const missing = { ...env, [key]: '' };
    assert.equal(canIndexPublicSite(missing), false, key);
  }
  assert.equal(getLaunchReadiness({ ...env, NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' }).ready, false);
  assert.equal(getLaunchReadiness({ ...env, RESEND_FROM: 'support@example.test\nBcc: attacker@example.test' }).ready, false);
  const report = JSON.stringify(getLaunchReadiness(env));
  assert.doesNotMatch(report, /private-worker-token|private-mail-token|private-cron-token|support@example/);
});

test('magic-link infrastructure failures are visible without disclosing unknown accounts', () => {
  assert.equal(magicLinkFailure({ code: 'user_not_found', status: 400 }), null);
  assert.equal(magicLinkFailure({ code: 'signup_disabled', status: 400 }), null);
  assert.equal(magicLinkFailure({ code: 'unexpected_failure', status: 500 }), 'delivery');
  assert.equal(magicLinkFailure({ code: 'email_address_not_authorized', status: 403 }), 'delivery');
  assert.equal(magicLinkFailure({ status: 429 }), 'rate');
});

test('data failures throw a retryable error and never log provider contents', () => {
  const prior = console.error, logs = [];
  console.error = (...args) => logs.push(args);
  try {
    assert.throws(() => checked({ data: [], error: { code: '503', message: 'private bank details' } }, 'campaign_list'), /temporarily unavailable/);
    assert.doesNotMatch(JSON.stringify(logs), /bank|details/);
    assert.equal(checked({ data: [], error: null }, 'campaign_list').data.length, 0);
  } finally { console.error = prior; }
});

const job = { id: 'job-one', lease_token: 'lease-one', recipient: 'private@example.test', locale: 'en', kind: 'campaign_live', payload: { title: 'Private title' } };
function worker(overrides = {}) {
  const calls = [];
  return { calls, deps: {
    claim: async () => [job], start: async () => { calls.push('start'); }, send: async () => { calls.push('send'); },
    finish: async (_, outcome) => { calls.push(`finish:${outcome}`); }, report: (failure) => { calls.push(failure); }, ...overrides,
  } };
}
test('an accepted email is counted sent only after its acknowledgement succeeds', async () => {
  const w = worker(); const result = await processEmailBatch(w.deps);
  assert.equal(result.sent, 1); assert.equal(result.accepted, 1); assert.equal(result.status, 'ok');
  assert.deepEqual(w.calls, ['start', 'send', 'finish:accepted']);
  const lost = worker({ finish: async () => { throw new Error('private DB value'); } });
  const failure = await processEmailBatch(lost.deps);
  assert.equal(failure.sent, 0); assert.equal(failure.accepted, 1); assert.equal(failure.acknowledgementFailed, 1);
  assert.equal(lost.calls.filter(x => x === 'send').length, 1);
  assert.doesNotMatch(JSON.stringify(failure), /private@example|Private title|private DB/);
});
test('unavailable claims and expired leases never send an email', async () => {
  for (const overrides of [{ claim: async () => { throw new Error('claim failed'); } }, { start: async () => { throw new Error('expired lease'); } }]) {
    const w = worker(overrides); const result = await processEmailBatch(w.deps);
    assert.equal(result.status, 'failed'); assert.equal(w.calls.includes('send'), false); assert.equal(result.sent, 0);
  }
});
test('retryable, permanent, and ambiguous failures retain distinct database outcomes', async () => {
  for (const outcome of ['retryable', 'permanent', 'uncertain']) {
    const w = worker({ send: async () => { throw new DeliveryFailure(outcome, 'provider_http_error', 429); } });
    const result = await processEmailBatch(w.deps);
    assert.ok(w.calls.includes(`finish:${outcome}`)); assert.equal(result.failed, 1); assert.equal(result.sent, 0);
  }
});

test('provider replay responses cannot erase an earlier ambiguous send', async () => {
  const keys = ['APP_BACKEND_SECRET', 'RESEND_API_KEY', 'RESEND_FROM'];
  const prior = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const priorLog = console.error;
  for (const key of keys) process.env[key] = 'test-only-value';
  console.error = () => {};
  try {
    for (const firstUncertain of [true, false]) {
      const calls = [], requests = [];
      const module = { exports: {} };
      const boundaries = {
        'server-only': {},
        '@supabase/supabase-js': { createClient: () => ({ rpc: async (name, args) => {
          calls.push({ name, args });
          return { data: name === 'claim_email_batch_v2' ? [job] : null, error: null };
        } }) },
        './supabase/config': { SUPABASE_KEY: 'public-test', SUPABASE_URL: 'https://database.example.test', supabaseEnabled: true },
        './i18n': { isLocale: () => true, t: () => ({ notif: {}, email: { greeting: 'Hello', open: 'Open', footer: 'Footer' } }) },
        './constants': { SITE_URL: 'https://platform.example.test' },
        './email-worker': { processEmailBatch, DeliveryFailure, unconfiguredEmailRun: () => assert.fail('Unexpected configuration failure') },
      };
      const source = ts.transpileModule(fs.readFileSync(require.resolve('../lib/email.ts'), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      }).outputText;
      const provider = async (_url, options) => {
        requests.push(options.headers['Idempotency-Key']);
        if (firstUncertain && requests.length === 1) throw new Error('Lost provider acknowledgement');
        return { ok: false, status: 429 };
      };
      new Function('require', 'module', 'exports', 'fetch', 'setTimeout', source)(
        name => { assert.ok(Object.hasOwn(boundaries, name), name); return boundaries[name]; },
        module, module.exports, provider, callback => { queueMicrotask(callback); },
      );
      const result = await module.exports.drainOutbox();
      assert.equal(result.sent, 0);
      const finish = calls.find(call => call.name === 'finish_email_result');
      assert.equal(finish.args.outcome, firstUncertain ? 'uncertain' : 'retryable');
      assert.deepEqual(requests, ['fivonine-job-one', 'fivonine-job-one']);
    }
  } finally {
    console.error = priorLog;
    for (const key of keys) {
      if (prior[key] === undefined) delete process.env[key]; else process.env[key] = prior[key];
    }
  }
});

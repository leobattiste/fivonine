const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const name = `fivonine-launch-test-${process.pid}`;
const command = (args, input) => spawnSync('docker', args, { input, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
function sql(source, mayFail = false) {
  const r = command(['exec', '-i', name, 'psql', '-qAt', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1'], source);
  if (r.status && !mayFail) throw new Error(r.stderr);
  return r;
}
function as(role, uid, source, mayFail = false) {
  return sql(`begin; set local role ${role}; set local "request.jwt.claim.sub"='${uid || ''}'; ${source}; commit;`, mayFail);
}
function denied(role, uid, source, pattern = /permission|private|verify|verification|check|confirm|required|another administrator|restricted|only a public/i) {
  const r = as(role, uid, source, true);
  assert.notEqual(r.status, 0, 'Expected the database to reject the operation');
  assert.match(r.stderr, pattern);
}
const O = '11111111-1111-4111-8111-111111111111', A = '22222222-2222-4222-8222-222222222222';
const D = '33333333-3333-4333-8333-333333333333', X = '44444444-4444-4444-8444-444444444444';
const C = '55555555-5555-4555-8555-555555555555';
let checks = 0;
function check(label, fn) { fn(); checks++; console.log(`PASS ${label}`); }
if (process.env.NODE_TEST_CONTEXT) {
  require('node:test').test('database security suite', { skip: 'Run npm run test:security explicitly (requires Docker).' }, () => {});
} else try {
  const launched = command(['run', '--rm', '-d', '--name', name, '-e', 'POSTGRES_PASSWORD=local-test-only', 'postgres:17']);
  if (launched.status) throw new Error(launched.stderr || 'Docker and the postgres:17 image are required.');
  let ready = false;
  for (let i = 0; i < 100; i++) {
    // The image's temporary initialization server only exposes its Unix socket.
    if (command(['exec', name, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres']).status === 0) { ready = true; break; }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
  }
  assert.ok(ready, 'Isolated PostgreSQL startup timed out');
  sql(fs.readFileSync(path.join(__dirname, 'verification-bootstrap.sql'), 'utf8'));
  // Test the existing installation plus every additive upgrade, never a hosted database.
  sql(fs.readFileSync(path.join(root, 'supabase/schema.sql'), 'utf8'));
  const migrations = fs.readdirSync(path.join(root, 'supabase/migrations')).filter(f => f.endsWith('.sql')).sort();
  for (const file of migrations) sql(fs.readFileSync(path.join(root, 'supabase/migrations', file), 'utf8'));
  sql(`insert into auth.users(id,email,raw_user_meta_data) values
    ('${O}','owner@example.test','{"display_name":"Marie Joseph","locale":"ht"}'),
    ('${A}','admin@example.test','{"display_name":"Review Team","locale":"en"}'),
    ('${D}','supporter@example.test','{"display_name":"Supporter","locale":"es"}'),
    ('${X}','other@example.test','{"display_name":"Other Member","locale":"fr"}');
    update public.profiles set role='admin' where id='${A}';
    insert into storage.objects(bucket_id,name,owner,owner_id,metadata) values
      ('documents','${O}/front-identity.webp','${O}','${O}','{"mimetype":"image/webp"}'),
      ('documents','${O}/selfie-identity.webp','${O}','${O}','{"mimetype":"image/webp"}');`);
  as('authenticated', O, `insert into public.campaigns(id,owner_id,slug,title,story,cause,department,beneficiary_name,beneficiary_relation) values
    ('${C}','${O}','verified-test-fundraiser','A local test fundraiser','A clear account of the actual need and how support will be used.','medical','Nord','Marie Joseph','self');
    insert into public.support_methods(campaign_id,method,details) values('${C}','moncash','Marie Joseph +509 3712 0000');`);
  check('unverified submissions and direct publication fail', () => {
    denied('authenticated', O, `update public.campaigns set status='pending' where id='${C}'`);
    denied('authenticated', A, `update public.campaigns set status='live',tier='id_checked' where id='${C}'`);
  });
  as('authenticated', O, `insert into public.campaign_private(campaign_id,contact_name,contact_email,contact_details,id_front_path,selfie_path,consent_at)
    values('${C}','Marie Joseph','owner@example.test','WhatsApp +509 3712 0000','${O}/front-identity.webp','${O}/selfie-identity.webp',now());
    update public.campaigns set status='pending' where id='${C}';`);
  check('private ID documents and verification records are restricted by role', () => {
    assert.equal(as('anon', '', `select count(*) from storage.objects where bucket_id='documents'`).stdout.trim(), '0');
    assert.equal(as('authenticated', X, `select count(*) from storage.objects where bucket_id='documents'`).stdout.trim(), '0');
    assert.equal(as('authenticated', O, `select count(*) from storage.objects where bucket_id='documents'`).stdout.trim(), '2');
    assert.equal(as('authenticated', A, `select count(*) from storage.objects where bucket_id='documents'`).stdout.trim(), '2');
    denied('anon', '', `select * from public.campaign_private`);
    assert.equal(as('authenticated', X, `select count(*) from public.campaign_private`).stdout.trim(), '0');
  });
  check('owners cannot forge attestations and reviewers must confirm both checks', () => {
    as('authenticated', O, `update public.campaign_private set identity_checked_at=now(),identity_checked_by='${A}',recipient_checked_at=now(),recipient_checked_by='${A}' where campaign_id='${C}'`);
    assert.equal(sql(`select count(*) from public.campaign_private where campaign_id='${C}' and identity_checked_at is not null`).stdout.trim(), '0');
    denied('authenticated', A, `select public.review_campaign('${C}','approve','',false,true,'id_checked','{}')`);
    denied('authenticated', A, `select public.review_campaign('${C}','approve','',null,true,'id_checked','{}')`);
    denied('authenticated', A, `select public.review_campaign('${C}','approve','',true,null,'id_checked','{}')`);
    denied('authenticated', O, `select public.review_campaign('${C}','approve','',true,true,'id_checked','{}')`, /admin/i);
  });
  check('reviewed identity and recipient checks publish atomically', () => {
    assert.equal(as('authenticated', A, `select public.review_campaign('${C}','approve','',true,true,'id_checked','{}')`).stdout.trim(), 'ok');
    assert.equal(as('anon', '', `select count(*) from public.campaigns where id='${C}'`).stdout.trim(), '1');
    assert.equal(sql(`select count(*) from public.audit_log where target_id='${C}' and action in ('identity_checked','recipient_checked','campaign_approve')`).stdout.trim(), '3');
  });
  check('restoring a suspended fundraiser also requires explicit verification confirmations', () => {
    as('authenticated', A, `select public.review_campaign('${C}','suspend','Temporary test suspension',false,false,'id_checked','{}')`);
    denied('authenticated', A, `select public.review_campaign('${C}','restore','',null,true,'id_checked','{}')`);
    denied('authenticated', A, `select public.review_campaign('${C}','restore','',true,null,'id_checked','{}')`);
    assert.equal(sql(`select status from public.campaigns where id='${C}'`).stdout.trim(), 'suspended');
    as('authenticated', A, `select public.review_campaign('${C}','restore','',true,true,'id_checked','{}')`);
    assert.equal(as('anon', '', `select status from public.campaigns where id='${C}'`).stdout.trim(), 'live');
  });
  check('proposed recipient edits leave the published version intact until rechecked', () => {
    as('authenticated', O, `insert into public.campaign_changes(campaign_id,author_id,payload) values('${C}','${O}',
      '{"row":{"title":"Updated verified fundraiser","story":"A clear account of the actual need and how support will be used.","cause":"medical","department":"Nord","beneficiary_name":"Marie Joseph","beneficiary_relation":"self","gallery":[],"goal_currency":"HTG","language":"ht"},"methods":[{"method":"moncash","details":"Marie Joseph +509 3712 1111"}]}')`);
    assert.match(as('anon', '', `select details from public.support_methods where campaign_id='${C}'`).stdout, /0000/);
    denied('authenticated', A, `select public.apply_campaign_changes('${C}',true,false)`);
    denied('authenticated', A, `select public.apply_campaign_changes('${C}',null,true)`);
    denied('authenticated', A, `select public.apply_campaign_changes('${C}',true,null)`);
    assert.match(as('anon', '', `select details from public.support_methods where campaign_id='${C}'`).stdout, /0000/);
    as('authenticated', A, `select public.apply_campaign_changes('${C}',true,true)`);
    assert.match(as('anon', '', `select details from public.support_methods where campaign_id='${C}'`).stdout, /1111/);
    assert.equal(as('anon', '', `select status from public.campaigns where id='${C}'`).stdout.trim(), 'live');
  });
  check('supporter amounts stay private while public notes mask anonymous names', () => {
    as('authenticated', D, `insert into public.contributions(campaign_id,user_id,amount,currency,display_name,anonymous,message) values('${C}','${D}',25,'USD','Hidden supporter',true,'Wishing you well')`);
    denied('anon', '', `select amount from public.contributions`);
    assert.equal(as('authenticated', X, `select count(amount) from public.contributions`).stdout.trim(), '0');
    for (const uid of [O, A, D]) assert.equal(as('authenticated', uid, `select count(amount) from public.contributions`).stdout.trim(), '1');
    const notes = JSON.parse(as('anon', '', `select coalesce(jsonb_agg(n),'[]') from public.public_contribution_notes('${C}') n`).stdout.trim());
    assert.equal(notes.length, 1); assert.equal(notes[0].display_name, null); assert.equal(notes[0].message, 'Wishing you well');
    for (const forbidden of ['amount','currency','user_id','method']) assert.equal(Object.hasOwn(notes[0], forbidden), false);
    sql(`update public.contributions set hidden=true`);
    assert.equal(as('anon', '', `select count(*) from public.public_contribution_notes('${C}')`).stdout.trim(), '0');
  });
  check('appeal decisions persist and enqueue a member reply atomically', () => {
    as('authenticated', O, `insert into public.appeals(id,user_id,body) values('66666666-6666-4666-8666-666666666666','${O}','Please review this account decision again.')`);
    as('authenticated', X, `update public.appeals set status='accepted',admin_note='Attempted override' where user_id='${O}'`);
    assert.equal(sql(`select status from public.appeals where user_id='${O}'`).stdout.trim(), 'open');
    as('authenticated', A, `update public.appeals set status='accepted',admin_note='We reviewed your request and restored access.' where id='66666666-6666-4666-8666-666666666666'`);
    assert.equal(as('authenticated', O, `select status from public.appeals where user_id='${O}'`).stdout.trim(), 'accepted');
    assert.equal(sql(`select count(*) from public.notifications where user_id='${O}' and kind='appeal_accepted'`).stdout.trim(), '1');
    assert.equal(sql(`select count(*) from public.email_outbox where kind='appeal_accepted'`).stdout.trim(), '1');
  });
  check('public evidence cannot be removed and changed identity revokes publication', () => {
    denied('authenticated', O, `delete from storage.objects where name='${O}/front-identity.webp'`, /close|evidence/i);
    // No storage UPDATE policy exists, so owners cannot overwrite bytes/metadata or move reviewed paths.
    assert.equal(as('authenticated', O, `update storage.objects set name='${O}/replaced-identity.webp',metadata='{"mimetype":"image/jpeg"}' where name='${O}/front-identity.webp' returning name`).stdout.trim(), '');
    assert.equal(sql(`select metadata->>'mimetype' from storage.objects where name='${O}/front-identity.webp'`).stdout.trim(), 'image/webp');
    as('authenticated', O, `update public.campaign_private set id_front_path=null where campaign_id='${C}'`);
    assert.equal(as('anon', '', `select count(*) from public.campaigns where id='${C}'`).stdout.trim(), '0');
    assert.equal(sql(`select status from public.campaigns where id='${C}'`).stdout.trim(), 'needs_changes');
  });
  check('outbox leases and ambiguous delivery windows fail closed', () => {
    sql(`delete from public.email_outbox; insert into private.backend_credentials(token_hash) values(encode(sha256(convert_to('test-worker','UTF8')),'hex'));
      insert into public.email_outbox(id,recipient,kind) values('77777777-7777-4777-8777-777777777777','recipient@example.test','campaign_live');`);
    denied('anon', '', `select * from public.claim_email_batch_v2('wrong-secret')`, /unauthorized/i);
    const job = JSON.parse(as('anon', '', `select to_jsonb(j) from public.claim_email_batch_v2('test-worker') j`).stdout.trim());
    assert.equal(as('anon', '', `select count(*) from public.claim_email_batch_v2('test-worker')`).stdout.trim(), '0');
    as('anon', '', `select public.start_email_delivery('test-worker','${job.id}','${job.lease_token}')`);
    // Simulate provider acceptance followed by loss of the finish acknowledgement.
    sql(`update public.email_outbox set processing_until=now()-interval '1 second',attempted_at=now()-interval '24 hours' where id='${job.id}'`);
    assert.equal(as('anon', '', `select count(*) from public.claim_email_batch_v2('test-worker')`).stdout.trim(), '0');
    assert.equal(sql(`select last_error from public.email_outbox where id='${job.id}'`).stdout.trim(), 'delivery_uncertain_manual_review');
  });
  check('a rate-limited replay preserves the original ambiguous-delivery cutoff', () => {
    sql(`delete from public.email_outbox;
      insert into public.email_outbox(id,recipient,kind) values('88888888-8888-4888-8888-888888888888','recipient@example.test','campaign_live');`);
    const first = JSON.parse(as('anon', '', `select to_jsonb(j) from public.claim_email_batch_v2('test-worker') j`).stdout.trim());
    as('anon', '', `select public.start_email_delivery('test-worker','${first.id}','${first.lease_token}');
      select public.finish_email_result('test-worker','${first.id}','${first.lease_token}','uncertain','provider_unavailable')`);
    sql(`update public.email_outbox set next_attempt_at=now(),attempted_at=now()-interval '22 hours' where id='${first.id}'`);
    const original = sql(`select attempted_at from public.email_outbox where id='${first.id}'`).stdout.trim();
    const retry = JSON.parse(as('anon', '', `select to_jsonb(j) from public.claim_email_batch_v2('test-worker') j`).stdout.trim());
    as('anon', '', `select public.start_email_delivery('test-worker','${retry.id}','${retry.lease_token}');
      select public.finish_email_result('test-worker','${retry.id}','${retry.lease_token}','retryable','provider_http_error')`);
    assert.equal(sql(`select attempted_at from public.email_outbox where id='${first.id}'`).stdout.trim(), original);
    assert.equal(sql(`select delivery_uncertain from public.email_outbox where id='${first.id}'`).stdout.trim(), 't');
    sql(`update public.email_outbox set next_attempt_at=now(),attempted_at=now()-interval '24 hours' where id='${first.id}'`);
    assert.equal(as('anon', '', `select count(*) from public.claim_email_batch_v2('test-worker')`).stdout.trim(), '0');
    assert.equal(sql(`select last_error from public.email_outbox where id='${first.id}'`).stdout.trim(), 'delivery_uncertain_manual_review');
  });
  check('known test notifications are quarantined without deleting or matching other notices', () => {
    sql(`delete from public.email_outbox;
      insert into public.email_outbox(id,recipient,kind,payload) values
      ('db27c911-35f5-48e7-a10f-8108d434e2b0','recipient@example.test','admin_pending','{"slug":"mksksksk-jtzj"}'),
      ('00fd4cc9-7882-4049-9a04-b754409dad21','recipient@example.test','campaign_live','{"slug":"another-fundraiser"}'),
      ('99999999-9999-4999-8999-999999999999','recipient@example.test','campaign_live','{"slug":"mksksksk-jtzj"}');`);
    const upgrade = migrations.find(file => file.endsWith('_email_delivery_reliability.sql'));
    assert.ok(upgrade);
    sql(fs.readFileSync(path.join(root, 'supabase/migrations', upgrade), 'utf8'));
    assert.equal(sql(`select count(*) from public.email_outbox`).stdout.trim(), '3');
    assert.equal(sql(`select last_error from public.email_outbox where id='db27c911-35f5-48e7-a10f-8108d434e2b0'`).stdout.trim(), 'launch_test_quarantined');
    assert.equal(sql(`select count(*) from public.email_outbox where failed_at is null`).stdout.trim(), '2');
    sql(`update public.email_outbox set payload='{"slug":"mksksksk-jtzj"}' where id='00fd4cc9-7882-4049-9a04-b754409dad21'`);
    sql(fs.readFileSync(path.join(root, 'supabase/migrations', upgrade), 'utf8'));
    const health = JSON.parse(as('anon', '', `select public.email_queue_health('test-worker')`).stdout.trim());
    assert.equal(health.quarantined, 2);
    assert.equal(health.failed, 0);
    assert.equal(health.pending, 1);
  });
  console.log(`${checks} database security/workflow checks passed on isolated PostgreSQL 17.`);
} finally {
  command(['rm', '-f', name]);
}

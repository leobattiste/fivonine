# Public launch runbook

## Release conditions

The launch model is direct supporter-to-organizer transfers. Every organizer must provide private identity evidence, and an administrator other than the organizer must attest to both identity and recipient details before publication. Never publish invented campaigns or backfill verification stamps for test data.

`PUBLIC_LAUNCH` stays false until all readiness checks pass. `LAUNCH_CHECKS_PASSED` is a record of completed operational QA, not a substitute for it. The application keeps robots and page indexing disabled if the sending, operator or verification configuration is incomplete.

## Configuration supplied by the operator

Configure these through Vercel's environment settings; do not paste secret values into issues, chat, documentation or build logs:

- `NEXT_PUBLIC_SITE_URL`: the actual HTTPS production origin.
- Existing Supabase public URL/publishable key and `APP_BACKEND_SECRET` matching the private backend credential hash.
- `RESEND_API_KEY`: scoped sending key on the operator's verified domain; `RESEND_FROM`: matching sender identity. Verify SPF/DKIM and DMARC for that domain.
- `CRON_SECRET`: a random server-only credential used by the scheduled worker and authenticated health details.
- `SITE_OPERATOR_NAME`, `SITE_OPERATOR_COUNTRY`, `SITE_SUPPORT_EMAIL`: the real public operator/contact identity.
- `SITE_DOCUMENT_RETENTION`: the operator's approved, accurate verification-document retention policy. Document who handles deletion requests and enforce the stated policy; do not enter a placeholder just to pass readiness.
- `LAUNCH_CHECKS_PASSED=true` only after the checks below, then `PUBLIC_LAUNCH=true` in production. Keep preview/development indexing disabled.

Supabase Auth email is separate from platform notifications. Configure the canonical Site URL, all four locale callback URLs, custom SMTP and authenticated sending domain. Check the current Supabase password-security advisory and enable leaked-password protection if the project supports it. The application provides password recovery through magic-link sign-in followed by changing the password in Profile.

## Automated evidence

- `npm test`: TypeScript, translation/routing/offline privacy, server-action validation, email-worker failures and controlled form regressions. Network providers are mocked in unit tests.
- `npm run test:security`: isolated Docker PostgreSQL 17 with actual anonymous/member/admin RLS and publication functions, private document access, proposed changes, supporter privacy, appeal delivery and outbox leases. This never connects to a hosted database.
- `npm run test:browser`: local fixture-based desktop/mobile journeys in all four languages. Credentials are stripped and external production endpoints cannot be selected. This does not prove real email delivery, Auth or Storage integration.
- `npm run build`: production compilation and route validation.

## Mandatory live acceptance evidence

Use designated test accounts and consented test documents in a staging project; never use someone else's identity documents. Record the release commit and results, without recording document contents, passwords, email-link tokens or keys.

1. Signup confirmation arrives; valid links return to the correct locale/page; expired links and recovery behave correctly. Provider failures show a retryable message while unknown accounts remain private.
2. An organizer uploads ID/selfie to the private documents bucket. Another member and an anonymous visitor cannot list, read or sign those objects. A path string without a real file cannot pass review.
3. Create, save, resume and submit a fundraiser. No private fields persist in the device draft. Missing evidence/contact/recipient information blocks submission.
4. A different administrator checks the real documents and recipient instructions, approves, and confirms the audit trail. Unverified publication/restore, forged owner stamps and missing rows fail visibly.
5. Propose a recipient change. The old published details remain until explicit re-review. Rejected changes do not replace the public version.
6. Record supporter-reported support, keeping individual amounts private to the donor, organizer and staff. Public notes contain neither amounts nor donor account IDs; anonymous names are masked.
7. Post two updates consecutively. The second has no inherited proof. Failed uploads/posts retain editable content and never report success. Verify report, appeal decision and contact support handling.
8. Confirm notification acceptance and delivery, authenticated cron execution, bounded retry/backoff, no duplicate sends after a lost acknowledgement, and manual handling of uncertain delivery after the idempotency window. Review historical test notifications before enabling delivery.

## Operations and release order

Assign a named reviewer and support backup. Monitor the moderation/report/appeal/contact queues. Public copy promises response times, so confirm staffing before launch. Configure an external uptime/error alert against `/api/health`; a healthy private site returns HTTP 200 with `launchReady:false`. Detailed configuration checks require the cron bearer credential. The cron endpoint returns a failure status for missing configuration or delivery failures.

Verify the actual provider backup schedule and perform a controlled restore drill to a separate environment before setting the QA flag. A local schema test does not establish that production backups are restorable. Have the operator's legal adviser review the real policies, disclosures and retention process; review launch-critical translations with fluent speakers.

Release in stages:

1. Apply the additive verification, outbox and public-notes migrations, in timestamp order. Retain the database's recorded migration versions in the repository.
2. Deploy the tested application, which reads public supporter notes through the safe projection.
3. Apply the restrictive contribution-read migration after the new deployment is serving traffic. This removes old direct public amount access without breaking the old application's rollout window.
4. Check production health, all four locales, private routes, public notes and notification queues. Keep trial campaigns private. Publish genuine campaigns only after the required manual checks.
5. Enable indexing only after every live acceptance condition and owner disclosure is complete, then verify robots, canonical/alternate links and campaign sitemap URLs.

For rollback, keep the additive database changes and mandatory verification gates. An older client cannot approve fundraisers without the new checks. Do not restore public supporter-amount access or fabricate reviewer stamps to make a rollback appear successful. Prefer redeploying a reviewed application build compatible with the new RPCs.

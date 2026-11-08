# Connect fivonine's own Supabase project

The current site deliberately runs in preview mode. Do not connect Pheelm or another application's database. No Supabase data was reset or modified for this build.

1. Create/select a dedicated fivonine project. Review `supabase/schema.sql`, then apply it once through the SQL editor or migrations. It creates new application tables and does not drop existing tables. Resolve any naming conflicts before applying to a nonempty project.
2. Set the Auth site URL to the actual fivonine domain. Allow the exact callback URLs `/ht/auth/callback`, `/fr/auth/callback`, `/en/auth/callback`, plus localhost equivalents for development. Configure transactional SMTP and the sign-in email template. Public browsing does not require authentication.
3. In Vercel, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and server-only `SUPABASE_SERVICE_ROLE_KEY`. The service key is used only for anonymous contact/report writes, rate limiting and the email worker; never expose it through a public variable.
4. Configure Cloudflare Turnstile for the domain. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and server-only `TURNSTILE_SECRET_KEY`. Production login/report/contact fail closed without a working bot check. Set a random `CRON_SECRET` for the protected worker and rate-limit fingerprint salt.
5. Redeploy: public env variables are compiled at build time. Preview examples disappear when database configuration is present; an empty database shows an honest empty directory.
6. Sign in normally, confirm the account, then add the first moderator through trusted SQL: `insert into public.platform_admins(user_id) values ('YOUR_AUTH_USER_UUID');`. Only an authorized operator should do this; the application cannot self-promote users.
7. Verify as two ordinary members, an admin and an anonymous visitor: initial submission, approval, pending edit isolation, update approval, removal, suspension, reporting, private-contact access denial and role escalation denial.

## Transactional notifications

Database actions queue submission/review notifications. To deliver them, verify a sending domain, configure SPF/DKIM/DMARC and set server-only `RESEND_API_KEY` and `RESEND_FROM`. Call `GET /api/cron/email` with `Authorization: Bearer YOUR_CRON_SECRET` from an authorized scheduler. This build does not configure a scheduler or send test email.

The worker leases jobs, uses stable provider idempotency keys, has bounded retries and records failures. Jobs older than 23 hours are not automatically resent because of the provider idempotency window; review them manually. Before activating delivery, finish bounce/complaint suppression, provider webhook verification, alerting and an authorized-recipient delivery test. These messages are transactional, not a newsletter.

## Data model

- `campaigns`: the current approved public snapshot, owner reference and publication state.
- `campaign_revisions`: proposed changes, consent timestamp, policy version and review state. They are private to the owner/admin.
- `organizer_profiles`: private contact details; no anonymous read access.
- `campaign_updates`: publicly readable only after approval while the campaign remains published.
- `reports`, `contact_messages`: server-only writes; admin-only reads.
- `review_events`: internal moderation decisions.
- `email_outbox`, `request_limits`: backend-only queues and abuse controls.
- `campaign_metrics`: aggregate outbound-link count; admin read access, no donor amounts.

Clients cannot directly publish or modify campaign rows. Mutation RPCs check the confirmed organizer/owner or admin role and publish changes transactionally. All tables have RLS. The disposable database test exercises the important role boundaries; it does not replace a live Supabase/browser rehearsal.

## Deliberately excluded

No donor/payment/wallet/payout/bank tables. No document uploads or automatic identity guarantee. Images are authorized HTTPS URLs for this MVP; private document collection is not part of the form.

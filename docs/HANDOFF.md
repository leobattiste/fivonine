# Pote Kole handoff — November 11

## Current state

The owner's latest request supersedes the earlier database-free preview: connect the dedicated fivonine Supabase project, remove placeholders, and use only white, green and very light green. Geist and Hugeicons remain.

- GitHub: `leobattiste/fivonine`; existing main/deployment retained.
- Vercel project: `prj_pxrte4LhRHAQcoS5bANFFtA7K844`, team `team_ACdcW4I1h5M3hwWr8sgxKkRr`.
- Supabase: `jhepbvepnuhavhgpsjwy`, name `fivonine`. The database was empty before this task. Pheelm was not modified.
- Initial schema, server gateway and isolated privileged workflow migrations are applied. Vercel has the API URL, publishable key, and encrypted `APP_BACKEND_SECRET`. No service-role key is used by ordinary website flows.
- No fictional campaigns remain. An empty directory is expected until organizers submit and a moderator approves real campaigns.
- The homepage/directory/category pages read live data on each request. Admin always requires confirmed authentication and an actual admin-table membership.

## Verified

Production build/type checking, three-color palette check, link/content validation, responsive browser suite at 320/390/768/1440, and live Supabase SQL workflow tests (rolled back). Actual Auth password sessions using a temporary QA identity verified browser-to-server-to-database submission, organizer dashboard, role boundary, admin queue, contact creation and private inbox. No auth email or notification was sent. All temporary QA accounts, campaigns, audit records, messages and queued mail were removed after testing.

## Pending owner information

The owner was asked which email should be administrator and whether Supabase Auth Site URL, callback allowlist and SMTP are configured. Do not invent an administrator identity or auto-promote the first registrant. The connector cannot edit Auth settings or retrieve a service-role secret.

Auth configuration: Site URL `https://fivonine.vercel.app`, redirect allowlist `https://fivonine.vercel.app/*/auth/callback`. Email links need real delivery verification once configured. The temporary QA session tests do not establish email delivery.

## Operational details

- `supabase/schema.sql` is the initial fresh-project schema, not a repeatable migration over the live database.
- `supabase/server-gateway.sql` defines the bounded backend actions. Its credential table stores only a token hash. The plaintext token is server-only in Vercel/local ignored environment files.
- `supabase/private-workflows.sql` moves privileged implementations out of the exposed schema. Public wrappers use security invoker; private implementations enforce organizer ownership/admin membership.
- `supabase/fix-rate-limit.sql` fixes an ambiguous conflict target discovered in the live browser rehearsal; the fresh schema already includes the fix.
- Reports/contact/login use a honeypot and persistent server rate limiting; Turnstile is optional. No provider configuration is fabricated.
- Notifications are queued, not delivered: Resend, sender, worker service key and scheduling are not configured. Submission confirmation directs organizers to their dashboard instead of promising email delivery.
- Content and Settings are informational summaries. Organizations lists reviewed organization campaign information. No fake CMS controls exist.
- Search indexing remains governed by `PUBLIC_LAUNCH`; Vercel protection was not changed.

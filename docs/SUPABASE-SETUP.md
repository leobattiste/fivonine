# Connected Supabase configuration

The dedicated `fivonine` project (`jhepbvepnuhavhgpsjwy`) now contains the platform schema. Do not reapply the fresh-project SQL or connect Pheelm.

## Authentication

In Supabase Authentication → URL Configuration, use Site URL `https://fivonine.vercel.app` and redirect URL `https://fivonine.vercel.app/*/auth/callback`. Add exact localhost callbacks only when needed. Configure SMTP for production email delivery; Supabase's default mailer has strict recipient/rate limits. Verify an actual magic-link journey with the owner before claiming delivery works.

A moderator is a confirmed Auth user whose UUID exists in `public.platform_admins`. Assign only the owner's specified identity through trusted administration. There is no first-user promotion.

## Environment

Vercel has `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and encrypted `APP_BACKEND_SECRET`. The token authorizes only bounded message, rate-limit and click operations through `website_action`; its SHA-256 hash is in `private.backend_credentials`. Rotation requires updating that hash and the server environment together, then redeploying. Never expose the token to browser code.

Ordinary functionality needs no service-role key. The optional transactional email worker still requires a server-only service key, sender configuration and an authorized recipient test. Until then, notifications remain in the private outbox and organizers follow status in their dashboard. No marketing emails are sent.

## Data access

Public readers see only published campaigns and approved updates. Organizer contact details and revisions are owner/admin-only. Reports, contact messages and audit history are admin-only. Clients cannot publish directly; moderator decisions require a reason and record an audit event. Privileged implementations live in the non-exposed `private` schema.

Security advisors show no warnings; informational notices for backend-only tables without public RLS policies are intentional default denial. Never add public policies merely to silence those notices.

## Tests

CI creates a disposable database using `tests/bootstrap.sql`, then applies `schema.sql`, `server-gateway.sql` and `private-workflows.sql`. Never use the auth bootstrap on hosted Supabase. Connected browser tests use an explicitly provisioned temporary test identity and private campaigns only; clean up all test records and sessions afterward.

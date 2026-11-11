# Pote Kole

A Haitian fundraising discovery platform. Organizers provide stories, text support instructions, and optional HTTPS links. Payments take place outside this application.

Repository: `leobattiste/fivonine`. Hosting: https://fivonine.vercel.app. Dedicated Supabase project: `jhepbvepnuhavhgpsjwy` (`fivonine`). Do not modify Pheelm.

## Run

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Use the dedicated project's publishable key and API URL. The server-only `APP_BACKEND_SECRET` must match the SHA-256 hash stored in `private.backend_credentials`. Never commit the token or use it in a `NEXT_PUBLIC_` variable. Without database configuration the directory is empty; there are no demo campaigns. Admin access always requires authentication and a `platform_admins` membership.

## Features

- White, green (`#1f503b`), and very light green (`#f0faef`); self-hosted Geist and Hugeicons.
- English, French, and Haitian Creole; remembered language preference; responsive navigation.
- Live directory, keyword/location/category/status search, updated/created sorting, and 12-item pagination.
- Four-step submissions, confirmed-email sign-in, organizer management, reviewed revisions and updates, and removal requests.
- Private moderator workspace with approval queue, reports/contact inbox, audit history and aggregate outbound clicks. Content and Settings summarize the application configuration; they are not a CMS.
- RLS on every application table. Privileged workflows live in a non-exposed schema behind invoker RPCs. Anonymous contact/rate-limit/metrics actions use a bounded server-token gateway rather than a service-role key.
- No sample campaigns or deployment-preview banners. Campaign collections appear on the homepage when published records exist.

## Checks

```sh
npm test
npm run typecheck
npm run build
npm run start -- --port 3040
npm run test:browser
```

The GitHub workflow tests a disposable PostgreSQL instance. `tests/bootstrap.sql` is a local-only auth shim: never run it on Supabase. The optional connected-browser scripts require a deliberately provisioned temporary QA identity, create private test records, and must be followed by cleanup. They never publish campaigns or send email.

Read [docs/HANDOFF.md](docs/HANDOFF.md) and [docs/SUPABASE-SETUP.md](docs/SUPABASE-SETUP.md) for operational configuration and remaining email setup.

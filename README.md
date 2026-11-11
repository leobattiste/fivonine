# Pote Kole

Repository and hosting project: `fivonine`.

Pote Kole is a Haitian community fundraising discovery platform, built from Pheelm's Next.js/Supabase foundation. Organizers publish their story and **text support instructions with HTTPS links**. Pote Kole does not collect, hold, transfer or distribute donations.

## Run

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The default language is Haitian Creole; `/fr` and `/en` are also available.

**Without Supabase configuration, the app runs in explicit preview mode.** Sample campaigns are fictional, contain no donation destinations, and are never inserted into a database. Forms remain visible but cannot submit or claim success. The admin preview shows the dashboard structure without exposing data.

## Included

- Responsive public homepage, search and category/country/region filters, campaign detail pages, sharing and image fallbacks.
- Haitian Creole, French and English interface and informational pages; original campaign-language labeling.
- Text-and-link support instructions; safe external destinations; no payment integrations.
- Email-link organizer authentication and server-side protected organizer/admin actions, ready for Supabase configuration.
- Submission/revision queue, reviewed updates, private organizer contacts, removal requests, reports and moderation audit history.
- Editorial visual design with optimized photography, desktop navigation, accessible mobile dialog, and a four-step submission with review.
- Supabase schema with RLS, atomic publication/review RPCs, private email outbox and aggregate outbound-link metrics.
- Optional Turnstile and transactional email worker; no marketing mail or donor tracking.
- Unit, browser and disposable PostgreSQL role/workflow tests; GitHub Actions checks.

## Setup and continuation

Read **[docs/HANDOFF.md](docs/HANDOFF.md)** first in the next chat, then **[docs/SUPABASE-SETUP.md](docs/SUPABASE-SETUP.md)**. Credentials belong in environment settings, never commits or chat.

The owner requested **GitHub and Vercel only for this handoff**, with Supabase to be connected later. No existing Supabase project was changed. Connecting a project requires applying the schema, configuring auth, adding the environment variables, and rebuilding.

## Checks

```sh
npm test
npm run build
npm run start -- --port 3040
npm run test:browser
```

Browser checks default to `/usr/bin/chromium`; set `CHROMIUM_PATH` if needed. See the GitHub workflow for disposable PostgreSQL checks. `tests/bootstrap.sql` is a **local test shim only** and must never be run on Supabase.

## Before public fundraising launch

Keep `PUBLIC_LAUNCH=false`. Policies and multilingual copy are draft material requiring owner/legal/native-speaker review. Complete live authentication, mail delivery, reporting and authenticated browser verification after Supabase is connected. See the handoff's launch checklist.

## November 11 design direction

Geist is self-hosted through `geist/font/sans`; Hugeicons remain the icon family at 20px. The homepage follows Hero → Categories → Featured → Recent → How it works → Trust → Submit. Explore supports location, category, active/completed status, created/updated sorting, and 12-item pages. The header has three public links and a full-height mobile sheet; language preference is saved in a first-party cookie.

The four-step form is Fundraiser → Story → Organizer → Review. It preserves text support instructions, accepts a checked HTTPS fundraising URL, and requires consent, accuracy, and policy agreement. The fresh-project schema preserves the URL and campaign lifecycle. Do not apply it over an existing database; use the dedicated setup workflow. No live database was modified during this redesign.

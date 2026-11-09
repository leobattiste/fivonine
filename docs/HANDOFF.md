# fivonine — next-chat handoff

## Owner's intent

Replace the old fivonine history website with a Haitian fundraising discovery platform, using Pheelm's reusable Next.js/Supabase and responsive UI foundation. Organizers provide **simple support instructions with optional HTTPS links**; an existing GoFundMe campaign is not required. No money is processed by fivonine.

Latest instruction: **use the existing GitHub and Vercel projects; the owner will set up Supabase later**. Leave Pheelm and Covvvvvers unchanged.

## Repository and deployment

- Repository: https://github.com/leobattiste/fivonine
- Main branch: replacement crowdfunding application.
- Backup branch: `backup/pre-crowdfunding-2026-11-08` at `e2e5a23ed4f14a6e8ef96a6b53d89645cf092c3d`; preserves the previous Haiti-history app.
- Existing Vercel project: `prj_pxrte4LhRHAQcoS5bANFFtA7K844`, team `team_ACdcW4I1h5M3hwWr8sgxKkRr`.
- Existing alias: https://fivonine.vercel.app (may require the owner's Vercel login because project protection is already enabled).
- Local working directory: `/workspace/fivonine` when available; clone the repository in a new environment.
- Pheelm is a separate repository/deployment and was not modified.

## Product implemented

Three-language interface (`ht` default, `fr`, `en`), public landing/explore pages, keyword/category/country/region filtering, campaign details, support instructions, sharing, reporting/contact pages, organizer submission and management, admin revision/update review and moderation, Help/About/How it works and draft policy pages.

The current database-free deployment is explicit **preview mode**. Six preview campaigns with illustrative stock photography are fictional and provide no donation links. Submissions, login, contact/report delivery and real moderation remain disabled until the app's own database is configured. Do not describe this preview as accepting live campaigns.

After setup, the backend supports confirmed-email organizers, atomic submission/revision approval, removal requests, reviewed updates, suspension/archive/feature actions, private reports/contacts, moderation history, aggregate outbound clicks and a transactional email queue. These were tested against disposable PostgreSQL with simulated Supabase roles, not a live Supabase Auth integration.

## Where to work

- `app/[locale]`: localized routes; `layout.tsx` provides locale-specific HTML lang and shared navigation/footer.
- `components/Navigation.tsx`: Desktop navigation, language selection, account links and an accessible native mobile menu dialog.
- `components/Forms.tsx`: four-step submission (story, organizer, support, review), login, report/contact and moderation forms.
- `lib/domain.ts`: content validation and support URL parsing. Text is rendered through React; no raw HTML or payment embeds.
- `lib/data.ts`: preview/live data boundary; never mixes demo campaigns into live results.
- `lib/i18n.ts`, `lib/content.ts`: interface and draft informational translations.
- `app/actions.ts`: server mutations and auth; guards errors rather than claiming success offline.
- `supabase/schema.sql`: clean-project schema/RLS/functions; no destructive reset required.
- `app/api/out`: only redirects to a link currently present in an approved campaign; records an aggregate click when configured.
- `app/api/cron/email`: secret-protected, optional transactional outbox worker.
- `tests/domain.mjs`, `tests/browser.mjs`, `tests/database.sql`: domain, responsive and role/workflow coverage.
- `.github/workflows/checks.yml`: app and disposable database CI jobs.

## Immediate next steps

1. Connect a dedicated Supabase project using `SUPABASE-SETUP.md`; do not repurpose another database without explicit owner direction.
2. Verify live magic-link delivery/callbacks, authenticated browser journeys, admin assignment and report/contact writes. Add browser fixtures against isolated staging.
3. Review Haitian Creole/French copy with fluent speakers. Campaign content is shown in its original language; no claim of automatic reviewed translation is made.
4. Finalize legal/operator/contact details, retention/deletion procedures, eligibility and support-method rules. Policy pages are labeled drafts.
5. Configure sender domain, Turnstile, secrets and an authorized mail test; finish bounce/complaint webhooks and suppression before enabling the worker.
6. Add real, consented, reviewed pilot campaigns. Do not turn illustrative campaign copy into real requests.
7. Finish production monitoring, performance/accessibility measurements, restore/rollback rehearsal and the agreed public-launch indexing policy. Keep `PUBLIC_LAUNCH=false` until those decisions are complete.

## Known MVP limits / expansion backlog

- Goal is organizer-provided; no live amount raised or progress bar. No tax-deductibility assumption.
- Public directory returns a bounded cumulative page of 6 items per Load more link, with a stable created-at/ID order. Improve pagination for a much larger catalog.
- Admin lists show up to 100 records and text search within that batch; add real server pagination as volume grows.
- Outbound click totals are stored but no full analytics dashboard or claim of dollars raised is provided.
- No newsletter, donor accounts, chat, comments, document collection, organization directory or automatic approval.
- No automatic campaign URL fetch/check job, which also avoids introducing an unreviewed server-side URL-fetch/SSRF surface. Link-review indicators require explicit moderator action.
- Sender/bounce operations, browser tests with actual Supabase auth and final policy/translation review need configuration and verification.
- Images use organizer HTTPS URLs and have a reliable visual fallback; uploads/CDN optimization can be added later.

## Validation already completed

Production build and strict TypeScript; domain validation/link safety; responsive browser paths at 320/390/768/1440px; explicit preview guards; 10px menu/panel gap; locale routing; protected email-worker endpoint; invalid outbound destination rejection.

Disposable PostgreSQL 17: schema applies; unpublished campaigns stay private; contacts/revisions do not leak across roles; direct publication and non-admin moderation fail; approval publishes; pending edits do not replace live instructions; approved updates become visible; aggregate clicks increment; suspension hides campaigns and updates.

## Continue prompt

“Continue building fivonine from `docs/HANDOFF.md`. Keep Pheelm and other Supabase projects untouched. The platform publishes fundraising stories and organizer-written text/link support instructions; it never processes donations. First check what infrastructure is configured, then complete the next unfinished setup or pilot task.”

## November 9 editorial redesign

The interface now uses ivory/white surfaces, charcoal text, deep green actions, photographic campaign cards, a conventional desktop header, and an accessible mobile menu. The homepage includes an illustrative community photograph, discovery cards, categories, process explanation and a submission invitation. Campaign pages retain a sticky desktop support panel and provide a mobile jump to support instructions.

Campaign form fields stay mounted across four steps so all values reach the existing server action. Each step validates its inputs, supports back navigation, and shows a final text/link review. Preview submissions remain disabled. Stock photography is optimized locally as WebP and identified in ATTRIBUTION.md; it must never be presented as actual campaign media.

Browser coverage includes 320/390/768/1440px, all three locale layouts, keyboard dismissal/focus return for the mobile menu, discovery/search, campaign disclosures, step navigation and offline guards. A separate isolated DOM fixture exercises form validation and complete FormData retention without a server write. Live authentication, email and database integration still require the original dedicated setup.

## Fundraising platform expansion

The owner requested GoFundMe-style pages and features and explicitly reconfirmed **text instructions and external links only**, with no donation processing or payouts. Original Fivonine copy and branding are retained.

New public routes in all three locales: `/causes`, five `/causes/[category]` pages, `/resources`, six `/resources/[slug]` guides, `/safety`, and `/pricing`. Navigation and footer expose them. A category landing page preselects the category on `/submit?category=...`. The help center supports local topic search and expandable answers. Campaign pages include section navigation, organizer/beneficiary information, social-share drafts, copy-link actions and related campaigns. Organizer dashboards show actual listing counts and published-campaign sharing tools plus guide links.

`lib/platform-content.ts` holds the new localized content. `tests/platform-browser.mjs` verifies the new pages and interactions at 320/390/768/1440px in all three locales. Social sharing is tested through an isolated popup/clipboard fixture; no messages are sent. The test suite preserves preview guards and checks invalid guide/category URLs return 404.

These changes do not connect Supabase, publish real listings, create recipient accounts, verify organizations, or enable email delivery. There are no donor totals, refunds, donation guarantees, on-site payments, or payout flows. Live setup, media uploads, campaign subscriptions, public organization profiles and broader catalog pagination remain separate unfinished work. Read the dedicated setup instructions before any database change; leave other projects untouched.

# Fivonine

Haiti through the decades. A connected history of Haiti and Haitians, organized so that every period is told three ways: inside Haiti, Haitians abroad, and the world acting on Haiti.

Stack: Next.js 15 (App Router) on **Vercel**, **Supabase** (Postgres) for content and subscribers, **Resend** for email.

## What's in it

- **Time scrubber** (home): drag through 1490 to today; the year and nearest documented moment update live. Keyboard accessible.
- **Every period**: Indigenous Ayiti, Conquest, Saint-Domingue, then every decade 1790s to 2020s. Decades without researched entries say so instead of inventing content.
- **Decade pages**: overview, people, threads, year-by-year timeline with dimension and subject filters, legacy, earlier/later navigation.
- **Event pages**: date, place, dimension, evidence status (documented, interpretation, disputed, under investigation), background, consequences, sources, connected moments (graph edges in both directions), JSON-LD.
- **Threads**: connections between decades, drawn as a sequence with the years between each step.
- **Search**: by keyword, year, person, place, subject, period, country. URLs are shareable.
- **Reasons to come back**: on-this-day module, a personal "periods explored" meter (stored on the device), a Sunday email built from upcoming anniversaries.
- **Reasons to share**: native share sheet with WhatsApp, X, Facebook and copy-link fallbacks; a generated share image for every event, decade and thread (`/api/og`).
- SEO: sitemap, robots, per-page metadata.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: runs on bundled content with no keys
npm run dev
```

Without Supabase keys the site reads `lib/content.ts`. Subscriptions return a clear "not configured" message.

## Launch

1. **Supabase**: create a project, open the SQL editor, run `supabase/migrations/0001_fivonine.sql`. Then seed:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
   ```
2. **Resend**: add and verify your sending domain (e.g. `fivonine.com`), create an API key.
3. **Vercel**: import the repo and set the environment variables from `.env.example`. Set `CRON_SECRET` to any long random string. `vercel.json` schedules the Sunday letter at 13:00 UTC.

## Adding history

Edit `lib/content.ts` (or the Supabase tables directly) and re-run `npm run seed`. Each event needs a date and precision, one dimension, categories, a location, a summary, an evidence status and at least one source. Link events with `related` to build the graph; add `people` slugs to connect biographies. Pages revalidate hourly.

Editorial rules built into the product: nothing is invented to fill a decade, every entry is sourced, and anything that is an interpretation, disputed or under investigation is labelled.

## Design system

- Colors: base `#0B2321`, raise `#11302D`, rule `#1F4541`, text `#E7EFEA`, muted `#8DA79F`. Dimensions: mint `#7FE0C2` (inside Haiti), sun `#F4C76A` (Haitians abroad), periwinkle `#A9B5FF` (world acting on Haiti).
- Type: Bricolage Grotesque (variable width, used condensed for numerals) and Newsreader for reading. Both self-hosted via Fontsource.
- One signature motion: the year counts up to 1804 on first load. Respects reduced motion.

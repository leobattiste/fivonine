# Fivonine

A fundraising platform for Haitians. Organizers publish a campaign and the ways they receive support (Western Union, MonCash, a bank account and more). Supporters send money directly. Fivonine never holds or moves funds, and every campaign is reviewed by an admin before it is public.

Hosting: Vercel (`fivonine.vercel.app`). Database, sign-in and file storage: Supabase project `fivonine` (`jhepbvepnuhavhgpsjwy`).

## Run locally

```sh
npm ci
cp .env.example .env.local   # add the Supabase URL and publishable key
npm run dev
```

To preview the design without a database, run with sample data: `FIVONINE_FIXTURES=1 FIVONINE_FIXTURE_USER=admin npm run dev`. Never set these on Vercel.

## What is where

- `app/[locale]/` pages in Kreyòl (`ht`, default), French and English. Menu: Home, Donate, Create campaign, How it works, About. Everything else is in the footer.
- `app/actions.ts` member actions. `app/admin-actions.ts` admin actions (each one writes to the audit log).
- `lib/dict/` all interface text. `lib/constants.ts` support methods and departments.
- `supabase/schema.sql` the full database: tables, row-level security, triggers and storage rules.

## Rules the database enforces

- The public sees only campaigns that are `live` or `completed`. Organizers cannot publish, feature or badge their own campaign.
- Changing a public campaign, including its support details, sends it back to review.
- IDs, selfies, documents and contact details are private to the organizer and admins. Verification files sit in a private storage bucket.
- "I sent it" amounts are self-reported and labelled that way. The reporter's account is never exposed.

## Before launch

1. Sign up on the site, then make that account an admin: `update public.profiles set role='admin' where id='<your user id>';`
2. In Supabase Authentication: set the Site URL, allow `https://<domain>/*/auth/callback`, and add custom SMTP (the built-in mailer only sends a few emails per hour).
3. In Vercel: set `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `RESEND_FROM` and `CRON_SECRET` so notification emails send. `APP_BACKEND_SECRET` is already set.
4. Have a lawyer review Terms, Privacy and the guidelines. Have a native speaker review the Kreyòl and French text.
5. Set `PUBLIC_LAUNCH=true` to let search engines index the site.

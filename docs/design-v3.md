# yon kout men: design v3

What this redesign changes, the rules behind it, and what is left for the next pass.

## Principles

1. **Phone first, data light.** Most visitors are on phones in Haiti, often on slow data. Main actions sit within thumb reach. Fonts are self-hosted (no third-party font CDN, no unused fonts).
2. **Trust before the ask.** Every page that asks for money first shows who reviewed it, who organizes it, and that the money goes straight to the organizer.
3. **One obvious next step.** Each screen has one primary (solid green) action. Everything else is secondary or quiet.
4. **Clients' rules kept.** White foundation, green as the main color, very light green as the accent only. Pill buttons and fields, rounded cards. Full width with 20px edges. Donate cards show only photo, title, category and location.

## Tokens (`app/globals.css`, section 1)

| Token | Value | Use |
| --- | --- | --- |
| `--green-700` | `#1F503B` | Brand, primary actions, links |
| `--green-800/900` | `#17402F` / `#112F23` | Headings, dark bands, footer |
| `--green-200` | `#D4E5D3` | Brand light green, selection accents |
| `--green-50/100` | `#F3F8F2` / `#E6F0E5` | Quiet surfaces |
| `--text` / `--muted` | `#16271F` / `#55675D` | Body / secondary text (AA on white) |
| `--font-display` | Bricolage Grotesque | Headings, numbers, wordmark |
| `--font` | Geist | Interface and reading |
| `--fs-display … --fs-xs` | 80 → 12px, fluid | Type scale |
| `--r` / `--r-sm` / `--r-lg` / `--pill` | 16 / 12 / 24 / 999px | Shapes |
| `--shadow-xs … lg` | | Elevation for cards, sticky bars, dialogs |

Older token names (`--sage`, `--mint`, `--text-title` …) still work and map to the new scale.

## Navigation

- **Phones:** header (logo, language, menu) plus a bottom tab bar: Home · Donate · Start · Saved · Account (`components/TabBar.tsx`). The tab bar hides in focused flows (create, edit, admin, flyer).
- **Desktop:** sticky header with Donate, How it works, About, the account menu and a primary "Start a fundraiser" button.
- The menu drawer holds every page, the account links and the language switch.

## Key screens

- **Home:** search-first hero with two paths (find / start), trust strip, category tiles, featured stories, more fundraisers, "send with what you already use", how giving works, organizer section, safety note.
- **Donate:** search, filters, quick category chips, live result count, 2-column grid on phones.
- **Fundraiser:** title → place and date → organizer → photo → **How to support** (goal, three steps, method cards with copy buttons, "I sent it", WhatsApp share) → Story · Updates · Organizer · Trust. On phones there is a sticky support bar above the tab bar. On desktop the support card sits in a right column, and a compact sticky summary follows the reader once it scrolls away.
- **Create / edit:** same logic. Clearer tabs, a sticky action bar, and the panel framed on desktop.

## Fixes included

- Fundraiser page: the Updates section was nested inside the organizer card, so updates and notes were squeezed into a narrow column on phones.
- Create page: hydration error. Country names differed between the server and the browser, so the list now comes from the server.
- An unused Google font (Ms Madi) was downloaded on every page.

## Copy

New interface text lives in `lib/dict/v3.ts`, in the same shape for English, French, Kreyòl and Spanish. The i18n test checks every language has every key.

## Next pass

1. **Public supporter count.** "14 people said they sent help" is strong social proof. Since contribution reads were restricted, visitors cannot read the count. Add a security-definer function that returns counts only (no amounts), then show it on the fundraiser page.
2. **Real device test** on low-end Android over 3G in Haiti. Check the tab bar against browser chrome and keyboard overlap in the create flow.
3. Native-speaker review of the new Kreyòl and French lines in `lib/dict/v3.ts`.
4. Admin review screens: apply the new table and panel styles more deliberately (they inherit the system today).
5. Cover photos: offer a 4:3 crop for the fundraiser page header while cards keep the square.

# Character Sheet

A personal, Skyrim-styled life XP tracker. Log time spent on real activities
(coding, job search, workouts, cooking, learning, side projects, consistency)
and earn XP toward one of 7 skills, leveling up and unlocking perks along the
way — just like the game.

Single-user app, gated by a shared password (no Supabase Auth / multi-user
complexity).

## Stack

- Next.js (App Router)
- Supabase (Postgres) for persistence, accessed server-side only via the
  service role key
- Netlify for deployment

## Setup

1. Create a Supabase project.
2. In the Supabase SQL editor, run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql),
   then [`0002_rumor_entries.sql`](supabase/migrations/0002_rumor_entries.sql).
   Together these create the `skills`, `xp_events`, `perks`, and
   `rumor_entries` tables, and seed the 7 skills, 21 perks, and an initial
   set of Elder Scrolls 6 rumor-board entries.
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SECRET_KEY` — from Supabase project settings → API.
   - `SITE_PASSWORD` — the password used to enter the app.
   - `AUTH_SECRET` — a random signing secret for the login cookie. Generate one with:
     ```bash
     openssl rand -hex 32
     ```
4. Install dependencies and run the dev server:
   ```bash
   npm install
   npm run dev
   ```

## Rumor Board

`/rumors` is a hand-curated digest of Elder Scrolls 6 news, not a live feed —
there's no cron job or RSS/API integration. To add a new entry once
something surfaces, either insert a row into `rumor_entries` directly in the
Supabase table editor, or ask Claude to check for Elder Scrolls 6 news and
add a verified entry (original summary, real source URL, correct category).

## Ambient audio (optional)

The header has a torch toggle for a looping ambient track, off by default.
See [`public/audio/README.md`](public/audio/README.md) for what file to drop
in — nothing else needs wiring up.

## Tests

Pure XP/leveling logic is covered by Vitest:

```bash
npm test
```

## Deployment

Deploys to Netlify via `netlify.toml` (`@netlify/plugin-nextjs`). Set the same
environment variables from `.env.local` in the Netlify site's build
environment.

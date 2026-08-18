-- Character Sheet v1 schema: skills, xp_events, perks — plus fixed seed data.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).
--
-- Single-user app: there is no Supabase Auth user tied to this data. RLS is
-- enabled with no policies, which denies all access via the anon/publishable
-- key. The app only ever talks to Supabase through a server-only client
-- using SUPABASE_SECRET_KEY (service role), which bypasses RLS.

-- skills ----------------------------------------------------------------

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text not null,
  current_level integer not null default 1,
  current_xp integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.skills enable row level security;

-- xp_events ---------------------------------------------------------------

create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills (id) on delete cascade,
  duration_minutes integer not null check (duration_minutes > 0),
  note text,
  xp_awarded integer not null check (xp_awarded >= 0),
  created_at timestamptz not null default now()
);

create index xp_events_skill_id_created_at_idx
  on public.xp_events (skill_id, created_at desc);

alter table public.xp_events enable row level security;

-- perks -------------------------------------------------------------------

create table public.perks (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills (id) on delete cascade,
  unlock_level integer not null check (unlock_level > 0),
  name text not null,
  description text not null,
  is_unlocked boolean not null default false,
  unique (skill_id, unlock_level)
);

create index perks_skill_id_idx on public.perks (skill_id);

alter table public.perks enable row level security;

-- seed: 7 skills -----------------------------------------------------------

insert into public.skills (slug, name, description) values
  ('smithing', 'Smithing', 'Coding / building projects'),
  ('speech', 'Speech', 'Job search, networking, interviews'),
  ('restoration', 'Restoration', 'Workouts / health'),
  ('alchemy', 'Alchemy', 'Cooking'),
  ('enchanting', 'Enchanting', 'Learning / upskilling'),
  ('sneak', 'Sneak', 'Side projects (quiet, ongoing work)'),
  ('fortitude', 'Fortitude', 'Sleep, stress management, consistency')
on conflict (slug) do nothing;

-- seed: 21 perks (3 per skill) ----------------------------------------------

insert into public.perks (skill_id, unlock_level, name, description)
select s.id, p.unlock_level, p.name, p.description
from (values
  ('smithing', 10, 'Apprentice''s Hand', 'You stopped Googling basic syntax and started trusting your fingers.'),
  ('smithing', 25, 'Journeyman Craftsman', 'You can scaffold a feature end-to-end without losing the thread.'),
  ('smithing', 50, 'Master Smith', 'Your code is clean enough that future-you doesn''t curse past-you.'),

  ('speech', 10, 'Silver Tongue', 'You stopped rehearsing your pitch and started just saying it.'),
  ('speech', 25, 'Persuasive Voice', 'Recruiters remember you after one call.'),
  ('speech', 50, 'Master Negotiator', 'You walk into a comp conversation knowing your number and holding it.'),

  ('restoration', 10, 'Novice Vigor', 'Showing up is no longer the hard part.'),
  ('restoration', 25, 'Adept Endurance', 'The heat slows you down, it doesn''t stop you.'),
  ('restoration', 50, 'Master of Recovery', 'Your body is infrastructure now, not an afterthought.'),

  ('alchemy', 10, 'Apprentice Brewer', 'You cook without a recipe open on your phone.'),
  ('alchemy', 25, 'Skilled Concocter', 'You can improvise a real meal from whatever''s in the fridge.'),
  ('alchemy', 50, 'Master Alchemist', 'People ask you for the recipe. There isn''t one.'),

  ('enchanting', 10, 'Fledgling Scholar', 'You finish what you start reading.'),
  ('enchanting', 25, 'Adept Enchanter', 'New tools stop feeling intimidating within a day.'),
  ('enchanting', 50, 'Archmage of Craft', 'You''re the one explaining it to other people now.'),

  ('sneak', 10, 'Shadow''s Apprentice', 'The side project survives past week two.'),
  ('sneak', 25, 'Silent Operator', 'You ship in the gaps between everything else, and nobody notices the effort it took.'),
  ('sneak', 50, 'Master of Shadows', 'One of these quiet projects becomes the thing that changes everything.'),

  ('fortitude', 10, 'Steady Footing', 'You notice when you''re running on empty, before it wrecks the week.'),
  ('fortitude', 25, 'Unshaken', 'Bad days don''t cascade into bad weeks anymore.'),
  ('fortitude', 50, 'Immovable', 'You''ve built a floor that doesn''t cave, no matter what hits it.')
) as p(skill_slug, unlock_level, name, description)
join public.skills s on s.slug = p.skill_slug
on conflict (skill_id, unlock_level) do nothing;

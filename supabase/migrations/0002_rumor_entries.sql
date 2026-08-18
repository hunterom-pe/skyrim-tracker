-- v1.2: Rumor Board — a manually curated digest of Elder Scrolls 6 news
-- and rumors. NOT a live feed; entries are added by hand (see
-- public/audio/README.md-style instructions in the app README) whenever
-- something new surfaces.
--
-- Seed entries below were verified against multiple independent outlets
-- via web search before being added — summaries are original paraphrase,
-- not copied article text, and every source_url points at the specific
-- article rather than a generic section/tag page.

create type public.rumor_category as enum ('Confirmed', 'Rumor', 'Speculation');

create table public.rumor_entries (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  summary text not null,
  category public.rumor_category not null,
  source_name text not null,
  source_url text not null,
  date_posted date not null,
  date_added timestamptz not null default now()
);

create index rumor_entries_date_posted_idx on public.rumor_entries (date_posted desc);

alter table public.rumor_entries enable row level security;

insert into public.rumor_entries
  (headline, summary, category, source_name, source_url, date_posted)
values
  (
    'Xbox CEO watches live playthrough, calls Elder Scrolls 6''s scale "incredible"',
    'Xbox CEO Asha Sharma visited Bethesda''s Rockville, Maryland studio on August 11, 2026 for a live playthrough of The Elder Scrolls 6. She posted afterward that the game''s scale and grandeur were incredible, and that the story was even greater. The visit came just weeks after Xbox laid off roughly 1,600 workers, and CWA union members protested outside the building with a giant inflatable rat.',
    'Confirmed',
    'VGTimes',
    'https://vgtimes.com/gaming-news/163855-asha-sharma-says-she-played-the-elder-scrolls-vi-and-praises-its-scale.html',
    '2026-08-11'
  ),
  (
    'Sharma''s eight-asterisk tease fuels "Sentinel" subtitle guesses',
    'In her post about the playthrough, Sharma appeared to censor "The Elder Scrolls VI" with exactly eight asterisks — and Bethesda''s own reply echoed the same pattern. Fans zeroed in on eight-letter words that fit Elder Scrolls lore, with "Sentinel" (an existing Hammerfell city/kingdom) the frontrunner theory. Nothing''s confirmed; it''s fan speculation off a social-media tease.',
    'Speculation',
    'VGTimes',
    'https://vgtimes.com/gaming-news/163990-the-elder-scrolls-6-may-have-a-sentinel-subtitle-fans-think.html',
    '2026-08-12'
  ),
  (
    '27-year Bethesda veteran and lead character artist laid off',
    'Christiane Meister, the lead character artist on every Elder Scrolls game since Morrowind (and the artist behind Skyrim''s Khajiit and Argonian redesigns), was laid off as part of a wider round of Xbox/Microsoft cuts affecting more than 50 Bethesda Game Studios staff. She''d been at the studio 27 years; some in the community worry the loss could affect Elder Scrolls 6''s development or morale. Meister says on LinkedIn she''s open to new roles, not retiring.',
    'Confirmed',
    'VGTimes',
    'https://vgtimes.com/gaming-news/160682-bethesda-lays-off-lead-elder-scrolls-character-artist-in-mass-cuts.html',
    '2026-08-05'
  ),
  (
    'Bethesda: Elder Scrolls 6 is now the studio''s primary focus',
    'In a July 17, 2026 update, Bethesda said Elder Scrolls 6 is now its primary development focus, with most of the team on it. Todd Howard said the studio is "where we planned to be, loving how it looks, and playing it every day," but also said there''s no rush to ship it. Still no release date, window, or trailer.',
    'Confirmed',
    'GamesRadar',
    'https://www.gamesradar.com/games/the-elder-scrolls/bethesda-says-the-elder-scrolls-6-is-going-great-actually-were-where-we-planned-to-be-loving-how-it-looks-and-playing-it-every-day/',
    '2026-07-17'
  ),
  (
    'Bloomberg''s Schreier: still at least 2-3 years out',
    'During a Bloomberg Q&A on July 7, 2026, reporter Jason Schreier said Elder Scrolls 6 remains at least two to three years from release, putting a realistic window around 2028-2029 at the earliest. Schreier has a strong track record on Xbox/Bethesda reporting, breaking several major stories during the FTC trial. Bethesda''s own public statements haven''t disputed the timeline, just downplayed the urgency.',
    'Rumor',
    'PC Gamer',
    'https://www.pcgamer.com/elder-scrolls-6-what-we-know/',
    '2026-07-07'
  ),
  (
    'No, there isn''t a second secret Elder Scrolls game',
    'A rumor spread after a former Bethesda associate quest designer''s LinkedIn listed an "unreleased Elder Scrolls title," which some outlets and self-styled "insiders" took as evidence of a second, unannounced game alongside Elder Scrolls 6. The listing turned out to just be a reference to Elder Scrolls 6 itself, and the claim has been debunked. Bethesda leadership has reiterated the studio''s focus remains almost entirely on the one game.',
    'Confirmed',
    'Push Square',
    'https://www.pushsquare.com/news/2026/08/rumours-of-an-unannounced-elder-scrolls-game-have-been-debunked',
    '2026-08-03'
  );

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  has_fide_id boolean default true,
  fide_id text,
  phone text,
  gender text,
  address text,
  name text,
  dob date,
  city_state text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PLAYLISTS TABLE
create table public.playlists (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. VIDEOS TABLE
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  playlist_id uuid references public.playlists(id) on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text not null,
  pgn text, -- For chess game notation
  duration text,
  order_index int default 0, -- To maintain sequence in playlist
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. EVENTS TABLE (Camps and Tournaments)
create table public.events (
  id uuid default gen_random_uuid() primary key,
  type text check (type in ('camp', 'tournament')),
  status text check (status in ('upcoming', 'ongoing', 'past')),
  title text not null,
  description text,
  date date not null,
  location text,
  entry_fee numeric not null default 0,
  thumbnail_url text,
  max_participants int,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. REGISTRATIONS TABLE
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  payment_status text default 'pending',
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, event_id)
);

-- SET UP RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.playlists enable row level security;
alter table public.videos enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;

-- Policies for public viewing
create policy "Anyone can view playlists" on public.playlists for select using (true);
create policy "Anyone can view videos" on public.videos for select using (true);
create policy "Anyone can view events" on public.events for select using (true);

-- Profile policies
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for upsert with check (auth.uid() = id);

-- Registration policies
create policy "Users can view their own registrations" on public.registrations for select using (auth.uid() = user_id);
create policy "Users can register for events" on public.registrations for insert with check (auth.uid() = user_id);

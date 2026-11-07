-- Portfolio enquiries and outreach leads. Run once in the Supabase SQL editor (or `supabase db push`).
-- Row level security is ON for every table and there are NO policies for the anon or authenticated roles,
-- so nothing here is readable or writable from a browser. Only the server (service role key) can use it.

create table if not exists public.contact_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  email        text,
  phone        text,
  service      text check (service is null or service in ('chatbot','automation','website','other')),
  note         text check (note is null or char_length(note) <= 1000),
  source       text not null default 'portfolio',
  page_url     text,
  ip_hash      text,
  status       text not null default 'new' check (status in ('new','replied','spam','archived')),
  notified_at  timestamptz,
  notify_error text,
  constraint contact_needs_a_way_to_reply check (email is not null or phone is not null),
  constraint contact_email_len check (email is null or char_length(email) <= 254),
  constraint contact_phone_len check (phone is null or char_length(phone) <= 20)
);
create index if not exists contact_requests_created_idx on public.contact_requests (created_at desc);
create index if not exists contact_requests_ip_idx on public.contact_requests (ip_hash, created_at desc);

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  business         text not null,
  city             text,
  segment          text,
  website          text,
  contact_email    text,
  contact_whatsapp text,
  contact_form_url text,
  fit_reason       text,
  lead_offer       text check (lead_offer is null or lead_offer in ('chatbot','automation','booking')),
  verified         boolean not null default false,
  source_url       text,
  stage            text not null default 'New'
                     check (stage in ('New','Contacted','Replied','Call booked','Proposal sent','Won','Lost','Opted out')),
  sent_count       int  not null default 0,
  follow_up_count  int  not null default 0,
  follow_up_due    date,
  last_touch       timestamptz,
  opted_out        boolean not null default false,
  notes            text
);
create unique index if not exists leads_website_uniq on public.leads (lower(website)) where website is not null;
create index if not exists leads_stage_idx on public.leads (stage, follow_up_due);

create table if not exists public.job_leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source     text not null,
  title      text not null,
  company    text,
  location   text,
  pay        text,
  posted     date,
  apply_url  text not null,
  score_5    numeric(2,1) check (score_5 between 0 and 5),
  apply      boolean not null default false,
  risk_flags text,
  status     text not null default 'new' check (status in ('new','drafted','applied','replied','interview','won','lost','skipped'))
);
create unique index if not exists job_leads_url_uniq on public.job_leads (apply_url);
create index if not exists job_leads_score_idx on public.job_leads (score_5 desc, posted desc);

create table if not exists public.outreach_events (
  id         uuid primary key default gen_random_uuid(),
  at         timestamptz not null default now(),
  lead_id    uuid references public.leads(id) on delete cascade,
  kind       text not null check (kind in ('first','followup','reply','opt_out','bounce','note')),
  channel    text check (channel is null or channel in ('email','whatsapp','form','linkedin','other')),
  detail     text
);
create index if not exists outreach_events_lead_idx on public.outreach_events (lead_id, at desc);

create table if not exists public.suppression (
  key        text primary key,          -- an email address, a domain, or a website
  reason     text,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create or replace trigger leads_touch before update on public.leads for each row execute function public.touch_updated_at();

alter table public.contact_requests enable row level security;
alter table public.leads            enable row level security;
alter table public.job_leads        enable row level security;
alter table public.outreach_events  enable row level security;
alter table public.suppression      enable row level security;
-- Deliberately no "create policy" statements: the service role bypasses RLS, everyone else gets nothing.

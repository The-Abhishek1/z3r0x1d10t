# Z3r0x1d10t Portfolio — Setup Guide

## Stack
- **Next.js 14** (App Router) — frontend + API routes
- **Supabase** — database, auth, storage, RLS
- **Vercel** — hosting
- **Buy Me a Coffee** — support widget

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `portfolio`, pick a region close to India (Singapore or Mumbai)
3. Go to **SQL Editor** → **New Query**
4. Paste the entire contents of `supabase-schema.sql` and click **Run**
5. This creates all tables, RLS policies, storage bucket, and seeds your data

---

## Step 2 — Get your Supabase credentials

Go to **Settings → API** in your Supabase project:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (keep secret!) |

---

## Step 3 — Local setup

```bash
# Clone or copy this folder
cd portfolio

# Install dependencies
npm install

# Copy env template
cp .env.local.example .env.local

# Fill in your values in .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 4 — Admin panel

1. Go to `http://localhost:3000/admin`
2. Sign in with your email (must match `NEXT_PUBLIC_ADMIN_EMAIL`)
3. First time: Supabase will send a magic link to your email

### What you can edit from admin:
- **Profile** — name, alias, bio, tagline, avatar, resume PDF upload
- **Stats** — add/edit/delete stat cards
- **Badges** — hero section badges (toggle "hot" for glowing ones)
- **Projects** — full CRUD, status, stack, links
- **Timeline** — add milestones, certifications, achievements
- **Writeups** — publish HTB/THM writeups with markdown or external link
- **Cheatsheets** — add/remove cheatsheet cards and entries
- **Contact Links** — update all social/contact links
- **Messages** — inbox for contact form submissions, reply via email

---

## Step 5 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# Project → Settings → Environment Variables
# Add all 5 variables from .env.local
```

Or: push to GitHub → import in [vercel.com](https://vercel.com) → add env vars.

---

## Step 6 — Buy Me a Coffee

1. Create account at [buymeacoffee.com](https://buymeacoffee.com)
2. Get your username (e.g. `abhishekn`)
3. Go to Admin → Profile → update BMC username → Save

---

## Step 7 — Custom domain (optional)

1. Buy domain (e.g. `0xidiot.dev` on Namecheap ~$10/yr)
2. Vercel → Project → Domains → Add domain
3. Follow DNS instructions

---

## File Structure

```
portfolio/
├── app/
│   ├── page.tsx              # Main portfolio (server component)
│   ├── layout.tsx
│   ├── globals.css
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   └── layout.tsx
│   └── api/
│       └── contact/route.ts  # Contact form API
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── ViewCounter.tsx
│   ├── sections/             # All portfolio sections
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── TimelineSection.tsx
│   │   ├── WriteupsSection.tsx
│   │   ├── CheatsheetsSection.tsx
│   │   └── ContactSection.tsx
│   └── admin/                # Admin CRUD editors
│       ├── AdminProfile.tsx
│       ├── AdminStats.tsx
│       ├── AdminBadges.tsx
│       ├── AdminProjects.tsx
│       ├── AdminTimeline.tsx
│       ├── AdminWriteups.tsx
│       ├── AdminCheatsheets.tsx
│       ├── AdminContact.tsx
│       ├── AdminMessages.tsx
│       └── helpers.tsx
├── lib/
│   └── supabase.ts
├── types/
│   └── index.ts
├── supabase-schema.sql       # Run this first in Supabase
├── .env.local.example        # Copy to .env.local and fill in
└── README.md
```

# EveryPart.ie — launch site

Coming-soon landing page + founding seller signup, connected to Supabase.

## One-time setup before deploying

### 1. Add the launch_signups table
In Supabase → SQL Editor → run:

```sql
create table launch_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique not null
);

alter table launch_signups enable row level security;

create policy "Anyone can join launch list"
on launch_signups for insert
with check (true);
```

### 2. Get your Supabase keys
Supabase → Project Settings (gear icon) → API:
- Project URL  → this is NEXT_PUBLIC_SUPABASE_URL
- anon public key → this is NEXT_PUBLIC_SUPABASE_ANON_KEY

### 3. Deploy on Vercel
1. Put this folder in a GitHub repository (upload all files).
2. Vercel → Add New → Project → Import the repo.
3. Before clicking Deploy, open "Environment Variables" and add the two
   values from step 2 with exactly these names:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy. Vercel gives you a live URL like everypart.vercel.app.

### 4. Connect everypart.ie
Vercel → Project → Settings → Domains → add everypart.ie.
Vercel shows DNS records — add them in Blacknight's DNS settings for the
domain. SSL (https padlock) is automatic and free.

## Where signups appear
- Buyer emails → Supabase → Table Editor → launch_signups
- Seller signups → Supabase → Table Editor → sellers

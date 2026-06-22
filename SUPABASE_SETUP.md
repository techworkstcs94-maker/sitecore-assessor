# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (free account).
2. Click **New project**.
3. Choose a name, set a database password, pick a region closest to your users.
4. Wait ~2 minutes for the project to initialise.

## 2. Run the Schema SQL

1. In your project dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Paste the contents of `supabase/schema.sql` into the editor.
4. Click **Run** (or press Ctrl+Enter).

You should see: `Success. No rows returned.`

## 3. Set Environment Variables

Copy `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
RECRUITER_PASSWORD=choose_a_strong_password_here
```

Find these in your Supabase dashboard under **Project Settings → API**:
- `URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

> **Warning:** Never commit `.env.local` to version control. It is already in `.gitignore`.

## 4. Verify Auth Settings

1. Go to **Authentication → Providers**.
2. Ensure **Email** is enabled (it is by default).
3. For the recruiter portal, no Supabase auth is used — authentication is via the `RECRUITER_PASSWORD` env var checked server-side.

## 5. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repository to Vercel:
1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Under **Environment Variables**, add all four variables from step 3.
4. Deploy.

## 6. Share Candidate Links

When a candidate registers, the server logs their unique session URL to the console:

```
[Assessment] New session for Jane Smith <jane@example.com> — token: /session/abc123-...
```

Send candidates their link: `https://your-app.vercel.app/session/<token>`

## 7. Access the Recruiter Dashboard

Navigate to `/recruiter` and enter the password from `RECRUITER_PASSWORD`.

---

## Architecture Notes

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Database | Supabase (Postgres) |
| Auth (recruiter) | Server-side password check (`RECRUITER_PASSWORD`) |
| Editor | Monaco (`@monaco-editor/react`, SSR-disabled) |
| State | Zustand |
| Anti-cheat | Client-side event listeners + server-side logging |
| Test runner | Static code analysis via `new Function()` validators |
| Fonts | Space Grotesk (UI) + JetBrains Mono (code) |
| Deploy | Vercel (Edge + Node runtime) |

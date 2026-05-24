# Habits

A minimalist personal habit tracker. Rate each habit 1–5 every day, browse the
log by day or by habit, and edit your habit set without disturbing past history.
The day rolls over at **5am Eastern**, so late-night sessions still count toward
the previous day.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Deployed on Railway

## Local development

```bash
cp .env.example .env       # then fill DATABASE_URL with a local or hosted Postgres
npm install
npx prisma db push         # creates the schema
npm run dev                # → http://localhost:3000
```

For a quick local Postgres:

```bash
docker run -d --name habits-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
# Then in .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```

## Deploy to Railway

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub**, pick this repo.
3. In the same project: **+ New → Database → PostgreSQL**.
4. On the web service, open **Variables** and add:
   - `DATABASE_URL` = `${{ Postgres.DATABASE_URL }}` (reference the Postgres plugin)
5. Deploy. The start command runs `prisma db push` against your Postgres,
   so the schema is created/updated on every boot.
6. Open the public URL Railway gives you, hit **Habits**, and add what you
   want to track.

Both the app and the database live on Railway — no external service needed.

## Day-rollover semantics

The habit-day boundary is **5am America/New_York**. Anything before 5am still
counts as the previous day's log, so you can finish Tuesday's ratings at 2am
Wednesday and they land on Tuesday.

A day's habit rows are generated lazily the first time you open the app on or
after 5am that day. Once they exist, renaming/adding/removing habits will not
retroactively alter that day's rows — changes apply at the next 5am.

## Rating scale

| Score | Color       | Meaning        |
|-------|-------------|----------------|
| 1     | red         | total failure  |
| 2     | orange      | bad            |
| 3     | yellow      | acceptable     |
| 4     | light green | good           |
| 5     | dark green  | fantastic      |

Tap a rating again to clear it.

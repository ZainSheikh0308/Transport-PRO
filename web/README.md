# TransportPro Web App

Transport business accounting platform with:

- User login (Firebase Auth)
- Daily route records and profit/loss tracking
- Monthly and yearly summaries
- Dashboard analytics with top profitable/loss routes
- Cloud backup to Firebase Storage
- PDF report generation
- WhatsApp report share

## Tech

- Next.js (App Router) + TypeScript + Tailwind
- Firebase Auth + Firestore + Cloud Storage
- Vercel deployment target

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env.local
```

3. Fill Firebase values in `.env.local`:

- Client keys (`NEXT_PUBLIC_FIREBASE_*`)
- Admin service account keys (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)

4. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Core routes

- `/login` and `/signup`
- `/dashboard`
- `/records`
- `/monthly`
- `/yearly`
- `/reports`
- `/settings`

## API routes

- `POST /api/auth/session`
- `POST /api/auth/logout`
- `POST /api/auth/bootstrap`
- `GET/POST/PUT/DELETE /api/records`
- `GET /api/summaries`
- `POST /api/backups/create`
- `GET /api/reports/pdf`
- `GET /api/reports/share`

## Deploy to Vercel

1. Import this project in Vercel.
2. Add all `.env.local` variables to Vercel project settings.
3. Deploy.

## Firestore rules

Use `firestore.rules` and publish it in Firebase console/CLI to enforce tenant isolation.

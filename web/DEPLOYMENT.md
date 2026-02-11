# Deployment Checklist (Vercel + Firebase)

## 1) Firebase setup

- Create Firebase project.
- Enable Authentication (Email/Password).
- Create Firestore database.
- Create Storage bucket.
- Generate service account credentials.

## 2) Environment variables

Set these in Vercel Project Settings -> Environment Variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (with newline escaped as `\\n`)

## 3) Security rules

- Deploy `firestore.rules` to Firebase before production traffic.

## 4) Pre-deploy verification (completed locally)

- `npm run lint` passes.
- `npm run build` passes.
- Route handlers for auth, records, summaries, backups, PDF, and WhatsApp share are available.

## 5) Deploy command

From `web` folder:

```bash
npx vercel --prod
```

If prompted, link this directory to your Vercel project and redeploy.

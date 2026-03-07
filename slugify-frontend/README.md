# Slugify Frontend

Dark minimal Next.js frontend for the Slugify URL shortener.

## Stack
- Next.js 15 + TypeScript
- Tailwind CSS
- Recharts (analytics charts)
- qrcode.react (QR codes)
- react-hot-toast (notifications)

## Pages
- `/` — Landing page
- `/register` — Create account + get API key
- `/login` — Login with API key
- `/dashboard` — Manage links, create new, view QR
- `/analytics/[slug]` — Per-link analytics with chart

## Setup

1. Clone and install:
```bash
npm install
```

2. Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

3. Run dev server:
```bash
npm run dev
```

4. Deploy to Vercel:
- Push to GitHub
- Import on vercel.com
- Add NEXT_PUBLIC_API_URL env variable
- Deploy!

## Auth
This app uses API key auth. Users register, get an API key, and store it in localStorage. Every API call sends the key via `x-api-key` header.

# Verity — Record verification

Verity is a full-stack verification registry. An administrator can create records, manage them from a protected dashboard, open a dedicated QR page, and share a unique public slug link that renders a responsive verification page matching the supplied reference. The Express backend stores records in `server/data/records.json` and manages HTTP-only cookie sessions, so a public link can be opened from another device.

## Start the project

```bash
npm install
cp .env.example .env
npm run dev:full
```

`npm run dev:full` starts the Express API on `http://localhost:3001` and the Vite frontend on `http://localhost:5173`. The Vite development server proxies `/api` requests to Express.

For a production-style run:

```bash
npm run build
npm start
```

Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and optionally `PORT` in `.env`. These credentials are read only by the backend and are not bundled into the browser.

## Main routes

| Route | Purpose |
| --- | --- |
| `/login` | Administrator sign-in |
| `/dashboard` | Protected record management dashboard |
| `/record/:slug` | Responsive public verification page with dynamic details |
| `/record/:slug/qr` | QR page that encodes and links to the public slug page |
| `/api/health` | Backend health check |
| `/api/records/:slug` | Public record lookup used by QR pages |

## Backend API

The backend exposes protected endpoints for listing, creating, and deleting records, plus public lookup by slug. Authentication uses an HTTP-only cookie session. The frontend calls these endpoints through `src/utils/api.js`. The four admin inputs—Account name, Account no, Report date balance, and Report generation date—are sent to the API and rendered dynamically in the matching public cards.

## Deployment note

For a host such as Render or Railway, deploy the repository as one Node service, use `npm run build` as the build command, and `npm start` as the start command. Set the environment variables in the host dashboard. The included JSON file is suitable for a simple single-instance deployment; for multiple instances or hosts with ephemeral disks, replace it with a managed PostgreSQL or other persistent database.

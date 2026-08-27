# Verity — Record verification

Verity is a browser-only verification registry. An administrator can create records, manage them from a protected dashboard, and open a unique public record link containing a printable certificate and QR code. Data is stored in the browser's `localStorage`; no backend or external API is required.

## Start the project

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set the administrator credentials before signing in:

```bash
cp .env.example .env
```

The development server is available at `http://localhost:5173` by default. The production bundle can be checked with `npm run build`, and linting can be run with `npm run lint`.

## Main routes

| Route | Purpose |
| --- | --- |
| `/login` | Administrator sign-in |
| `/dashboard` | Protected record management dashboard |
| `/record/:slug` | Public verified record with QR code |

## Important limitation

Because records and credentials are handled entirely in the browser, this implementation is intended for demonstrations and local workflows. A production system should move authentication, record storage, and authorization to a secure server.

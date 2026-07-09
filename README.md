# AI Forum

AI-powered forum: turn a topic into a discussion post (OpenAI), then like / comment / share it. Full spec in [`PRD.md`](./PRD.md).

- **Frontend** — React 18 + **TypeScript** + Vite, Tailwind (design tokens per PRD §8.2), React Router
- **Backend** — Node (ESM) + Express + Mongoose
- **AI** — OpenAI `gpt-4o-mini` (JSON mode)

## Repository layout

```
backend/    Express + Mongoose API   (JavaScript, ESM)
frontend/   React SPA                (TypeScript)
PRD.md      Product requirements
```

## Prerequisites

- Node.js ≥ 18 (repo built on Node 24)
- MongoDB — a **MongoDB Atlas** cluster (set its URI in `backend/.env`), or a local `mongod`. (MongoDB Compass is only a GUI client, not a server.)
- An OpenAI API key (only needed once AI generation lands in M2)

## Setup & run

### 1. MongoDB

Point `MONGODB_URI` in `backend/.env` at your cluster. For Atlas, include the db name:
`mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/ai-forum`

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env          # then edit OPENAI_API_KEY / MONGODB_URI
npm run seed                  # idempotently create the Default User
npm run dev                   # http://localhost:5000
```

Health check: `curl http://localhost:5000/api/health` →
`{ "success": true, "data": { "status": "ok", "db": "connected", ... } }`

> **macOS port 5000:** AirPlay Receiver binds `:5000`. If you hit `EADDRINUSE`, disable it (System Settings → General → AirDrop & Handoff → AirPlay Receiver) or set a different `PORT` in `backend/.env` (and update the Vite proxy target in `frontend/vite.config.ts`).

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE_URL (defaults to /api via vite proxy)
npm run dev                   # http://localhost:5173
```

The dev server proxies `/api` → `http://localhost:5000`, so no CORS setup is needed in development.

## Environment variables

**backend/.env** — `PORT`, `MONGODB_URI`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `CORS_ORIGIN`, `AI_TIMEOUT_MS`
**frontend/.env** — `VITE_API_BASE_URL`

Secrets live only in `.env` (git-ignored); never committed or shipped to the client bundle.

## Milestones

| | Milestone | Status |
|---|---|---|
| **M0** | Scaffolding — workspaces, design tokens, DB connect, `/api/health`, CORS, seed user | ✅ done |
| M1 | Data layer & core read APIs (`GET /posts`, `GET /posts/:id`) | ⏳ next |
| M2 | AI generation (`POST /posts/generate`) | ⏳ |
| M3 | Frontend feed + generation UI | ⏳ |
| M4 | Interactions — like / comment / share | ⏳ |
| M5 | Post detail page + responsive polish | ⏳ |

## Scripts

**backend:** `npm run dev` (watch) · `npm start` · `npm run seed` · `npm run format` · `npm run format:check`
**frontend:** `npm run dev` · `npm run build` · `npm run preview` · `npm run lint` (tsc) · `npm run typecheck` · `npm run format` · `npm run format:check`

## Continuous integration

GitHub Actions ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs on every push and pull request to `main`:

| Job | Checks |
|---|---|
| **backend** | `npm ci` → Prettier `format:check` |
| **frontend** | `npm ci` → Prettier `format:check` → `tsc` typecheck |

Code style is enforced by **Prettier** (config in each package's `.prettierrc.json`). Run `npm run format` before committing to auto-fix formatting.

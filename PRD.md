# Product Requirements Document — AI Forum

**Product:** AI-Powered Forum (AI post generation + like / comment / share)
**Document type:** Developer-ready PRD
**Owner:** Product / Architecture
**Status:** Ready for implementation
**Target build time:** 4–8 hours (interview assessment scope)
**Version:** 1.0

---

## 1. Project Overview

AI Forum is a lightweight web application that lets a user turn a **topic** into a fully-formed **forum discussion post** using a free AI provider (Google Gemini). The generated post is persisted and rendered in a chronological forum feed where users can **like**, **comment**, and **share** each post. Every post also has a dedicated shareable detail page.

The product deliberately avoids authentication, profiles, moderation, and other enterprise features. A single **seeded default user** acts as the author/actor for all writes. The emphasis is on a clean end-to-end vertical slice: input → AI generation → persistence → feed → interaction.

The visual design follows the **"Executive Intelligence Interface"** design system supplied in `stitch_clean_forum_post_generator/` (see §8.2). The look is minimal, corporate, high-density, and content-first: light-gray canvas, white bordered cards, Geist typography, an 8px grid, and near-black/slate-navy primary actions.

### 1.1 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, React Router |
| Backend | Node.js (LTS) + Express.js |
| Database | MongoDB + Mongoose |
| AI Provider | **OpenAI** via `openai` SDK — model `gpt-4o-mini` (JSON mode) |
| HTTP client | `axios` (frontend) |
| Validation | `express-validator` (backend) |
| Rate limiting | `express-rate-limit` (optional but recommended) |

> OpenAI is the reference implementation. Swapping providers should only touch `services/aiService.js` (§9).

### 1.2 Out of Scope (Do NOT build)

Authentication / login, user profiles, admin panel, notifications, real-time/WebSockets, pagination, infinite scroll, nested reply threading beyond one visual level, moderation, and any multi-user identity system.

---

## 2. Goals

### 2.1 Product Goals
- **G1** — A user can generate a realistic, discussion-starter forum post from a plain-text topic in a single click.
- **G2** — Generated posts persist and appear at the top of a newest-first feed.
- **G3** — A user can like, comment on, and share any post.
- **G4** — Every post is individually addressable via a unique shareable URL (`/posts/:id`).
- **G5** — The UI is responsive, gives clear loading/error feedback, and matches the supplied design system.

### 2.2 Engineering Goals
- **EG1** — Clean separation of concerns (routes → controllers → services → models).
- **EG2** — Reusable, composable React components.
- **EG3** — All input validated server-side; secrets never exposed to the client.
- **EG4** — Graceful degradation on AI / DB / network failure with user-friendly messages.

### 2.3 Non-Goals
- Not optimizing for scale, high concurrency, or SEO.
- Not building a general-purpose CMS or multi-tenant system.

### 2.4 Success Metrics (assessment rubric)
- End-to-end generate → feed flow works without errors.
- All four interactions (generate, like, comment, share) function.
- Code is organized, readable, and matches the specified folder structure.
- Error and loading states are visibly handled.

---

## 3. User Stories

All stories use the single seeded **Default User** as the actor.

| ID | As a… | I want to… | So that… | Priority |
|---|---|---|---|---|
| US-1 | user | enter a topic and click Generate | I get an AI-written forum post | Must |
| US-2 | user | see a loading indicator while the AI works | I know the request is in progress | Must |
| US-3 | user | see the new post appear at the top of the feed | I can read what was created | Must |
| US-4 | user | browse all posts newest-first | I can catch up on discussions | Must |
| US-5 | user | like a post | I can signal agreement | Must |
| US-6 | user | comment on a post | I can join the discussion | Must |
| US-7 | user | view all comments on a post | I can read the conversation | Must |
| US-8 | user | share a post via a unique link | others can open that exact post | Must |
| US-9 | user | open a post's detail page | I can read the full content and all comments | Must |
| US-10 | user | see a friendly error and retry option | I recover when the AI or network fails | Must |
| US-11 | user | see an empty-state message | I understand there are no posts/comments yet | Should |
| US-12 | user | be prevented from liking the same post twice in a session | likes aren't trivially inflated | Could (optional) |

---

## 4. Functional Requirements

### 4.1 AI Post Generation (US-1, US-2, US-3)
- **FR-1.1** — Home page exposes a topic text input and a Generate button (the "Start a Discussion" card).
- **FR-1.2** — On Generate, the frontend sends `POST /api/posts/generate` with `{ topic }`.
- **FR-1.3** — Backend validates the topic (§12.1) before any AI call.
- **FR-1.4** — Backend calls Gemini with a prompt engineered to return a **title** and a **forum-style body** (§9.3).
- **FR-1.5** — Backend parses the AI response into `{ title, content }`, validates non-empty (§12.2–12.3), and persists a `Post` authored by the Default User.
- **FR-1.6** — Backend returns the created post (`201 Created`).
- **FR-1.7** — Frontend prepends the new post to the feed without a full page reload.
- **FR-1.8** — While generating, the Generate button is disabled and a skeleton/loader ("Generating post…") is shown at the top of the feed.
- **FR-1.9** — The generated post must read like a discussion starter (opinionated, question-raising tone), not a generic encyclopedia paragraph — enforced via the prompt.

### 4.2 Forum Feed (US-4)
- **FR-2.1** — The Home page renders all posts sorted by `createdAt` descending.
- **FR-2.2** — Each feed `PostCard` shows: title, 3-line content preview, author name + avatar, relative created date, like count, comment count, and a share action.
- **FR-2.3** — Clicking a card title (or "read more") navigates to `/posts/:id`.
- **FR-2.4** — When there are no posts, render an `EmptyState`.

### 4.3 Likes (US-5, US-12)
- **FR-3.1** — Each post shows a like/upvote control with the current count.
- **FR-3.2** — Clicking it sends `PATCH /api/posts/:id/like`; backend increments `likeCount` atomically and returns the updated value.
- **FR-3.3** — The UI updates optimistically and reconciles with the server response.
- **FR-3.4** *(optional)* — Client-side session guard (e.g. a `Set` of liked post IDs in state or `localStorage`) prevents a second like in the same session; the control renders as "liked".

### 4.4 Comments (US-6, US-7)
- **FR-4.1** — The Post Detail page (and inline preview on cards) shows all comments for the post, newest-first or oldest-first (pick one; oldest-first reads more naturally for threads).
- **FR-4.2** — A `CommentForm` lets the user submit `{ text }`; author defaults to the Default User.
- **FR-4.3** — Submitting sends `POST /api/posts/:id/comments`; on `201` the comment is appended to the list and the comment count updates.
- **FR-4.4** — Each comment shows author name + avatar, text, and relative created date.
- **FR-4.5** — When a post has no comments, render an `EmptyState` inside the comment section.

### 4.5 Sharing (US-8)
- **FR-5.1** — Each post has a share control.
- **FR-5.2** — On click: if `navigator.share` exists (mobile), invoke the native share sheet with the post URL; otherwise copy `https://<host>/posts/:id` to the clipboard via `navigator.clipboard.writeText`.
- **FR-5.3** — Show a `ToastNotification`: "Link copied to clipboard."
- **FR-5.4** — Share requires **no** backend write. `PATCH /api/posts/:id/share` is out of scope unless share-count tracking is explicitly added later.

### 4.6 Post Detail Page (US-9)
- **FR-6.1** — Route `/posts/:id` fetches a single post + its comments via `GET /api/posts/:id`.
- **FR-6.2** — Renders full title, full content, author, date, like button, share button, comment list, and comment form.
- **FR-6.3** — If the ID is invalid or not found, render a not-found state (not a crash).

---

## 5. Non-Functional Requirements

- **NFR-1 Clean code** — Separation of concerns; consistent naming; no duplicated logic; UI, business logic, and data access isolated.
- **NFR-1a Minimal comments** — Write self-documenting code; keep comments sparse. Only comment non-obvious intent (a tricky regex, a business rule, a workaround). No redundant line-by-line narration, no commented-out code, no JSDoc boilerplate on trivial functions. Clear names > comments.
- **NFR-2 Responsive UI** — Mobile-first. 12-col desktop (max 1200px), reduced margins on tablet, single-column stack on mobile (feed sidebar collapses/hides below the main column).
- **NFR-3 Loading states** — Loader during AI generation and data fetches; buttons disabled during in-flight requests.
- **NFR-4 Error messages** — User-friendly, no stack traces leaked; retry guidance where relevant.
- **NFR-5 Reusable components** — Shared Button, Card, Loader, Input, Avatar, Toast.
- **NFR-6 Environment variables** — API key, Mongo URI, port, and frontend API base URL all via env (§9.5).
- **NFR-7 Security basics** — Server-side validation on all inputs; sanitize user-generated text; CORS restricted to the frontend origin; body-size limit; no secrets in the client bundle.
- **NFR-8 Rate limiting** *(optional/recommended)* — Throttle `POST /api/posts/generate` to protect the free AI quota and prevent abuse.
- **NFR-9 Accessibility** — Semantic HTML, focus states (per design: 1px primary border + 2px soft glow), keyboard-usable buttons, alt text on avatars.
- **NFR-10 Performance** — Feed query returns comment counts efficiently (denormalized `commentCount` on the post, see §6).

---

## 6. Database Schema

MongoDB via Mongoose. Three collections. A **seed script** creates the Default User on first run.

### 6.1 User
```js
// models/User.js
{
  _id: ObjectId,
  name:   { type: String, required: true, trim: true, maxlength: 60 },
  email:  { type: String, required: true, lowercase: true, trim: true },
  avatar: { type: String, default: null }, // URL or null
  createdAt: Date, // timestamps: true
  updatedAt: Date
}
```
- Seeded record: `{ name: "Default User", email: "default@aiforum.local", avatar: null }`.
- No authentication. All writes reference this user's `_id`.

### 6.2 Post
```js
// models/Post.js
{
  _id: ObjectId,
  title:   { type: String, required: true, trim: true, maxlength: 120 },
  content: { type: String, required: true, trim: true, minlength: 50, maxlength: 2000 },
  author:  { type: ObjectId, ref: "User", required: true },
  topic:   { type: String, trim: true, maxlength: 100 }, // original prompt topic (nice for context)
  likeCount:    { type: Number, default: 0, min: 0 },
  commentCount: { type: Number, default: 0, min: 0 }, // denormalized for feed performance
  createdAt: Date,
  updatedAt: Date
}
```
- **Shareable identifier:** the MongoDB `_id`. The share URL is derived on the client as `${FRONTEND_BASE_URL}/posts/${_id}` — no separate `shareUrl` field stored.
- Index: `{ createdAt: -1 }` for the newest-first feed.

### 6.3 Comment
```js
// models/Comment.js
{
  _id: ObjectId,
  postId: { type: ObjectId, ref: "Post", required: true, index: true },
  author: { type: ObjectId, ref: "User", required: true },
  text:   { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
  createdAt: Date,
  updatedAt: Date
}
```
- On comment create, increment the parent post's `commentCount` (`$inc`) in the same request flow.
- On feed/detail fetch, `commentCount` is read directly (no aggregation needed).

### 6.4 Relationships
```
User (1) ────< (N) Post ────< (N) Comment
   └──────────────< (N) Comment (as author)
```

---

## 7. API Specification

Base URL: `/api`. All responses use a consistent envelope:

```jsonc
// success
{ "success": true, "data": <object|array> }
// error
{ "success": false, "message": "<human message>", "errors": [ /* optional field errors */ ] }
```

### 7.1 Endpoint Summary

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | `/api/posts` | List all posts, newest-first | 200 |
| GET | `/api/posts/:id` | One post + its comments | 200 |
| POST | `/api/posts/generate` | Generate + save a post from a topic | 201 |
| PATCH | `/api/posts/:id/like` | Increment like count | 200 |
| GET | `/api/posts/:id/comments` | List comments for a post | 200 |
| POST | `/api/posts/:id/comments` | Create a comment | 201 |
| GET | `/api/health` | Liveness check | 200 |

> `PATCH /api/posts/:id/share` is intentionally omitted (share is client-only). Add only if share-count tracking becomes a requirement.

---

### 7.2 GET `/api/posts`
Fetch all posts, `createdAt` descending, author populated with `name` + `avatar`.

**Response — 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f3a123abc456def7890123",
      "title": "Why Artificial Intelligence Is Reshaping Everyday Work",
      "content": "Artificial intelligence is no longer a futuristic concept...",
      "author": { "_id": "64f3a111abc456def7890001", "name": "Default User", "avatar": null },
      "likeCount": 4,
      "commentCount": 2,
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### 7.3 GET `/api/posts/:id`
Fetch a single post with its comments (author populated). Used by shareable detail URLs.

**Response — 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "64f3a123abc456def7890123",
    "title": "Why Artificial Intelligence Is Reshaping Everyday Work",
    "content": "Artificial intelligence is no longer a futuristic concept...",
    "author": { "_id": "64f3a111abc456def7890001", "name": "Default User", "avatar": null },
    "likeCount": 4,
    "commentCount": 2,
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z",
    "comments": [
      {
        "_id": "64f3a999abc456def7890999",
        "author": { "_id": "64f3a111abc456def7890001", "name": "Default User", "avatar": null },
        "text": "Great post, I agree with this point.",
        "createdAt": "2025-01-01T10:05:00.000Z"
      }
    ]
  }
}
```
**Errors:** `400` invalid ObjectId · `404` not found.

---

### 7.4 POST `/api/posts/generate`
Generate a post from a topic via the AI provider, then persist it.

**Request body**
```json
{ "topic": "Artificial Intelligence" }
```

**Flow:** validate topic → call OpenAI → parse `{title, content}` → validate non-empty/length → save `Post` (author = Default User) → return created post.

**Response — 201 Created**
```json
{
  "success": true,
  "data": {
    "_id": "64f3a123abc456def7890123",
    "title": "Why Artificial Intelligence Is Reshaping Everyday Work",
    "content": "Artificial intelligence is no longer a futuristic concept...",
    "author": { "_id": "64f3a111abc456def7890001", "name": "Default User" },
    "likeCount": 0,
    "commentCount": 0,
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}
```
**Errors:** `400` validation (empty/short/long topic) · `502` AI provider failure/timeout · `500` unexpected · `429` rate limit (if enabled).

---

### 7.5 PATCH `/api/posts/:id/like`
Atomically increment `likeCount`.

**Response — 200 OK**
```json
{ "success": true, "data": { "_id": "64f3a123abc456def7890123", "likeCount": 5 } }
```
**Errors:** `400` invalid ID · `404` not found.

---

### 7.6 GET `/api/posts/:id/comments`
List comments for a post (author populated), oldest-first.

**Response — 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f3a999abc456def7890999",
      "postId": "64f3a123abc456def7890123",
      "author": { "_id": "64f3a111abc456def7890001", "name": "Default User" },
      "text": "Great post, I agree with this point.",
      "createdAt": "2025-01-01T10:05:00.000Z"
    }
  ]
}
```

---

### 7.7 POST `/api/posts/:id/comments`
Create a comment (author defaults to Default User) and increment the post's `commentCount`.

**Request body**
```json
{ "text": "Great post, I agree with this point." }
```
> `author` is not required from the client in this assessment; the backend attaches the Default User. If sent, it is ignored/overridden server-side.

**Response — 201 Created**
```json
{
  "success": true,
  "data": {
    "_id": "64f3a999abc456def7890999",
    "postId": "64f3a123abc456def7890123",
    "author": { "_id": "64f3a111abc456def7890001", "name": "Default User" },
    "text": "Great post, I agree with this point.",
    "createdAt": "2025-01-01T10:05:00.000Z"
  }
}
```
**Errors:** `400` empty/too-long text or invalid post ID · `404` post not found.

---

### 7.8 HTTP Status Codes

| Code | When |
|---|---|
| 200 OK | Successful fetch or update (list, get, like, comments list) |
| 201 Created | Post or comment created |
| 400 Bad Request | Validation failure / malformed ObjectId |
| 404 Not Found | Post or comment not found |
| 429 Too Many Requests | Rate limit exceeded (if enabled) |
| 500 Internal Server Error | Unexpected server / DB failure |
| 502 Bad Gateway | AI provider upstream failure |

### 7.9 Validation Error Shape
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [ { "field": "topic", "message": "Topic cannot be empty" } ]
}
```

---

## 8. Frontend Architecture

### 8.1 Overview
React 18 + Vite SPA. React Router with two routes. Tailwind for styling, configured with the design tokens in §8.2. Data access isolated in `services/` (axios); UI/data state in custom `hooks/`; ephemeral global state (toast, default user) in `context/`.

**Routes**
| Path | Page | Purpose |
|---|---|---|
| `/` | `HomePage` | Topic form + feed (+ sidebar) |
| `/posts/:id` | `PostDetailPage` | Full post + comments + actions |
| `*` | `NotFoundPage` | Fallback |

**State strategy**
- Feed list, generation status, and toast live in React state / lightweight context.
- On successful generate, prepend to the in-memory feed (no refetch).
- Optimistic updates for like and comment, reconciled with server responses.
- No Redux; `useState` + `useContext` + custom hooks are sufficient at this scope.

### 8.2 Design System — "Executive Intelligence Interface"
Source: `stitch_clean_forum_post_generator/DESIGN.md` + `screen.png`. Encode these into `tailwind.config.js` (`theme.extend`) and reference the screenshot for layout.

**Brand:** minimal, corporate/modern, high-density, content-first. Depth via tonal layers + 1px outlines, not heavy shadows.

**Color tokens**
| Token | Value | Use |
|---|---|---|
| `primary` | `#0F172A` (near-black slate navy; buttons render ~black) | Primary buttons, headings, high-emphasis text |
| `on-primary` | `#FFFFFF` | Text on primary |
| `secondary` | `#64748B` | Metadata, icons, secondary text |
| `background` | `#F8FAFC` | App canvas |
| `surface` (card) | `#FFFFFF` | Cards / posts |
| `border` | `#E2E8F0` | 1px card & input borders, thread lines |
| `error` | `#BA1A1A` | Validation / error states |
| `on-surface` | `#191C1E` | Body text |
| `on-surface-variant` | `#45464D` | Muted body text |

**Typography:** **Geist** (self-host or Google Fonts). Scale: H1 36/44 700 (mobile 28/34), H2 24/32 600, H3 20/28 600 (post titles), body-lg 18/28, body-md 16/24, body-sm 14/20 (comments, previews), label-md 14/20 600 (action buttons), caption 12/16 500 (timestamps, chips). Headlines use tight tracking (−0.01 to −0.02em); body line-height ~1.5.

**Spacing & grid:** strict **8px grid**. Card padding `16px`; vertical gap between posts `24px`; tight icon↔label `4px`. 12-col fluid grid, max container `1200px`, gutter `24px`. Tablet margins `24px`; mobile single column, `16px` side margins.

**Radius:** components/buttons/inputs/cards `8px` (`rounded-lg`); large containers/modals `16px`; chips/tags fully rounded (pill); checkboxes `4px`.

**Elevation:**
- L0 background `#F8FAFC`.
- L1 cards: white + 1px `#E2E8F0` border, **no shadow**.
- L2 card hover: `0 4px 12px rgba(15,23,42,0.05)`.
- L3 modal/popover/toast: `0 10px 25px rgba(15,23,42,0.10)`.

**Component specs (from design):**
- **Navbar** — 64px tall, white, 1px bottom border. Logo "AI Forum" left; centered search input (max-width 400px, decorative/Future — see §16); code-view toggle + user avatar right.
- **Post card** — white, 1px border, 8px radius. H3 title, 3-line body-sm preview (clamp to 3 lines), footer row: avatar + author + `•` + relative time + category chip (pill), right-aligned actions: upvote (arrow + count), comment (icon + count), share (icon). Hover → L2 shadow.
- **Inline comment (card + detail)** — 24px left indent per nesting level (max one level here); 2px vertical thread line `#E2E8F0`; body-sm text; author `AUTHOR` badge when the commenter is the post author.
- **Form input** — 1px `#E2E8F0` border, 8px radius, body-md; focus = 1px primary border + 2px soft primary glow at 10% opacity; label-md label above.
- **Buttons** — Primary: primary bg, white text (the black "✦ Generate" button). Secondary: white bg, 1px border, primary text. Heights: standard 40px, small 32px.
- **Sidebar (design extra)** — "Trending Topics" and "Forum Rules" cards. **Static/hardcoded**, not backed by the API. Optional; hide on mobile.

> **Like vs. Upvote:** the design renders the like action as an **upvote arrow + count**. Keep the domain/API terminology (`likeCount`, `/like`) but style the control as the upvote per the design.

### 8.3 Data Fetching Hooks
- `usePosts()` — fetch feed, expose `posts`, `loading`, `error`, `refetch`, `prependPost`.
- `usePost(id)` — fetch single post + comments.
- `useGeneratePost()` — POST generate, expose `generate(topic)`, `isGenerating`, `error`.
- `useLike(postId)` — optimistic like with session guard.
- `useComments(postId)` — list + `addComment(text)`.

---

## 9. Backend Architecture

### 9.1 Overview
Express app with layered structure: **routes → middleware (validation) → controllers → services → models**. Controllers are thin (parse req, call service, shape response); services hold business/AI logic; models are Mongoose schemas. A centralized error-handling middleware converts thrown errors into the standard envelope.

### 9.2 Request Lifecycle
```
Client → CORS → body parser (size-limited) → rate limiter (generate only)
      → router → validation middleware → controller → service → model → MongoDB
      → controller shapes response → (error?) → errorHandler → JSON envelope → Client
```

### 9.3 AI Service (`services/aiService.js`)
- Single responsibility: given a `topic`, return `{ title, content }`.
- Uses the `openai` SDK with `OPENAI_API_KEY`, model `gpt-4o-mini`.
- Call `chat.completions.create` with `response_format: { type: "json_object" }` (JSON mode) so the model returns parseable JSON directly.
- **Prompt design** — instruct the model to act as a forum member starting a discussion and to return **strict JSON**:
  ```
  You are a knowledgeable community member starting a discussion on an online forum.
  Write an engaging forum post about the topic: "<TOPIC>".
  Requirements:
  - A concise, catchy title (max 120 chars), no quotes.
  - A body of 80–250 words that raises a question or opinion to spark replies.
  - Natural, conversational, discussion-starter tone. Not an encyclopedia entry.
  Return ONLY valid JSON, no markdown fences:
  { "title": "...", "content": "..." }
  ```
- With JSON mode the response is valid JSON; still `JSON.parse` inside a try/catch and strip any stray code fences defensively.
- **Post-parse validation:** ensure `title` and `content` are non-empty and within length bounds (§12.2–12.3). If parsing fails or fields are missing/empty → throw a typed `AIError` → controller returns `502` (or `500`) with a friendly message. **Never persist a partial/invalid post.**
- Apply a request **timeout** (e.g. 15s) so a hung provider surfaces as a controlled `502`.

### 9.4 Controllers & Services
| Concern | File |
|---|---|
| Feed / detail / generate / like | `controllers/postController.js` |
| Comment list / create | `controllers/commentController.js` |
| AI integration | `services/aiService.js` |
| Post persistence helpers | `services/postService.js` (optional) |

### 9.5 Configuration (`config/`)
- `config/db.js` — Mongoose connection with retry/log.
- `config/env.js` — read + validate required env vars at boot; fail fast if missing.

**Environment variables**
| Var | Example | Used by |
|---|---|---|
| `PORT` | `5000` | server |
| `MONGODB_URI` | `mongodb://localhost:27017/ai-forum` | db |
| `OPENAI_API_KEY` | `sk-...` (never commit; `.env` only) | AI service |
| `OPENAI_MODEL` | `gpt-4o-mini` | AI service |
| `CORS_ORIGIN` | `http://localhost:5173` | CORS |
| `AI_TIMEOUT_MS` | `15000` | AI service |
| Frontend `VITE_API_BASE_URL` | `http://localhost:5000/api` | axios client |

### 9.6 Middleware (`middleware/`)
- `validate.js` — express-validator chains + error formatter → `400` with field errors.
- `errorHandler.js` — catches thrown errors, maps error types → status codes, logs server-side, returns envelope (no stack traces to client).
- `notFound.js` — 404 for unknown routes.
- `rateLimiter.js` *(optional)* — `express-rate-limit` on `POST /api/posts/generate` (e.g. 10 req / 15 min / IP).

### 9.7 Seed (`seed/`)
- `seed/seedUser.js` — idempotently upsert the Default User; run on server boot or via `npm run seed`.
- Optionally seed 2–3 sample posts so the feed isn't empty on first load (mirrors the design's example threads).

---

## 10. Folder Structure

### 10.1 Frontend
```text
frontend/
  index.html
  tailwind.config.js
  vite.config.js
  .env                      # VITE_API_BASE_URL
  src/
    assets/                 # fonts (Geist), icons, images
    components/
      common/               # Button, Card, Input, Loader, Avatar, ToastNotification, EmptyState
      forum/                # TopicForm, PostCard, LikeButton, ShareButton, CopyLinkButton,
                            #   CommentSection, CommentForm, PostDetailHeader, PostMeta, CommentItem
      layout/               # Navbar, Sidebar (trending/rules), PageContainer
    pages/                  # HomePage.jsx, PostDetailPage.jsx, NotFoundPage.jsx
    hooks/                  # usePosts, usePost, useGeneratePost, useLike, useComments
    services/               # apiClient.js (axios), postService.js, commentService.js
    utils/                  # formatDate.js, clipboard.js, truncate.js, validators.js
    context/                # ToastContext.jsx, UserContext.jsx (default user)
    styles/                 # index.css (Tailwind directives + Geist @font-face)
    App.jsx                 # router + providers
    main.jsx                # entry
```

### 10.2 Backend
```text
backend/
  .env                      # PORT, MONGODB_URI, GEMINI_API_KEY, ...
  package.json
  src/
    config/                 # db.js, env.js
    controllers/            # postController.js, commentController.js
    models/                 # User.js, Post.js, Comment.js
    routes/                 # index.js, postRoutes.js, commentRoutes.js
    services/               # aiService.js, postService.js
    middleware/             # validate.js, errorHandler.js, notFound.js, rateLimiter.js
    utils/                  # ApiError.js, asyncHandler.js, response.js
    seed/                   # seedUser.js, seedPosts.js
    app.js                  # express app + middleware wiring
    server.js               # boot: connect DB, seed, listen
```

---

## 11. UI Components

| Component | Location | Responsibility |
|---|---|---|
| `Navbar` | layout | Branding ("AI Forum"), (decorative) search, avatar, code toggle |
| `Sidebar` | layout | Static Trending Topics + Forum Rules cards (optional; hidden on mobile) |
| `PageContainer` | layout | Max-width 1200px, responsive gutters, grid |
| `TopicForm` | forum | "Start a Discussion" card: topic input + Generate button; triggers generation, shows inline errors, disables while generating |
| `PostCard` | forum | Feed summary: title, 3-line preview, author, date, category chip, like/comment/share actions; links to detail |
| `PostDetailHeader` | forum | Detail page: full title, author, date, action row |
| `PostMeta` | forum | Like count, comment count, share action row |
| `LikeButton` | forum | Upvote-styled control; optimistic increment; session guard |
| `ShareButton` | forum | Native share or clipboard fallback; triggers toast |
| `CopyLinkButton` | forum | Copies `/posts/:id` URL to clipboard (used by ShareButton) |
| `CommentSection` | forum | Lists comments (thread line, AUTHOR badge); holds CommentForm |
| `CommentItem` | forum | Single comment: avatar, author, text, date |
| `CommentForm` | forum | Text input + submit; validates; appends on success |
| `Button` | common | Primary/secondary variants, sizes, disabled/loading states |
| `Card` | common | White surface, 1px border, 8px radius, hover elevation |
| `Input` | common | Labeled input with focus glow + error state |
| `Avatar` | common | User image or initials fallback |
| `Loader` | common | Spinner + skeleton ("Generating post…", feed/comment loading) |
| `EmptyState` | common | No-posts / no-comments messaging |
| `ToastNotification` | common | Success/error transient feedback ("Link copied to clipboard.") |

---

## 12. Validation Rules

### 12.1 Topic (request → `/generate`)
- Required; not empty/whitespace-only.
- Min length **3**, max length **100** characters.
- Error examples: "Topic cannot be empty", "Topic must be at least 3 characters", "Topic must be at most 100 characters".

### 12.2 Generated Title (post-AI, server-side)
- Required, non-empty; max **120** characters (truncate or reject; prefer reject → `502`).

### 12.3 Generated Content (post-AI, server-side)
- Required, non-empty; min **50**, max **2000** characters.

### 12.4 Comment Text (request → `/comments`)
- Required; not empty/whitespace-only; min **1**, max **500** characters.

### 12.5 Author
- Always the seeded Default User (server-attached). No client author input trusted.

### 12.6 IDs / Share URL
- `:id` params validated as MongoDB ObjectId → `400` if malformed, `404` if not found.
- Share URL derived only from a valid post `_id`; exposes no sensitive data.

**Validation happens server-side (authoritative).** Client-side mirrors it for UX (inline errors, disabled buttons) but is not relied upon for security.

---

## 13. Error Handling

Centralized `errorHandler` middleware; typed `ApiError` with `statusCode`. No stack traces leaked to the client. All errors return the standard `{ success: false, message, errors? }` envelope.

| Scenario | Cause | Backend behavior | Frontend behavior |
|---|---|---|---|
| **AI failure** | provider down, bad key, rate limit, timeout | `502` (or `500`), friendly message, **do not save** partial post, log server-side | Toast/inline: "Unable to generate post right now. Please try again." + retry button; preserve topic input |
| **Empty/malformed AI response** | blank title/content, unparseable JSON | reject, controlled `502`, do not persist | same friendly generate error + retry |
| **DB failure** | connection/read/write error | `500`, log server-side, generic message | generic error toast, retry |
| **Network failure** | client offline / backend unreachable | n/a (no response) | clear network message, preserve input, allow retry |
| **Invalid request** | empty topic, comment too long, missing/bad ID | `400` with field-level `errors[]` | show field errors inline; keep form state |
| **Not found** | post/comment ID absent | `404` | not-found state on detail page; toast on actions |
| **Rate limited** *(if enabled)* | too many generate calls | `429` | "You're generating too fast — try again shortly." |

Principles: fail closed on writes (never persist invalid data); user-facing copy is friendly and actionable; internal details are logged, not exposed.

---

## 14. Development Milestones

Ordered for a 4–8 hour build; each milestone is independently demoable.

**M0 — Scaffolding (30–45 min)**
- Init `frontend` (Vite + React + Tailwind + Router) and `backend` (Express + Mongoose).
- Tailwind config with design tokens (§8.2); Geist font loaded.
- `.env` files; DB connection; `/api/health`; CORS.
- Seed Default User.

**M1 — Data layer & core APIs (60–90 min)**
- Models: User, Post, Comment.
- `GET /api/posts`, `GET /api/posts/:id`, error handler, validation middleware, response envelope.
- Seed 2–3 sample posts.

**M2 — AI generation (60–90 min)**
- `aiService.js` (Gemini, prompt, JSON parse, timeout, post-validation).
- `POST /api/posts/generate` end-to-end (validate → AI → save → return).
- Manual test with sample topics.

**M3 — Frontend feed + generation (60–90 min)**
- Layout: Navbar, PageContainer, Sidebar.
- `HomePage`: TopicForm + feed of PostCards.
- `usePosts`, `useGeneratePost`; loading skeleton; empty state; prepend on success.

**M4 — Interactions (60–90 min)**
- Like: `PATCH /like` + `LikeButton` optimistic + session guard.
- Comments: `GET/POST /comments`, `CommentSection`, `CommentForm`.
- Share: `ShareButton` (native/clipboard) + `ToastNotification`.

**M5 — Post detail + polish (45–60 min)**
- `/posts/:id` `PostDetailPage` (full content, comments, actions).
- Responsive pass (mobile stack), focus/hover states, not-found + error states.
- Final QA against acceptance criteria.

**Buffer/Optional** — rate limiting, session like-guard, one or two Future items (§16).

---

## 15. Acceptance Criteria

**Generation**
- ✅ Entering a valid topic and clicking Generate creates a post and shows it at the top of the feed.
- ✅ A loading state appears during generation; the button is disabled in-flight.
- ✅ Empty/short/long topics are rejected with a visible field error and no API call side effects.
- ✅ AI failure shows a friendly error + retry; no partial post is saved.

**Feed**
- ✅ Feed lists all posts newest-first with title, preview, author, date, like count, comment count, share.
- ✅ Empty feed shows an empty state.

**Likes**
- ✅ Clicking like increments the count and persists (survives refresh).
- ✅ (Optional) A second like in the same session is prevented client-side.

**Comments**
- ✅ Submitting a valid comment appends it and increments the count.
- ✅ Empty/too-long comments are rejected with an inline error.
- ✅ Comments render author, text, and date; empty state shown when none.

**Sharing**
- ✅ Share copies `/posts/:id` (or opens native share) and shows "Link copied to clipboard."
- ✅ Opening a shared URL loads that exact post via the detail page.

**Detail page**
- ✅ `/posts/:id` shows full post + all comments + working like/comment/share.
- ✅ Invalid/missing IDs show a not-found state, not a crash.

**Cross-cutting**
- ✅ Responsive on mobile/tablet/desktop; feed stacks cleanly on small screens.
- ✅ No secrets in the client bundle; all inputs validated server-side; CORS restricted.
- ✅ Folder structure matches §10; UI matches the design system (§8.2).

---

## 16. Future Improvements (Only If Time Allows)

Clearly **outside required scope**. Prioritized:

1. **Search discussions** — wire the navbar search bar to a filtered feed query.
2. **Trending topics / category chips** — make sidebar + post categories data-driven instead of static.
3. **Delete comment** — soft/hard delete with confirm.
4. **Dark mode** — the design tokens already define inverse surfaces; add a theme toggle.
5. **Markdown support** — render post/comment bodies as sanitized Markdown.
6. **Share-count tracking** — add `PATCH /api/posts/:id/share` + `shareCount` field.
7. **Copy-link toast animation** — subtle enter/exit motion on the toast.
8. **Post detail enhancements** — related posts, reading time, copy-permalink button in header.

**Explicitly excluded (do not build):** authentication, notifications, pagination/infinite scroll, WebSockets/real-time, moderation/admin, multi-user identity, or any enterprise-scale feature.

---

### Appendix A — Reference Design Assets
- `stitch_clean_forum_post_generator/DESIGN.md` — full token spec (colors, typography, spacing, elevation, component rules).
- `stitch_clean_forum_post_generator/screen.png` — reference desktop layout (navbar, Start-a-Discussion card, post cards with inline comments, sidebar, generating skeleton).
- `stitch_clean_forum_post_generator/code.html` — reference static markup.

### Appendix B — Terminology Map
| Spec term | Design rendering | API |
|---|---|---|
| Like | Upvote arrow + count | `likeCount`, `PATCH /like` |
| Share | Share icon → clipboard/native | client-only (no endpoint) |
| Topic form | "Start a Discussion" card | `POST /generate` |
| Author | "Default User" (seeded) | `author` ref → User |

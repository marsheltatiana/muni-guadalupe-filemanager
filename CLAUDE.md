# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

File/archive manager for the Municipalidad Distrital de Guadalupe ("Archivo General"): tracks physical documents (shelf → container → document), stores their PDFs, manages loans, and offers semantic search over PDF contents. Deployed at https://munifilemanager.vercel.app/. UI text, DB identifiers, and API route names are in Spanish — keep new ones in Spanish too.

Two deployables live in this repo:

- **Root** — Next.js 14 (App Router) + Prisma + NextAuth v5 beta + shadcn/ui.
- **`ai/`** — Python FastAPI semantic-search service (sentence-transformers).

## Commands

```bash
npm run dev      # prisma generate && next dev  (http://localhost:3000)
npm run build    # prisma generate && next build (output: "standalone")
npm run lint     # next lint
npx prisma db pull    # re-introspect schema after DB changes (see Database)
npx prisma generate   # regenerate client after editing schema.prisma
```

There is no test suite and no test runner configured.

Search service (from `ai/`):

```bash
pip install -r requirements.txt
uvicorn api:app --reload --port 8000     # FastAPI service used by the app
streamlit run main.py                    # standalone prototype over ./pdfs, not used by the app
```

Docker: root `compose.yml` runs `frontend` (port 3000) + `search-api` (internal 8000) together; `ai/compose.yml` runs the search API alone on host port 8022.

## Environment

`.env.example` is incomplete. Variables the code actually reads beyond those listed there:

- `APP_URL` — base URL of the Next app itself (e.g. `http://localhost:3000`). Required: server components and the credentials login fetch the app's own API routes through it.
- `SUPERSEARCH_ENDPOINT` — full URL of the FastAPI `/supersearch/` endpoint.
- `SUPERADMIN_EMAIL` — a role-less user logging in with this email is assigned the `Admin` role.

`ai/` reads `DOCS_ENDPOINT` (URL of the Next app's `/api/documentos`) and `SENTENCE_TRANSFORMER` (model name).

## Architecture

### Data flow

Server-component pages under `app/dashboard/*` do not query Prisma directly. They call `auth()`, check a permission, then `fetch(`${process.env.APP_URL}/api/...`, { cache: "no-cache" })` and pass the JSON to client components in `components/`. Client components mutate through the same `/api/*` routes using relative `fetch`. Prisma (`lib/db.ts` singleton) is used only inside `app/api/*/route.ts` and `app/actions.ts`.

Each resource is a single `route.ts` exporting multiple verbs; there are no `[id]` dynamic segments — item-level operations take the id via query string (e.g. `DELETE /api/documentos?id=...`) or request body.

### Auth and permissions

- `lib/auth.ts` configures NextAuth with Google and Credentials, JWT sessions (no DB adapter is wired). The Credentials `authorize` cannot use bcrypt/Prisma in the edge runtime, so it POSTs to `/api/bcrypt` (`runtime = "nodejs"`), which verifies the password and returns an `AuthenticatedUser` with role and permissions. That route also lazily assigns a role on first login: `Admin` if the email matches `SUPERADMIN_EMAIL`, otherwise `Trabajador` — both roles must already exist in the `Rol` table.
- The role + permission list is copied into the JWT at sign-in and exposed as `session.user.role`. Permission changes only take effect after the user signs in again. Cast `session.user as AuthenticatedUser` (`lib/types/user.ts`) to read it.
- `lib/policy.ts` holds the `Permission` enum and `hasAccess(user, permission)`. The enum values (`ver_documentos`, `crear_roles`, …) must match `Permisos.nombre_permiso` rows in the database exactly; adding a permission means adding both the enum member and the DB row.
- Authorization is enforced in the UI layer only: pages return early on `!hasAccess(...)`, and components hide actions. `app/config/site.ts` defines sidebar entries with a `viewPolicy`, which `components/app-sidebar.tsx` filters. `middleware.ts` re-exports `auth` with no matcher, and the `/api/*` handlers do not check the session or permissions themselves.
- Sign-up goes through the `signUpWithCredentials` server action in `app/actions.ts` (bcrypt, 14 rounds).

### Database

PostgreSQL via Prisma. `prisma/schema.prisma` is introspected from an existing database (PascalCase_Snake model names, `map:` constraint names) and there is no `prisma/migrations` directory — schema changes are made in the database and pulled, not migrated from here.

Domain hierarchy: `Estante` → `Contenedor` (typed by `Tipo_Contenedor`, positioned by `fila`/`columna`) → `Documento` (categorised by `Categoria_Documento`). `Usuario` → `Rol` → `Rol_Permisos` → `Permisos`.

Things that are not obvious from the schema:

- `Documento.id` is a 30-char string generated in `app/api/documentos/route.ts` (`MDG-<name>-<timestamp>-<random>`), not an autoincrement.
- `Documento.estado` is a free `VarChar`; valid values are the `EstadoDocumento` enum in `lib/document-states.ts`.
- `Transaccion.documento_id` has no foreign-key relation to `Documento`; `/api/transacciones` joins documents manually in code.

### File storage

PDFs live in Vercel Blob (`BLOB_READ_WRITE_TOKEN`). The browser uploads directly with `upload()` from `@vercel/blob/client`, using `/api/documentos/upload` as the token handler, then POSTs the resulting `blob_url` plus metadata as `FormData` to `/api/documentos`. Deleting a document also deletes its blob. `/api/subir-pdf` is an older server-side `put()` upload path.

### Semantic search

`components/DocumentSearch.tsx` → `POST /api/search` (proxy) → `SUPERSEARCH_ENDPOINT` (`ai/api.py`, `POST /supersearch/` with `{query, top_k}`). Search timings are logged to the `estadistica_busqueda` table via `/api/estadisticas/search`.

The FastAPI service has no persistent index: on every search request it GETs `DOCS_ENDPOINT`, downloads every PDF, extracts text with PyMuPDF, re-embeds everything, and ranks by cosine similarity. It depends on the exact response shape of `GET /api/documentos` (the nested `Contenedor.Tipo_Contenedor.nombre`, `Contenedor.Estante.nombre_estante`, `Categoria_Documento.nombre_categoria` includes) — changing that route's `include`/field names breaks search.

### UI

shadcn/ui primitives in `components/ui/` (config in `components.json`, `@/` path alias to repo root), Tailwind, react-hook-form + zod (`lib/zod.ts` holds shared schemas), `sonner`/`use-toast` for notifications. Note that `components/ui/` also contains two feature components (`document-management.tsx`, `shelf-management.tsx`), and there is a separate, different `components/shelf-management.tsx`.

## Gotchas

- `ai/requirements.txt` is UTF-16 encoded; preserve or deliberately convert the encoding when editing it.
- `ai/.env` is committed to the repository (while root `.env*` files are ignored).

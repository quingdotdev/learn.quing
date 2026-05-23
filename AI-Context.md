AI Context — Convex & Auth notes

Summary
- Fix: Preserve desired surface (workspace) across auth flow so user returns to the workspace after sign-in.
- Convex: currently used for simple queries and a bootstrap mutation. Improve data fetching patterns, indexing, and auth integration.

Observations in codebase
- Convex client initialized at src/lib/convex-provider.tsx with new ConvexReactClient(import.meta.env.VITE_CONVEX_URL).
- Server-side functions live in convex/*.ts (bootstrap, seedDemoData, createSubject).
- Auth uses WorkOS AuthKit on the client and convexAuth on the server (convex/auth.ts). There isn't an explicit token bridge from WorkOS -> Convex client.

Recommendations
1) Post-auth redirect behavior
- Store an intent key (localStorage: postAuthSurface) before redirecting to sign-in (done in src/App.tsx).
- On auth success, read+clear that key and navigate to the stored surface.

2) Convex best practices
- Use convex/react hooks (useQuery, useMutation, useSubscription) instead of manual client.query calls where possible for automatic subscriptions and caching.
- Avoid heavy bootstrap queries on every server call. Cache bootstrap data client-side when appropriate and only refresh when the user or key dataset changes.
- Ensure proper indexes exist for all queries (e.g., by_user used in many places). Keep index definitions up-to-date in convex/schema.ts.
- Prefer smaller, focused queries and pagination for large collections (notes, uploads). Use server-side pagination/resume tokens.
- Use optimistic updates for create/update/delete mutations to keep UI snappy.

3) Auth & Convex integration
- If server uses convexAuth, ensure the client passes a Convex auth token when constructing ConvexReactClient (if using Convex access control). Evaluate whether WorkOS sessions are mapped to Convex auth tokens on sign-in.
- Alternatively, protect sensitive mutations/queries server-side and keep client as an unauthenticated Convex client with server-auth checks.

4) Data modeling & performance
- Normalize repeated strings (tags, subjects) into their own tables with ids to reduce duplication.
- For large text (note bodies), consider storing optional renditions or summaries and fetch full body on-demand.
- Use Date fields and optional updatedAt strings consistently for sorting and incremental sync.

5) Developer ergonomics
- Add wrapper hooks (useNotes, useSubjects) that encapsulate Convex queries/mutations and loading/error handling.
- Add debug logging around Convex errors and retries.

Where to start
- Merge the post-auth fix (already applied).
- Add useQuery/useMutation hooks for notes and subjects and incrementally replace existing calls.
- Verify convexAuth token flow: test that authenticated users get appropriate Convex permissions. If missing, implement token exchange on server during WorkOS callback.

Notes
- Server-side seeds and mutations are in convex/*.ts; keep these authoritative for schema changes.
- This file is intended to be a single-point summary for an AI assistant or new developer to understand auth+Convex context.

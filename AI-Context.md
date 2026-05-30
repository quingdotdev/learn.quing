AI Context - Convex & Auth notes

Summary
- Auth was migrated from the incomplete WorkOS setup to Clerk + Convex's first-party Clerk integration.
- Convex is currently used for simple queries and workspace mutations.

Observations in codebase
- Convex client is initialized at src/lib/convex-provider.tsx with new ConvexReactClient(import.meta.env.VITE_CONVEX_URL).
- The app is wrapped with ClerkProvider and ConvexProviderWithClerk.
- Server-side functions live in convex/*.ts.
- Convex auth is configured in convex/auth.config.ts.
- Convex functions access the signed-in user with ctx.auth.getUserIdentity() and store identity.subject as userId.

Recommendations
1. Auth setup
- In Clerk, activate the Convex integration.
- Set VITE_CLERK_PUBLISHABLE_KEY in the Vite environment.
- Set CLERK_JWT_ISSUER_DOMAIN for Convex and sync it with npx convex dev or npx convex deploy.
- Keep using useConvexAuth() for app auth state because it waits for Convex token validation.

2. Convex best practices
- Use convex/react hooks (useQuery, useMutation, useSubscription) for automatic subscriptions and caching.
- Avoid heavy bootstrap queries as the dataset grows; split workspace data into smaller focused queries.
- Ensure proper indexes exist for all queries, especially by_user and by_subject patterns.
- Prefer pagination for large notes and uploads.
- Use optimistic updates for create/update/delete mutations to keep UI snappy.

3. Data modeling & performance
- Normalize repeated strings such as tags and subjects into their own tables if filtering becomes richer.
- For large note bodies, consider fetching full body on demand while listing summaries separately.
- Use updatedAt consistently for sorting and incremental sync.

4. Developer ergonomics
- Add wrapper hooks such as useNotes and useSubjects for shared loading/error behavior.
- Add explicit empty/error UI for failed Convex queries.

Where to start
- Verify Clerk token flow: after login, useConvexAuth() should report authenticated and workspace queries should return user data.
- Improve the note editor interactions after auth is stable.

Notes
- Server-side seeds and mutations are in convex/*.ts; keep these authoritative for schema changes.
- This file is intended to help a new developer or AI assistant understand the auth and Convex context.

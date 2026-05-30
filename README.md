# learn by Quing

A focused notes app for helping students find understanding faster. Quing combines markdown notes, subject organization, contextual search, YouTube lecture references, timestamps, and uploaded study resources in one quiet workspace.

## Stack

- React, TypeScript, and Vite
- Convex for realtime data
- Clerk for authentication
- Tailwind CSS

## Setup

1. Install dependencies.

   ```sh
   npm install
   ```

2. Create a `.env.local` file with:

   ```sh
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key
   CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-issuer.clerk.accounts.dev
   ```

3. In Clerk, activate the Convex integration and copy the Clerk Frontend API URL into `CLERK_JWT_ISSUER_DOMAIN`.

4. Start Convex so it syncs `convex/auth.config.ts`.

   ```sh
   npx convex dev
   ```

5. Start the app.

   ```sh
   npm run dev
   ```

## Notes

- The app uses `useConvexAuth()` for auth state, so the workspace opens only after Convex has validated the Clerk token.
- Convex functions use `ctx.auth.getUserIdentity()` and store the Clerk subject as `userId`.

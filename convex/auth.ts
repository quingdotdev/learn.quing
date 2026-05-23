import { AuthKit, type AuthFunctions } from "@convex-dev/workos-authkit";
import { components } from "./_generated/api";

const authFunctions: AuthFunctions = {
  // Add any custom auth logic here
};

export const authkit = new AuthKit((components as any).workosAuthKit, {
  authFunctions,
});

export const events = authkit.events({
  "user.created": async (ctx, event) => {
    await ctx.db.insert("users", {
      authId: event.data.id,
      email: event.data.email,
      name: `${event.data.firstName ?? ""} ${event.data.lastName ?? ""}`.trim(),
    });
  },
  "user.updated": async (ctx, event) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", event.data.id))
      .unique();
    if (user) {
      await ctx.db.patch(user._id as any, {
        email: event.data.email,
        name: `${event.data.firstName ?? ""} ${event.data.lastName ?? ""}`.trim(),
      });
    }
  },
  "user.deleted": async (ctx, event) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", event.data.id))
      .unique();
    if (user) {
      await ctx.db.delete(user._id as any);
    }
  },
});

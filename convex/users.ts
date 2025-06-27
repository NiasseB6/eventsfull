import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// listes de utilisateurs
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
    .query("users")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .first();

    return user;
  },
});
// mise a jour des utilisateurs
export const updateUser = mutation({
    args: {
      userId: v.string(),
      name: v.string(),
      email: v.string(),
    },
    handler: async (ctx, { userId, name, email }) => {
      // verification de l'utilisateur
      const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

      if (existingUser) {
        // mise a jour de l'utilisateur
        await ctx.db.patch(existingUser._id, {
          name,
          email,
        });
        return existingUser._id;
      }

      // creation de l'utilisateur
      const newUser = await ctx.db.insert("users", {
        userId,
        name,
        email,
        stringConnectId: undefined,
      })

      return newUser;
    },
})
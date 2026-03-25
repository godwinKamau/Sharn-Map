import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNotes = query({
  args: { namespace: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_namespace", (q) => q.eq("namespace", args.namespace))
      .collect();
  },
});

export const saveNote = mutation({
  args: {
    namespace: v.string(),
    id: v.string(),
    title: v.string(),
    body: v.string(),
    lat: v.number(),
    lng: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("notes")
      .withIndex("by_namespace_id", (q) =>
        q.eq("namespace", args.namespace).eq("id", args.id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        body: args.body,
        lat: args.lat,
        lng: args.lng,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
      });
    } else {
      await ctx.db.insert("notes", {
        namespace: args.namespace,
        id: args.id,
        title: args.title,
        body: args.body,
        lat: args.lat,
        lng: args.lng,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
      });
    }
  },
});

export const deleteNote = mutation({
  args: {
    namespace: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("notes")
      .withIndex("by_namespace_id", (q) =>
        q.eq("namespace", args.namespace).eq("id", args.id)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

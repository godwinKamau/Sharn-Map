import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    namespace: v.string(),
    id: v.string(),
    title: v.string(),
    body: v.string(),
    lat: v.number(),
    lng: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_namespace", ["namespace"])
    .index("by_namespace_id", ["namespace", "id"]),
});

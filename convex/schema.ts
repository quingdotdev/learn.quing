import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  }).index('by_authId', ['authId']),
  notes: defineTable({
    title: v.string(),
    userId: v.string(),
    subject: v.string(),
    body: v.string(),
    updatedAt: v.string(),
    tags: v.array(v.string()),
    linkedUploads: v.optional(v.array(v.id('uploads'))),
    videos: v.optional(v.array(
      v.object({
        url: v.string(),
        title: v.string(),
        timestamps: v.array(
          v.object({
            id: v.string(),
            label: v.string(),
            seconds: v.number(),
          }),
        ),
      }),
    )),
  })
    .index('by_user', ['userId'])
    .index('by_subject', ['subject'])
    .searchIndex('search_body', {
      searchField: 'body',
      filterFields: ['subject', 'userId'],
    }),
  subjects: defineTable({
    name: v.string(),
    userId: v.string(),
    color: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_name', ['name']),
  uploads: defineTable({
    name: v.string(),
    userId: v.string(),
    kind: v.union(v.literal('pdf'), v.literal('slides'), v.literal('text'), v.literal('image')),
    url: v.string(),
    category: v.optional(v.string()),
    uploadedAt: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_category', ['category']),
})

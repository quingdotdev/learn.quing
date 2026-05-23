import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { authkit } from './auth'

export const bootstrap = query({
  args: { },
  handler: async (ctx) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    if (!userId) return { notes: [], uploads: [], subjects: [] }

    const [notes, uploads, subjects] = await Promise.all([
      ctx.db.query('notes').withIndex('by_user', (q) => q.eq('userId', userId)).collect(),
      ctx.db.query('uploads').withIndex('by_user', (q) => q.eq('userId', userId)).collect(),
      ctx.db.query('subjects').withIndex('by_user', (q) => q.eq('userId', userId)).collect(),
    ])

    return {
      notes,
      uploads,
      subjects,
    }
  },
})

export const createSubject = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    if (!userId) throw new Error('Unauthorized')
    return await ctx.db.insert('subjects', { name: args.name, userId })
  },
})

export const createUpload = mutation({
  args: {
    name: v.string(),
    kind: v.union(v.literal('pdf'), v.literal('slides'), v.literal('text'), v.literal('image')),
    url: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    if (!userId) throw new Error('Unauthorized')
    return await ctx.db.insert('uploads', {
      name: args.name,
      userId,
      kind: args.kind,
      url: args.url,
      category: args.category,
      uploadedAt: new Date().toISOString(),
    })
  },
})

export const seedDemoData = mutation({
  args: { replace: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    if (!userId) throw new Error('Unauthorized')

    if (args.replace) {
      const notes = await ctx.db.query('notes').withIndex('by_user', (q) => q.eq('userId', userId)).collect()
      for (const n of notes) await ctx.db.delete(n._id)
      const uploads = await ctx.db.query('uploads').withIndex('by_user', (q) => q.eq('userId', userId)).collect()
      for (const u of uploads) await ctx.db.delete(u._id)
      const subjects = await ctx.db.query('subjects').withIndex('by_user', (q) => q.eq('userId', userId)).collect()
      for (const s of subjects) await ctx.db.delete(s._id)
    }

    await ctx.db.insert('subjects', { name: 'General', userId })

    await ctx.db.insert('notes', {
      title: 'Welcome to Quing',
      userId,
      subject: 'General',
      body: `# Getting Started with Quing

Welcome to your new study workspace. Here's how to make the most of it:

## 1. Hybrid Editing
Click on any line to edit the raw markdown. Move your focus away, and it instantly formats back to a clean reading view.

## 2. Contextual Selection
Highlight any word or phrase to open the contextual toolbar. From there, you can:
- **Format** text (bold, italic, underline, highlight).
- **Search** instantly on Google, Wikipedia, or YouTube without leaving the app.

## 3. Video Integration
Click the video icon in the header to append a YouTube lecture. You can add your own timestamps to jump to key moments in the video.

## 4. Subjects & Organization
Create your own subjects in the sidebar to keep your notes organized.

Start by deleting this note or creating your first subject!`,
      updatedAt: new Date().toISOString(),
      tags: ['help', 'onboarding'],
      linkedUploads: [],
      videos: []
    })

    return { success: true }
  },
})

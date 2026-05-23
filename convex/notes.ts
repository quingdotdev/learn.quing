import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { authkit } from './auth'

export const list = query({
  args: { 
    subject: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    if (!userId) return []

    let q = ctx.db
      .query('notes')
      .withIndex('by_user', (q) => q.eq('userId', userId))

    const notes = await q.collect()

    if (args.subject) {
      return notes.filter(n => n.subject === args.subject)
    }
    return notes
  },
})

export const get = query({
  args: { id: v.id('notes') },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) return null
    return note
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    if (!userId) throw new Error('Unauthorized')

    return await ctx.db.insert('notes', {
      title: args.title,
      userId,
      subject: args.subject,
      body: '',
      updatedAt: new Date().toISOString(),
      tags: [],
      linkedUploads: [],
      videos: []
    })
  },
})

export const updateMetadata = mutation({
  args: {
    id: v.id('notes'),
    title: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) throw new Error('Unauthorized')

    const patch: any = { updatedAt: new Date().toISOString() }
    if (args.title !== undefined) patch.title = args.title
    if (args.subject !== undefined) patch.subject = args.subject

    await ctx.db.patch(args.id, patch)
    return await ctx.db.get(args.id)
  },
})

export const save = mutation({
  args: {
    id: v.id('notes'),
    body: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) throw new Error('Unauthorized')

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: args.updatedAt,
    })
    return await ctx.db.get(args.id)
  },
})

export const addVideo = mutation({
  args: {
    id: v.id('notes'),
    url: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) throw new Error('Unauthorized')

    const videos = note.videos ?? []
    videos.push({ url: args.url, title: args.title, timestamps: [] })
    await ctx.db.patch(args.id, { videos })
  },
})

export const addTimestamp = mutation({
  args: {
    id: v.id('notes'),
    videoUrl: v.string(),
    label: v.string(),
    seconds: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) throw new Error('Unauthorized')

    const videos = note.videos?.map(v => {
      if (v.url === args.videoUrl) {
        return {
          ...v,
          timestamps: [...v.timestamps, { id: Math.random().toString(36).substr(2, 9), label: args.label, seconds: args.seconds }]
        }
      }
      return v
    })
    await ctx.db.patch(args.id, { videos })
  },
})

export const remove = mutation({
  args: { id: v.id('notes') },
  handler: async (ctx, args) => {
    const user = await authkit.getAuthUser(ctx)
    const userId = user?.id
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) throw new Error('Unauthorized')
    await ctx.db.delete(args.id)
  },
})

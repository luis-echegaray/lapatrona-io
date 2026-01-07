import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_created')
      .order('desc')
      .collect()
  },
})

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('tasks', {
      text: args.text,
      completed: false,
      createdAt: Date.now(),
    })
  },
})

export const toggle = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id)
    if (!task) throw new Error('Task not found')
    await ctx.db.patch(args.id, { completed: !task.completed })
  },
})

export const remove = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

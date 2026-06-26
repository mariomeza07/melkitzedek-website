import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: r => r.required() }),
    defineField({ name: 'pastor', title: 'Pastor', type: 'string' }),
    defineField({ name: 'scripture', title: 'Scripture reference', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'videoUrl', title: 'Video URL (YouTube/Vimeo)', type: 'url' }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  orderings: [{ title: 'Date, newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'thumbnail' },
  },
})

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: r => r.required() }),
    defineField({ name: 'time', title: 'Time (e.g. 10:00 AM)', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'badge', title: 'Badge label (e.g. Weekly)', type: 'string' }),
    defineField({ name: 'recurring', title: 'Recurring event?', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Date, soonest', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})

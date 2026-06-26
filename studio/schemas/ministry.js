import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ministry',
  title: 'Ministry',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Cross / Faith', value: 'cross' },
          { title: 'Music / Worship', value: 'music' },
          { title: 'People / Community', value: 'people' },
          { title: 'Book / Bible Study', value: 'book' },
          { title: 'Heart / Care', value: 'heart' },
          { title: 'Star / Youth', value: 'star' },
          { title: 'Home / Family', value: 'home' },
          { title: 'Globe / Missions', value: 'globe' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 1 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})

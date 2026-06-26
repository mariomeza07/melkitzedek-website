import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'devotional', title: 'Devotional' },
    { name: 'visit', title: 'Visit' },
  ],
  fields: [
    /* ── Hero ── */
    defineField({
      name: 'heroBg',
      title: 'Hero background photo',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Full-screen background image behind the main heading',
    }),
    defineField({ name: 'heroEyebrow', title: 'Eyebrow label', type: 'string', group: 'hero', initialValue: 'Tegucigalpa, Honduras' }),
    defineField({ name: 'heroTitle', title: 'Main heading', type: 'string', group: 'hero', initialValue: 'You\'re Invited' }),
    defineField({ name: 'heroTitleItalic', title: 'Italic line (gold)', type: 'string', group: 'hero', initialValue: 'to something real.' }),
    defineField({ name: 'heroSubtitle', title: 'Subtitle paragraph', type: 'text', rows: 2, group: 'hero' }),
    defineField({ name: 'heroCta1', title: 'Button 1 label', type: 'string', group: 'hero', initialValue: 'Plan a visit' }),
    defineField({ name: 'heroCta2', title: 'Button 2 label', type: 'string', group: 'hero', initialValue: 'Watch a sermon' }),

    /* ── About ── */
    defineField({
      name: 'aboutImage',
      title: 'About / Community photo',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    }),
    defineField({ name: 'aboutEyebrow', title: 'Eyebrow label', type: 'string', group: 'about', initialValue: 'Who we are' }),
    defineField({ name: 'aboutTitle', title: 'Heading', type: 'string', group: 'about', initialValue: 'Everyone welcome, no exceptions.' }),
    defineField({ name: 'aboutTitleItalic', title: 'Italic part of heading', type: 'string', group: 'about', initialValue: 'no exceptions.' }),
    defineField({ name: 'aboutBody', title: 'Body paragraph', type: 'text', rows: 4, group: 'about' }),

    /* ── Devotional ── */
    defineField({ name: 'devQuote', title: 'Bible quote', type: 'text', rows: 3, group: 'devotional' }),
    defineField({ name: 'devReference', title: 'Scripture reference', type: 'string', group: 'devotional', initialValue: 'John 3:16' }),
    defineField({ name: 'devBody', title: 'Devotional body text', type: 'text', rows: 4, group: 'devotional' }),

    /* ── Visit ── */
    defineField({ name: 'visitSubtitle', title: 'Visit section subtitle', type: 'text', rows: 2, group: 'visit' }),
  ],
  preview: { prepare: () => ({ title: 'Homepage Content' }) },
})

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'churchName', title: 'Church name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'radioStreamUrl', title: 'Radio stream URL', type: 'url' }),
    defineField({ name: 'tuneInUrl', title: 'TuneIn URL', type: 'url' }),
    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
    defineField({ name: 'sundayTime', title: 'Sunday service time', type: 'string' }),
    defineField({ name: 'wednesdayTime', title: 'Wednesday service time', type: 'string' }),
  ],
  preview: { select: { title: 'churchName' } },
})

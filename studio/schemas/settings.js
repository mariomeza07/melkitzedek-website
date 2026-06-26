import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'contact', title: 'Contact & Location' },
    { name: 'social', title: 'Social Media' },
    { name: 'radio', title: 'Radio' },
    { name: 'service', title: 'Service Times' },
  ],
  fields: [
    defineField({ name: 'churchName', title: 'Church name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Footer tagline', type: 'string' }),

    /* Contact */
    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({ name: 'address', title: 'Address', type: 'string', group: 'contact' }),
    defineField({ name: 'mapUrl', title: 'Google Maps link', type: 'url', group: 'contact' }),

    /* Social */
    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url', group: 'social' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url', group: 'social' }),
    defineField({ name: 'youtube', title: 'YouTube URL', type: 'url', group: 'social' }),

    /* Radio */
    defineField({ name: 'radioStreamUrl', title: 'Radio stream URL', type: 'url', group: 'radio' }),
    defineField({ name: 'tuneInUrl', title: 'TuneIn URL', type: 'url', group: 'radio' }),
    defineField({ name: 'radioDescription', title: 'Radio description', type: 'string', group: 'radio' }),

    /* Service times */
    defineField({ name: 'sundayTime', title: 'Sunday service time', type: 'string', group: 'service' }),
    defineField({ name: 'wednesdayTime', title: 'Wednesday service time', type: 'string', group: 'service' }),
  ],
  preview: { select: { title: 'churchName' } },
})

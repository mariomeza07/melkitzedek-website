import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero',        title: '① Hero' },
    { name: 'stats',       title: '② Stats bar' },
    { name: 'sermons',     title: '③ Sermons section' },
    { name: 'about',       title: '④ About' },
    { name: 'events',      title: '⑤ Events section' },
    { name: 'ministries',  title: '⑥ Ministries section' },
    { name: 'devotional',  title: '⑦ Devotional' },
    { name: 'prayer',      title: '⑧ Prayer' },
    { name: 'visit',       title: '⑨ Visit CTA' },
    { name: 'contact',     title: '⑩ Contact section' },
  ],
  fields: [

    /* ── ① Hero ── */
    defineField({ name: 'heroBg', title: 'Hero background photo', type: 'image', group: 'hero', options: { hotspot: true }, description: 'Full-screen photo behind the heading' }),
    defineField({ name: 'heroEyebrow',     title: 'Eyebrow label',     type: 'string', group: 'hero', initialValue: 'Iglesia Melkitzedek' }),
    defineField({ name: 'heroTitle',       title: 'Main heading',      type: 'string', group: 'hero', initialValue: 'A place where faith becomes your foundation' }),
    defineField({ name: 'heroTitleItalic', title: 'Italic word(s) inside heading', type: 'string', group: 'hero', initialValue: 'faith', description: 'Must appear exactly in the heading above' }),
    defineField({ name: 'heroSubtitle',    title: 'Subtitle paragraph', type: 'text', rows: 2, group: 'hero', initialValue: 'Worship. Teaching. Community. Join us this Sunday at 10:00 AM.' }),
    defineField({ name: 'heroCta1',  title: 'Button 1 label', type: 'string', group: 'hero', initialValue: 'Plan a visit' }),
    defineField({ name: 'heroCta2',  title: 'Button 2 label', type: 'string', group: 'hero', initialValue: 'Watch a sermon' }),

    /* ── ② Stats bar ── */
    defineField({ name: 'stat1Value', title: 'Stat 1 — value',  type: 'string', group: 'stats', initialValue: '20+',          description: 'e.g. 20+' }),
    defineField({ name: 'stat1Label', title: 'Stat 1 — label',  type: 'string', group: 'stats', initialValue: 'Years of ministry' }),
    defineField({ name: 'stat2Value', title: 'Stat 2 — value',  type: 'string', group: 'stats', initialValue: 'Sun 10AM' }),
    defineField({ name: 'stat2Label', title: 'Stat 2 — label',  type: 'string', group: 'stats', initialValue: 'Weekly service' }),
    defineField({ name: 'stat3Value', title: 'Stat 3 — value',  type: 'string', group: 'stats', initialValue: '24/7' }),
    defineField({ name: 'stat3Label', title: 'Stat 3 — label',  type: 'string', group: 'stats', initialValue: 'Live radio' }),
    defineField({ name: 'stat4Value', title: 'Stat 4 — value',  type: 'string', group: 'stats', initialValue: 'Tegucigalpa' }),
    defineField({ name: 'stat4Label', title: 'Stat 4 — label',  type: 'string', group: 'stats', initialValue: 'Honduras' }),

    /* ── ③ Sermons section ── */
    defineField({ name: 'sermonsEyebrow', title: 'Eyebrow label', type: 'string', group: 'sermons', initialValue: 'Messages' }),
    defineField({ name: 'sermonsTitle',   title: 'Section heading', type: 'string', group: 'sermons', initialValue: 'Latest sermons' }),
    defineField({ name: 'sermonsViewAll', title: '"View all" link URL', type: 'string', group: 'sermons' }),

    /* ── ④ About ── */
    defineField({ name: 'aboutImage',       title: 'Community photo',    type: 'image', group: 'about', options: { hotspot: true } }),
    defineField({ name: 'aboutEyebrow',     title: 'Eyebrow label',      type: 'string', group: 'about', initialValue: 'Who we are' }),
    defineField({ name: 'aboutTitle',       title: 'Heading',            type: 'string', group: 'about', initialValue: 'Everyone welcome, no exceptions.' }),
    defineField({ name: 'aboutTitleItalic', title: 'Italic part of heading', type: 'string', group: 'about', initialValue: 'no exceptions.', description: 'Must appear exactly in the heading above' }),
    defineField({ name: 'aboutBody',        title: 'Body paragraph',     type: 'text', rows: 4, group: 'about' }),
    defineField({ name: 'aboutCta',         title: 'Button label',       type: 'string', group: 'about', initialValue: 'Come visit us' }),

    /* ── ⑤ Events section ── */
    defineField({ name: 'eventsEyebrow', title: 'Eyebrow label',  type: 'string', group: 'events', initialValue: 'Calendar' }),
    defineField({ name: 'eventsTitle',   title: 'Section heading', type: 'string', group: 'events', initialValue: 'Upcoming events' }),

    /* ── ⑥ Ministries section ── */
    defineField({ name: 'ministriesEyebrow', title: 'Eyebrow label',  type: 'string', group: 'ministries', initialValue: 'Get involved' }),
    defineField({ name: 'ministriesTitle',   title: 'Section heading', type: 'string', group: 'ministries', initialValue: 'Our ministries' }),

    /* ── ⑦ Devotional ── */
    defineField({ name: 'devEyebrow',   title: 'Eyebrow label',     type: 'string', group: 'devotional', initialValue: 'Daily word' }),
    defineField({ name: 'devTitle',     title: 'Section heading',   type: 'string', group: 'devotional', initialValue: "Today's devotional" }),
    defineField({ name: 'devQuote',     title: 'Bible quote',       type: 'text', rows: 3, group: 'devotional' }),
    defineField({ name: 'devReference', title: 'Scripture reference', type: 'string', group: 'devotional', initialValue: 'Psalm 37:7' }),
    defineField({ name: 'devBody',      title: 'Devotional body text', type: 'text', rows: 4, group: 'devotional' }),

    /* ── ⑧ Prayer ── */
    defineField({ name: 'prayerEyebrow',  title: 'Eyebrow label',  type: 'string', group: 'prayer', initialValue: 'Prayer' }),
    defineField({ name: 'prayerTitle',    title: 'Section heading', type: 'string', group: 'prayer', initialValue: 'Request prayer' }),
    defineField({ name: 'prayerSubtitle', title: 'Subtitle',        type: 'text', rows: 2, group: 'prayer', initialValue: 'Share your need with our prayer team. We believe in the power of prayer.' }),

    /* ── ⑨ Visit CTA ── */
    defineField({ name: 'visitEyebrow',      title: 'Eyebrow label',       type: 'string', group: 'visit', initialValue: 'You are welcome here' }),
    defineField({ name: 'visitTitle',        title: 'Main heading',         type: 'string', group: 'visit', initialValue: 'Come as you are. Leave transformed.' }),
    defineField({ name: 'visitTitleItalic',  title: 'Italic part of heading', type: 'string', group: 'visit', initialValue: 'Leave transformed.', description: 'Must appear exactly in the heading above' }),
    defineField({ name: 'visitSubtitle',     title: 'Subtitle paragraph',   type: 'text', rows: 2, group: 'visit', initialValue: 'Join us this Sunday. No perfect people required — just open hearts.' }),
    defineField({ name: 'visitCta1',         title: 'Button 1 label',       type: 'string', group: 'visit', initialValue: 'Plan a visit' }),
    defineField({ name: 'visitCta2',         title: 'Button 2 label',       type: 'string', group: 'visit', initialValue: 'Get directions' }),
    defineField({ name: 'visitTime1Label',   title: 'Time card 1 — label',  type: 'string', group: 'visit', initialValue: 'Sunday service' }),
    defineField({ name: 'visitTime1Time',    title: 'Time card 1 — time',   type: 'string', group: 'visit', initialValue: '10:00 AM' }),
    defineField({ name: 'visitTime1Sub',     title: 'Time card 1 — sublabel', type: 'string', group: 'visit', initialValue: 'Main Sanctuary' }),
    defineField({ name: 'visitTime2Label',   title: 'Time card 2 — label',  type: 'string', group: 'visit', initialValue: 'Wednesday study' }),
    defineField({ name: 'visitTime2Time',    title: 'Time card 2 — time',   type: 'string', group: 'visit', initialValue: '7:00 PM' }),
    defineField({ name: 'visitTime2Sub',     title: 'Time card 2 — sublabel', type: 'string', group: 'visit', initialValue: 'Fellowship Hall' }),

    /* ── ⑩ Contact section ── */
    defineField({ name: 'contactEyebrow', title: 'Eyebrow label',  type: 'string', group: 'contact', initialValue: 'Find us' }),
    defineField({ name: 'contactTitle',   title: 'Section heading', type: 'string', group: 'contact', initialValue: 'Get in touch' }),
    defineField({ name: 'contactHours',   title: 'Office / service hours line', type: 'string', group: 'contact', initialValue: 'Sundays 10AM · Wednesdays 7PM' }),
    defineField({ name: 'contactFormTitle', title: 'Form card heading', type: 'string', group: 'contact', initialValue: 'Send a message' }),
  ],

  preview: { prepare: () => ({ title: 'Homepage Content' }) },
})

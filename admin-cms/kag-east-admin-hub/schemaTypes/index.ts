import {defineType} from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcements',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The heading of the announcement (e.g. IT Troubleshooting Clinic)',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      description: 'The detailed information for students.',
    },
    {
      name: 'date',
      title: 'Event Date/Time',
      type: 'string',
      description: 'e.g. Friday, May 15th, 11:00 AM',
    },
    {
      name: 'isActive',
      title: 'Active?',
      type: 'boolean',
      description: 'Toggle this on to show the announcement on the live site.',
      initialValue: true,
    },
  ],
})

export const video = defineType({
  name: 'video',
  title: 'Video Tutorials',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'string',
    },
    {
      name: 'url',
      title: 'Video/Drive URL',
      type: 'url',
    },
    {
      name: 'isEmbedded',
      title: 'Is Embedded Video?',
      type: 'boolean',
      description: 'Check if this is a Google Drive preview link to embed directly.',
    },
  ],
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQs',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
    },
  ],
})

export const manual = defineType({
  name: 'manual',
  title: 'Survival Kit (Manuals)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'File Name',
      type: 'string',
      description: 'The exact name of the file in the public/manuals folder (e.g. guide.pdf)',
    },
    {
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      description: 'The user-friendly title shown on the site.',
    },
    {
      name: 'size',
      title: 'File Size',
      type: 'string',
      description: 'e.g. 1.2 MB',
    },
  ],
})

export const schemaTypes = [announcement, video, faq, manual]

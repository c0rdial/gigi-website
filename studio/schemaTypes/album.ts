import {defineArrayMember, defineField, defineType} from 'sanity'

export const album = defineType({
  name: 'album',
  title: 'Photo album',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      description: 'Shown above the slideshow.',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Short name',
      description:
        'Click Generate. Shown on the album card and used in the web address (album?shoot=<this>).',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      description: 'Newest albums are shown first.',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Cover picture',
      type: 'image',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photos',
      type: 'array',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              title: 'Image description',
              description: 'Read out by screen readers.',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date', media: 'cover'}},
})

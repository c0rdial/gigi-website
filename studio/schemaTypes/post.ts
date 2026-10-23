import {defineArrayMember, defineField, defineType} from 'sanity'

const top8List = defineArrayMember({
  name: 'top8List',
  title: 'Top 8 list',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'updated', title: 'Last updated', type: 'date'}),
    defineField({
      name: 'items',
      type: 'array',
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          name: 'top8Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              description: 'Song or playlist name.',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({name: 'url', title: 'Link', type: 'url'}),
            defineField({
              name: 'image',
              type: 'image',
              validation: (r) => r.required(),
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Image description',
                  description: 'Read out by screen readers, e.g. the album name.',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'subtitle',
              description: 'Shown in italics under the picture, e.g. the artist.',
              type: 'string',
            }),
            defineField({name: 'subtitleUrl', title: 'Subtitle link', type: 'url'}),
          ],
          preview: {select: {title: 'title', subtitle: 'subtitle', media: 'image'}},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'title'}},
})

export const post = defineType({
  name: 'post',
  title: 'Blog entry',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address',
      description: 'Click Generate. The entry lives at gigivjuju.com/entry?post=<this>.',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'category', type: 'string'}),
    defineField({
      name: 'commentCount',
      title: 'Comment count',
      description: 'The (made up) number shown on the blog page.',
      type: 'number',
    }),
    defineField({
      name: 'summary',
      description: 'Shown on the blog page, followed by "continue reading...".',
      type: 'blockContent',
    }),
    defineField({name: 'body', title: 'Entry text', type: 'blockContent'}),
    defineField({
      name: 'top8Lists',
      title: 'Top 8 lists',
      description: 'Optional picture grids shown after the entry text.',
      type: 'array',
      of: [top8List],
    }),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date'}},
})

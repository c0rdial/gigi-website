import {defineArrayMember, defineField, defineType} from 'sanity'

const linkList = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        name: 'navLink',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'label',
            title: 'Text',
            type: 'string',
            validation: (r) => r.required(),
          }),
          defineField({
            name: 'url',
            title: 'Goes to',
            description:
              'Paste a full web address, or a page on this site such as blog.html. Leave empty if undecided: the link stays visible but does nothing.',
            type: 'url',
            validation: (r) => r.uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
          }),
        ],
        preview: {select: {title: 'label', subtitle: 'url'}},
      }),
    ],
  })

// One document only: the links in the header and footer of every page.
export const navigation = defineType({
  name: 'navigation',
  title: 'Header & footer links',
  type: 'document',
  fields: [
    linkList('topLeft', 'Top bar, left'),
    linkList('topRight', 'Top bar, right (next to the theme picker)'),
    linkList('menu', 'Dark blue menu bar'),
    linkList('footer', 'Footer'),
  ],
  preview: {prepare: () => ({title: 'Header & footer links'})},
})

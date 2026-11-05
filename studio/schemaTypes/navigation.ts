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
            validation: (r) => r.uri(LINK_VALIDATION),
          }),
        ],
        preview: {select: {title: 'label', subtitle: 'url'}},
      }),
    ],
  })

const LINK_VALIDATION = {scheme: ['http', 'https', 'mailto'], allowRelative: true}

const contactButton = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'url',
    validation: (r) => r.uri(LINK_VALIDATION),
  })

// One document only: the links in the header and footer of every page, and the profile's contact buttons.
export const navigation = defineType({
  name: 'navigation',
  title: 'Site links',
  type: 'document',
  fields: [
    linkList('topLeft', 'Top bar, left'),
    linkList('topRight', 'Top bar, right (next to the theme picker)'),
    linkList('menu', 'Dark blue menu bar'),
    linkList('footer', 'Footer'),
    defineField({
      name: 'contactButtons',
      title: 'Contacting Gigi buttons',
      description:
        'Where each button on the profile goes. For email use mailto:name@example.com. Leave empty if undecided: the button stays visible but does nothing.',
      type: 'object',
      fields: [
        contactButton('sendMessage', 'Send Message'),
        contactButton('forwardToFriend', 'Forward to Friend'),
        contactButton('addToFriends', 'Add to Friends'),
        contactButton('addToFavorites', 'Add to Favorites'),
        contactButton('instantMessage', 'Instant Message'),
        contactButton('blockUser', 'Block User'),
        contactButton('addToGroup', 'Add to Group'),
        contactButton('rankUser', 'Rank User'),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site links'})},
})

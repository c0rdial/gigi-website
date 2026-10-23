import {defineArrayMember, defineField, defineType} from 'sanity'

// One document only: the profile page (index.html) and the "Age / Location" box on the other pages.
export const profile = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'about', title: 'Blurbs'},
    {name: 'tables', title: 'Interests, details & schools'},
    {name: 'friends', title: 'Top 8 friends'},
  ],
  fields: [
    defineField({name: 'name', type: 'string', group: 'basics', validation: (r) => r.required()}),
    defineField({
      name: 'picture',
      title: 'Profile picture',
      type: 'image',
      group: 'basics',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Personal message',
      description: 'The quote next to the profile picture.',
      type: 'string',
      group: 'basics',
    }),
    defineField({
      name: 'age',
      type: 'number',
      group: 'basics',
      validation: (r) => r.integer().min(0),
    }),
    defineField({name: 'gender', type: 'string', group: 'basics'}),
    defineField({name: 'city', type: 'string', group: 'basics'}),
    defineField({name: 'country', type: 'string', group: 'basics'}),
    defineField({name: 'lastLogin', title: 'Last login', type: 'date', group: 'basics'}),
    defineField({
      name: 'friendCount',
      title: 'Number of friends',
      type: 'number',
      group: 'friends',
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: 'topFriends',
      title: 'Top 8 friends',
      type: 'array',
      group: 'friends',
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          name: 'friend',
          type: 'object',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'url', title: 'Link', type: 'url'}),
            defineField({
              name: 'photo',
              type: 'image',
              validation: (r) => r.required(),
            }),
          ],
          preview: {select: {title: 'name', media: 'photo'}},
        }),
      ],
    }),
    defineField({name: 'aboutMe', title: 'About me', type: 'blockContent', group: 'about'}),
    defineField({
      name: 'whoIdLikeToMeet',
      title: "Who I'd like to meet",
      type: 'blockContent',
      group: 'about',
    }),
    defineField({
      name: 'interests',
      type: 'array',
      group: 'tables',
      of: [
        defineArrayMember({
          name: 'interest',
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              description: 'For example General, Music, Movies.',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({name: 'text', type: 'blockContent'}),
          ],
          preview: {select: {title: 'category'}},
        }),
      ],
    }),
    defineField({
      name: 'details',
      type: 'array',
      group: 'tables',
      of: [
        defineArrayMember({
          name: 'detail',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              description: 'For example Status, Zodiac.',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({name: 'value', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'schools',
      type: 'array',
      group: 'tables',
      of: [
        defineArrayMember({
          name: 'school',
          type: 'object',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'years', description: 'For example 2002 to 2014.', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'years'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Profile'})},
})

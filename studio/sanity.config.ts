import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// The site reads the profile by this fixed id, so the Studio must never create a second one.
const PROFILE_ID = 'profile'

export default defineConfig({
  name: 'default',
  title: 'Gigi v Juju',

  projectId: '6nir8wjj',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Profile')
              .id(PROFILE_ID)
              .child(S.document().schemaType('profile').documentId(PROFILE_ID)),
            S.divider(),
            S.documentTypeListItem('post').title('Blog entries'),
            S.documentTypeListItem('album').title('Photo albums'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => schemaType !== 'profile'),
  },

  document: {
    actions: (actions, {schemaType}) =>
      schemaType === 'profile'
        ? actions.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : actions,
  },
})

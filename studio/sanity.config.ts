import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// The site reads these by fixed id, so the Studio must never create a second one.
const SINGLETONS = ['profile', 'navigation']

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
              .id('profile')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.listItem()
              .title('Header & footer links')
              .id('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.divider(),
            S.documentTypeListItem('post').title('Blog entries'),
            S.documentTypeListItem('album').title('Photo albums'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : actions,
  },
})

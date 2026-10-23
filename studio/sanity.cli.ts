import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '6nir8wjj',
    dataset: 'production',
  },
  studioHost: 'gigivjuju',
  deployment: {
    appId: 'kd294vg7st7sk498lp3276ra',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})

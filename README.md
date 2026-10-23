# gigi-website

Gigi's site, live at https://gigivjuju.com. Deployed by hand with `wrangler deploy`.

Content (profile, blog entries, photo albums) lives in Sanity, project `6nir8wjj`, and `cms.js` loads it in the browser, so content changes go live without a deploy. The editing Studio is in `studio/` (`npm run dev` inside it, `npm run deploy` to publish it).

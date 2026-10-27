# Production implementation

The redesign is now implemented locally as release v16. The actual app in `index.html`, `guided-builder.js`, `guided-ui.js` and `guided.css` includes composed multi-array sentences and editable See ingredients controls. The canvas below remains the earlier review artifact; the user explicitly requested no further mockup rebuild. Use the production source for subsequent implementation work.

# Guided builder design preview

Review: https://p.superdesign.dev/draft/2f292577-42ec-4e8b-bc1d-9cdba76acf12

Canvas: https://superdesign.dev/teams/d34086fb-26c7-47ea-bcc4-121fa06e8dca/projects/93212c1a-619e-42e0-87cb-1cca94347e0d

Current draft version: 4. The standalone artifact is `guided-builder-preview.html`. This is a responsive interactive prototype with actual character-array entries; production app implementation follows design review.

The selected flow asks Who are they?, What do they want?, and What gets in their way?, offering one possibility at a time. Accepted details build a visible sketch. Optional topics lead into appearance, dialogue, background, relationships, medical details, symbolism and scene tools. Primary navigation is Character, Story tools and Library.

The preview demonstrates custom writing, editing, skipping, undo, dedicated local demo versions and HTML export. It uses only `cm-guided-preview.*` storage keys. Version 4 replaces the original written mock options with 14 full source pools. `build-array-pools.cjs` creates the reproducible `array-pools.json` snapshot; every source is recorded in `context/array-sources.md`. Entries and duplicates retain their original wording and order, while Try another avoids an immediate identical repeat. Known mock choices are removed from old preview drafts and versions; user-written details are preserved and labeled Your wording. It does not migrate production saves or replace the existing generation engines.

Motion includes pointer and keyboard press compression, short release feedback, a settling highlight on accepted details, and gentle suggestion transitions. Reduced-motion preferences disable transforms, animations and smooth scrolling.

Browser validation covered the three-question journey, suggestion replacement without changing accepted details, custom text escaping, skip, undo, editing with focus return, saved versions, reload persistence, HTML export, desktop and 375/390/768px layouts, first-screen mobile actions, keyboard feedback, reduced motion and production-storage isolation. The published preview was independently checked at desktop and 375px, with no runtime errors.

`resume.json` records the remote IDs, exact source context and fingerprints for continuing the design. `tmp/` holds temporary working files and browser checks and is ignored by Git.

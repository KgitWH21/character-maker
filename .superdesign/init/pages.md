# Page dependencies

No modules, framework or package manifest. `index.html` loads globals in script order. Local scripts use prior globals. The same dependency set supports every view.

## / — Character Maker
Entry: `index.html`
Dependencies:
- `style.css`
- `original-data.js`
- `additions.js`
- `core.js`
- `right-now-data.js`
- `right-now.js`
- `languages.js`
- `dialogue-data.js`
- `dialogue.js`
- `medical.js`
- `character-canvas.js`
- `character-tools.js`
- `app-updates.js`
- `app.js`
- `manifest.webmanifest`
- `icon.svg`
- `icons/icon-192.png`
- `icons/icon-512.png`
- `sw.js` (offline registration from app)

## build
Entry: `index.html` → `app.js`
Purpose: Foundation, suggestion candidate and accepted details.
Shared dependency tree: all files listed above.

## quick
Entry: `index.html` → `app.js`
Purpose: Customizable generated field assortment.
Shared dependency tree: all files listed above.

## full
Entry: `index.html` → `app.js`
Purpose: All generated character sections.
Shared dependency tree: all files listed above.

## dialogue
Entry: `index.html` → `app.js`
Purpose: Dialogue habits, wildcards and kept recipe.
Shared dependency tree: all files listed above.

## now
Entry: `index.html` → `app.js`
Purpose: Moment prompts and fictional information states.
Shared dependency tree: all files listed above.

## medical
Entry: `index.html` → `app.js`
Purpose: Measurements, medical history and food prompts.
Shared dependency tree: all files listed above.

## sheet
Entry: `index.html` → `app.js`
Purpose: Kept snapshots and notes.
Shared dependency tree: all files listed above.

## saved
Entry: `index.html` → `app.js`
Purpose: Local saved snapshots and backup controls.
Shared dependency tree: all files listed above.

## history
Entry: `index.html` → `app.js`
Purpose: Recent rolls and changes.
Shared dependency tree: all files listed above.

## connections
Entry: `index.html` → `app.js`
Purpose: Connected independent profiles and relationship notes.
Shared dependency tree: all files listed above.

## pressure
Entry: `index.html` → `app.js`
Purpose: Dilemmas, authored responses and kept situations.
Shared dependency tree: all files listed above.

## brief
Entry: `index.html` → `app.js`
Purpose: Printable character brief and export.
Shared dependency tree: all files listed above.

The runtime globals separate generator state and date logic (`core.js`), field pools and relationships (`right-now.js`, `dialogue.js`, `medical.js`, `languages.js`), canvas candidate selection (`character-canvas.js`), workshop/history and brief (`character-tools.js`), and installed update lifecycle (`app-updates.js`).

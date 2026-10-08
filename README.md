# Character Maker

A lightweight, offline-capable character generator built from Keith's Story Spinner elements. No build tools, API keys, account, or paid service are needed on GitHub Pages.

## Publish on GitHub Pages

1. Extract `character-maker.zip`.
2. Open the `character-maker` folder. Upload **the files inside it** to the root of your GitHub repository. `index.html` should be at the root, with `icons` beside it.
3. On GitHub, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select **main** and **/ (root)**, then Save.
6. Open the Pages URL GitHub provides once publication finishes.

All asset URLs are relative, so the app works at both a domain root and a repository path such as `/character-maker/`.

## Install on a phone

- **iPhone / iPad:** open the published URL in Safari → Share → Add to Home Screen. Enable Open as Web App if offered.
- **Android:** open it in Chrome → Install app, or use the browser menu's Install / Add to Home screen action.
- Open online once and wait for “Ready for offline use.” The character generator then works offline. First-time setup, source downloads, and external reference links need a connection.
- A ZIP alone isn't a native phone installer. Publish the extracted files, then install from that URL.

## Use

- **Roll character:** rolls every unlocked field and shuffles focus.
- **Shuffle focus:** changes highlighted fields while keeping every rolled value.
- **Quick Sketch / Full Character:** two views of the same character. Choose which fields appear in Quick Sketch.
- **Focus:** manually highlight or fade a field. Faded results stay readable and usable.
- **Lock:** keep a value during future rolls.
- **Keep:** copy the current value into My Sheet. This captures a snapshot; rerolling the field won't replace what you've kept. Remove and Keep again to capture a new roll. Applying an edit to a kept field updates its kept value.
- **Save character:** saves a new snapshot with all rolls, settings, and notes on this device. You can save multiple versions under the same name.
- **Export all / Import backup:** transfer saved characters and your current working draft between devices.
- Saved state is device-local. Clearing browser/site data removes it; export backups to keep your work.

## Birthday logic

A year-only story setting displays the age the character turns that year. An exact story date displays their age on that day. Changing the story year recalculates age without changing their birthday. New birthday rolls use the original age-range definitions. Gregorian years 1–9999 are supported; birth years before year 1 aren't generated.

Western sun signs use common approximate date ranges and don't calculate astronomical cusp times. Chinese zodiac uses the browser's built-in Chinese calendar, with Lunar New Year as the changeover and the heavenly-stem year element (Wood, Fire, Earth, Metal, Water). It includes Yin / Yang and the stem name. Ancient and distant future dates are calendar extrapolations. This isn't a full BaZi chart; some traditions use a different year boundary. Birthstone and flower associations vary by tradition.

Adult intimacy is opt-in and available for characters aged 18+. A character who turns 18 in a year-only setting needs an exact story date before this field is generated, since they might still be 17.

## Original data preservation

`character_elements.json` is byte-for-byte unchanged from:

https://github.com/KgitWH21/storyspinner25/blob/main/character_elements.json

Source Git blob SHA: `b48148c3b6106edd33de367534e1d052495c9ba3`.

All original wording, capitalization, repeated entries, and array order remain. Repeated entries retain their weighting. `original-data.js` is a JSON-equivalent JavaScript wrapper so the app can also open directly from a local file without fetching JSON. Each original list is used by the generator. The alive and deceased parent pools are combined for separate maternal and paternal rolls. Every original age range remains available. Tarot retains upright / reversed meanings and all layouts; arc rolls draw three different cards.

Additions live in `additions.js`. Customize those lists freely. If you edit `character_elements.json`, regenerate the wrapper with:

```sh
node -e "const fs=require('fs');fs.writeFileSync('original-data.js','window.ORIGINAL_ELEMENTS = '+JSON.stringify(JSON.parse(fs.readFileSync('character_elements.json','utf8')))+';\\n')"
```

## Files

`index.html`, `style.css`, `app.js`, `core.js`, `additions.js`, `original-data.js`, `character_elements.json`, `manifest.webmanifest`, `sw.js`, `icon.svg`, and the PNG files in `icons/` are the app. This README and `character-maker.zip` are optional on your GitHub site. No external fonts or runtime dependencies are used.

## App updates

When updating cached app files, bump `VERSION` in `sw.js` (for example, `character-maker-v2`), republish, open online, and close all app tabs/windows once the update is ready. Reopen to activate the new version. Export a backup before clearing site data.

## Calendar references

- https://www.hko.gov.hk/en/gts/time/stemsandbranches.htm
- https://www.hko.gov.hk/en/gts/time/12animals.htm
- https://www.hko.gov.hk/en/education/astronomy-and-time/time-service/00506-what-year-is-it-today.html

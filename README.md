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

Start with **Build a Character**, the default for new users, or **Quick Snapshot** for the
existing compact assortment. Returning users keep their selected view. Both paths use
one shared character. The identity foundation shows birth date and age, gender, and
heritage/origin; the name above it is optional. Only kept details appear below it.

- **Add characteristic:** shows one stored candidate from the remembered category.
- **Keep:** accepts its current value for the canvas and My Sheet.
- **Another:** proposes a different unaccepted field in that category; it changes no values.
- **Reroll Value:** rolls the same proposed field using existing locks and dependency rules.
- **Dismiss:** closes the candidate and accepts nothing.
- **Explore section:** opens that field in a deeper panel; the sticky Back to Character
  button returns to the canvas. Keep in any view also adds it to the canvas.

Suggestions prefer highlighted fields and avoid repeat offers within a cycle. Surprise me
selects an eligible category first with equal odds, then a field within that category.
When highlighted candidates run out, explicitly choose Shuffle focus or Include remaining
faded. When a cycle runs out, start a new cycle. You can always select another category.
Nothing is accepted automatically; acceptance and focus remain separate.

Accepted cards display kept snapshots, independent of current background results and focus.
Their Edit button edits only the accepted snapshot. Replace with current result deliberately
captures the latest background value; Remove unkeeps the detail in both canvas and My Sheet.
Locks protect the background field against rolls. Age-ineligible adult snapshots are retained
but unavailable in the visible canvas/sheet until eligibility is restored.

Use **Explore / tools** for Full Character, Dialogue Style, Right Now, My Sheet, and Saved.
The **Actions** menu contains Roll character, Shuffle focus, and New character. New character
clears the current draft, its locks, acceptance, name, and notes, and rolls a fresh foundation
and background. It asks for confirmation when accepted details or notes would be discarded.
Saved snapshots remain untouched; story/roll preferences, category choice, and customized
snapshot fields carry over. Save character always creates a new saved snapshot.


- **Roll character:** rolls every unlocked field and shuffles focus.
- **Shuffle focus:** changes highlighted fields while keeping every rolled value.
- **Build a Character / Quick Snapshot / Full Character:** views of the same character. Choose which fields appear in Quick Snapshot.
- **Focus:** tap/click a field’s label, value, or card background to highlight or fade it, or use its Focus button. Buttons and editing controls keep their own actions. Faded results stay readable and usable.
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

All original wording, capitalization, repeated entries, and array order remain. Repeated entries retain their weighting. `original-data.js` is a JSON-equivalent JavaScript wrapper so the app can also open directly from a local file without fetching JSON. Original lists remain available in the source files. The former family-status field now draws from the added family-connection pool instead of the original marital-status entries. The alive and deceased parent pools are combined for separate maternal and paternal rolls. Every original age range remains available. Tarot retains upright / reversed meanings and all layouts; arc rolls draw three different cards.

Additions live in `additions.js`. Customize those lists freely. The `human_distinctive_features` array adds 64 human features to the existing Distinctive Features field, including facial details, hair, hands, scars, tattoos, accessories, and posture. Its roll and selection menu use the original entries followed by these additions; original duplicates retain their relative weighting. If you edit `character_elements.json`, regenerate the wrapper with:

```sh
node -e "const fs=require('fs');fs.writeFileSync('original-data.js','window.ORIGINAL_ELEMENTS = '+JSON.stringify(JSON.parse(fs.readFileSync('character_elements.json','utf8')))+';\\n')"
```

## Files

`index.html`, `style.css`, `app.js`, `core.js`, `additions.js`, `right-now-data.js`, `right-now.js`, `dialogue-data.js`, `dialogue.js`, `character-canvas.js`, `original-data.js`, `character_elements.json`, `manifest.webmanifest`, `sw.js`, `icon.svg`, and the PNG files in `icons/` are the app. This README and `character-maker.zip` are optional on your GitHub site. No external fonts or runtime dependencies are used.

## App updates

When updating cached app files, bump `VERSION` in `sw.js` (for example, `PREFIX+'v3'`, retaining the scope prefix), republish, open online, and close all app tabs/windows once the update is ready. Reopen to activate the new version. Export a backup before clearing site data.

## Calendar references

- https://www.hko.gov.hk/en/gts/time/stemsandbranches.htm
- https://www.hko.gov.hk/en/gts/time/12animals.htm
- https://www.hko.gov.hk/en/education/astronomy-and-time/time-service/00506-what-year-is-it-today.html

## Right Now

Right Now describes one fictional moment in seven sections: Here & Now, Body & Device,
Media (two independently editable records), Conversation, Last Seen (two sightings),
Stated Status, and Immediate Context. Every slot shares the existing field state and
Focus, Lock, Keep, Edit, and Reroll controls. Quick Snapshot defaults include spot,
activity, immediate goal, next action, and stated status; Choose snapshot fields can
include any slot. Existing customized sketches are preserved.

All readings, communications, observations, and statuses are invented locally. There
are no sensor, location, health, account, or external API integrations.

- **Footprint archetype** changes source availability and recency probabilities on
  subsequent rolls. Random archetype selects one per full roll. It never defines
  personality or demographics. Changing this setting preserves current values.
- **Random focus** controls visual emphasis only, independently of source availability.
  Faded cards remain readable, editable, lockable, rerollable, and keepable.
- **Information states** distinguish No device / No source, Unknown, Unavailable,
  Outdated, Concealed, and Conflicting. Missing sources are usable scene prompts.
- **Known to whom?** is an optional presentation setting. Observer views label private
  experience and unsourced context unavailable; camera observations cannot reveal
  thoughts. Author details remain accessible in explicitly labeled edit panels.
  Changing perspective never deletes values. My Sheet preserves the snapshots you
  explicitly kept, including author details kept in an earlier perspective.
- **Independent** mode is the default. **Connected moment** coordinates broad setting,
  specific spot, activity, conversation partner/method, and goal/next action. Rerolling
  a parent may update unlocked dependent slots. Locked conflicts are preserved and
  flagged for curation. Device availability always gates current readings in both modes.
  A locked old reading stays in author details but cannot appear as a current reading
  without an available device. Status words follow their type; subjective contradictions
  are intentionally not resolved.

`right-now-data.js` contains clearly named pools (including `stated_status_physical`,
`stated_status_emotional`, `stated_status_availability`, and `stated_status_intention`),
location/activity rows, goal/action mappings, and editable archetype probabilities.
`right-now.js` contains field definitions, stable `now.*` IDs, generation, migration,
and perspective rules. Perception frames sample original trait and story-descriptor
arrays without changing entries or duplicate weights. Supplementary descriptors have
separate contextual arrays. Add entries to these new files rather than changing the
original data.

New settings, values, source states, focus, locks, and kept snapshots survive save,
export, and import. Version 1 backups remain supported. Missing Right Now fields are
initialized once and persisted for both workspace and saved snapshots. Existing
profile values, notes, locks, kept details, and customized sketches are preserved.

## Verify and package

Run `node verify.cjs` for dependency-free state/data regression checks. Optional browser
checks are in `verify-browser.cjs`; run with `PLAYWRIGHT_MODULE` pointing to an installed
Playwright module and `CHROMIUM_EXECUTABLE` pointing to its Chromium binary if needed.
Neither is a runtime dependency. Run `python3 package-app.py` to regenerate the downloadable
ZIP from an explicit list of current files, excluding previous ZIPs and development files.

The service worker uses scope-specific cache version `v10`, including both Right Now
files. To update an installed phone app, publish the updated files, open the app online,
wait for the update-ready notice, close **all** tabs/windows for this app, and reopen.
No reinstall or storage clearing is needed. Export a backup before clearing browser data.

## Local preview updates

Run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`.
Localhost previews try the current files first on every reload and cache them for
offline fallback. Published sites continue to use the versioned offline cache.
If a previous service worker is still serving old code, open the preview online,
close every tab/window for that preview, then reopen it to activate the waiting update.
For an immediate fresh preview, use port 8001 instead. Different ports have separate
saved-character storage; your saves on port 8000 remain there.

## Family connection

The former Family Status field is labeled **Family connection** and now rolls from
`family_connection` in `additions.js`: 32 descriptions spanning estrangement, occasional
contact, practical support, weekly catch-ups, daily calls, and close involvement.
Contact frequency and emotional closeness can differ. This field does not determine
marital status or whether a character has children.

The stable field ID `background.family_status` is retained for compatibility. Existing
values, locks, kept snapshots, and sketch selections remain intact; reroll the field
or choose a new entry to use the revised pool. Original Story Spinner data is unchanged.

## Dialogue Style and Voice Sound

**Dialogue Style** is a new view of the same character state. Twelve independent cards
cover amount, sentence shape, register, word choice, profanity, spoken presentation,
message presentation, multilingual behavior, conversational behavior, thought-to-speech,
what is left unsaid, and a situational exception to one selected habit. There are 156
writing options: each has a stable ID, label, concrete instruction, and brief example.
Spoken and message conventions have their own cards. Italic emphasis appears visually
in examples and uses `*word*` notation in plain-text snapshots.

The original `CHARACTER_SPEECH` pool and stable field ID are retained under **Voice Sound**.
Dialogue Style precedes it in the full view. Every new field has independent Focus,
Lock, Keep, Reroll, and manual editing. Tap a card to toggle focus. Faded cards retain
all controls. Shuffle Focus changes no values or parameters. The examples illustrate
individual options; they are not a single coherent conversation. Choose which habits
belong to this character rather than applying every generated direction to every line.

New fields are available in Choose snapshot fields; the default sketch is unchanged.
The **Dialogue recipe** summarizes only kept dialogue/wildcard snapshots and kept Voice
Sound, with their instructions and scopes. It omits individual demonstration examples
for brevity. Copy recipe copies exactly that text; an empty recipe asks you to Keep
something. My Sheet retains full kept values including examples. Rerolls never replace
kept snapshots. As with existing fields, applying an edit to a kept detail updates its
kept snapshot.

Multilingual behavior initially references the existing Language field, not heritage.
On subsequent rolls it reads the current Language selection. Typing a language reference
in Edit creates an explicit manual override which survives rerolls. The Language reference
selector can return to using the character’s Language field. Switching still requires
established proficiency in a second language; it never adds one automatically. Bracketed
style examples are author-fillable templates. A situational card captures a baseline habit
and gives an exception for anger, fear, comfort, or authority; Edit lets you select which
habit it changes. Locks retain that captured baseline if other fields later change.

## Optional Dialogue Wildcards

Enable Optional Dialogue Wildcards to reveal one stored challenge, initially **No wildcard**.
Reroll or Edit it to choose a challenge; enabled challenges also roll with Roll character.
Combine two reveals a second independent slot. These toggles preserve stored values;
turning them off does not erase kept snapshots. A focused wildcard is an optional writing
suggestion, not an enforcement engine or a demand to combine all generated habits.

The 20 challenges cover forbidden letters, word budgets, exact sentence lengths, single
syllables, question/statement constraints, omitted pronouns or emotion names, indirectly
named subjects, concrete language, quotation, mandatory words, borrowed openings, shrinking
replies, language switches, emphasis, echo-and-turn, implication, delayed answers, and
vocabulary adoption. Each has a stable ID, exact rule, checked example, and configurable
scope: One reply, One conversation, or Recurring character habit. Parameters and optional
fictional reasons are in each card’s editor. No medical cause is assigned.

English letter, word-count, pronoun, and syllable constraints are labeled English. Counted
examples use whitespace-separated words without hyphenated compounds. Letter exclusions,
counts, and parameter compatibility are checked in verification. Syllables, grammar, and
semantic examples were checked manually; there is no automated judgment of your writing.
The English → Spanish switch example is illustrative only and assigns no proficiency.
Establish two languages before applying it, then adapt the example to those languages.

Random combined rolls avoid the declared incompatible pairs and parameter conflicts,
including incompatible locked counterparts. Deliberately selected or locked conflicts
remain in place with a warning. Conservative exclusions include Questions only + No
questions, Exact length + Shrinking replies, most additions to Quotation only, and mixed
language rules combined with English-only constraints. Parameter checks cover a mandatory
word containing the forbidden letter, an exact length exceeding a word budget, and certain
word/language restrictions. Other combinations depend on your scene and still need curation.
Individual examples demonstrate individual rules; they do not claim to demonstrate a combined
pair. Custom-edited challenges require manual compatibility review.

## Expand the dialogue pools

All new writing data is in `dialogue-data.js`, separate from original Story Spinner data:

- `dialogue_amount`, `dialogue_sentence_shape`, `dialogue_register`, `dialogue_word_choice`,
  and `dialogue_profanity`. `dialogue_constant_profanity` adds 12 options for profanity
  in every turn, repeated personal insults, profane commands, and continuous contempt.
  The Profanity field combines both editable arrays.
- `dialogue_speech_presentation` and `dialogue_message_presentation`.
- `dialogue_multilingual`, `dialogue_conversational_behavior`, `dialogue_thought_to_speech`,
  `dialogue_leave_unsaid`, and `dialogue_situational_change`.
- `dialogue_wildcards`, `wildcard_scopes`, `wildcard_reasons`, `wildcard_parameters`, and
  `counted_examples`.
- `wildcard_incompatibilities` contains pairs and their reasons. `wildcard_parameter_rules`
  names conditional checks implemented in `dialogue.js`. The checked single-syllable,
  pronoun, and emotion word lists are separate editable arrays.

Style rows have `[id, label, instruction, example]`; the helper prefixes each stable ID.
Wildcard objects have `id`, `label`, `rule`, `example`, and optional parameters/language.
Add options freely and keep existing IDs stable. Extend counted examples and their editor
bound together if supporting word counts beyond 12. `dialogue.js` holds generation,
parameter validation, migration, and compatibility logic. Rendering uses the existing
app cards and shared state in `app.js`.

Save/open, import/export, device-local storage, and My Sheet include every new field,
parameter, setting, focus/lock flag, and kept snapshot. Older backups initialize missing
dialogue fields once without regenerating their existing profile or Right Now values;
customized sketch selections remain intact. Service-worker version `v10` caches both new
scripts locally. The downloadable ZIP is regenerated from current sources.

`node verify.cjs` checks original data hashes, dialogue state/curation/migration, language
references, numeric/letter examples, and all declared incompatible pairs. The optional
Chromium script also exercises desktop and a 375px touch/mobile viewport, the real recipe
clipboard, wildcard editors, manual conflicts, save/export/import, and offline reload.

## Canvas storage and verification

`character-canvas.js` contains the editable category mappings and selection rules. Its
foundation IDs reference existing fields; accepted characteristics are the existing Keep
flags and `keptValue` snapshots, with no separate acceptance list. The canvas category,
seen-field cycle, faded-candidate choice, pending candidate, and selected view are saved and
exported with the draft. Restored candidates are checked for current eligibility. Older
backups use their existing kept details to populate the canvas and safely initialize its
settings without rerolling the existing profile. Kept traits outside a reduced trait-count
setting are retained too.

The dependency-free verification script checks category fairness, focus exhaustion, repeat
avoidance, eligibility, migration, and browsing without changing background values. The
Chromium browser checks exercise the actual A–F journeys: compact foundation, single candidate,
Keep/Another/Reroll/Dismiss, unlock, deeper exploration and Back, accepted editing and removal,
new-draft confirmation, saving, export/import, older saves, narrow touch layout, and offline
canvas operation. No runtime dependencies were added.

## Publish this update and prepare your phone

1. Run `python3 package-app.py` if changing files further. The included `character-maker.zip`
   already matches the current app.
2. Extract the ZIP and upload the contents of its `character-maker` folder to your existing
   GitHub repository root, replacing old files and including `character-canvas.js`. Keep the
   `icons` folder beside `index.html`. Upload `character-maker.zip` itself to the repository
   root too if you want the in-app download link to work.
3. In GitHub **Settings → Pages**, use **Deploy from a branch**, **main**, **/ (root)**. If that
   is already configured, uploading the files triggers the existing Pages deployment.
4. Wait for deployment to finish, then open the existing Pages URL online.
5. On your phone, open the installed app online. Wait for **App update ready**. Close **all**
   browser tabs and installed-app windows for this site, then reopen online to activate the
   waiting service worker (`v10`). If it has already activated, opening shows the new Build a
   Character navigation immediately.
6. Before traveling, reopen the app in airplane mode and try Add characteristic. All app files
   are local once cached. Saved characters remain in device-local storage; no reinstall or
   clearing browser data is needed.

## Copy fields to Google Docs

Every foundation field, candidate, generated card, accepted characteristic, and My Sheet
row has a Copy button. Paste normally into Google Docs to keep the field label as a
level-three heading and its value as a paragraph, including line breaks. Plain text
apps receive the label and value without HTML. Accepted cards and sheet rows copy
their kept wording; generated cards copy the currently displayed value. Copy sheet
uses the same heading/paragraph formatting for all kept details and notes.

Rich copying uses the browser clipboard API with a formatted copy fallback for older
browsers or local files. If formatting is unavailable, a plain text fallback is tried;
a failed copy shows a message. Copying does not change focus, locks, or kept details.

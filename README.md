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
- **Actions while scrolling:** a duplicate Actions menu stays at the bottom right on desktop and mobile. It has the same Roll character, Shuffle focus, and New character controls as the top menu. Tap outside or press Escape to close it.
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

`index.html`, `style.css`, `app.js`, `core.js`, `additions.js`, `right-now-data.js`, `right-now.js`, `dialogue-data.js`, `dialogue.js`, `character-canvas.js`, `medical.js`, `languages.js`, `character-tools.js`, `app-updates.js`, `original-data.js`, `character_elements.json`, `manifest.webmanifest`, `sw.js`, `icon.svg`, and the PNG files in `icons/` are the app. This README and `character-maker.zip` are optional on your GitHub site. No external fonts or runtime dependencies are used.

## App updates

When updating cached app files, bump `VERSION` in `sw.js` and `release` in `app-updates.js` together, rebuild the ZIP, and republish. Open online and use **Check updates**, then **Update & reload** when the notice appears. Apply open field edits before reloading. Your draft is persisted before reload, and saved characters remain in local storage.

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
checks are in `verify-browser.cjs` and `verify-updates-browser.cjs`; run with `PLAYWRIGHT_MODULE` pointing to an installed
Playwright module and `CHROMIUM_EXECUTABLE` pointing to its Chromium binary if needed.
Neither is a runtime dependency. Run `python3 package-app.py` to regenerate the downloadable
ZIP from an explicit list of current files, excluding previous ZIPs and development files.

The service worker uses scope-specific cache version `v15`, including both Right Now
files. To update an installed phone app, open it online and use **Check updates**.
When the update notice appears, apply open field edits and tap **Update & reload**.
Other app windows can remain open. No reinstall or storage clearing is needed.

## Local preview updates

Run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`.
Localhost previews try the current files first on every reload and cache them for
offline fallback. Published sites continue to use the versioned offline cache.
If an older service worker is still serving old code, open the preview online and
use Check updates, then Update & reload. A pre-v15 installed app may need a one-time
close and reopen after the new release finishes downloading.
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

Multilingual behavior references the main, second, and third Identity language fields.
Identity language edits refresh unlocked dialogue references without changing the chosen
habit. Typing a language reference in Edit creates an explicit manual override which
survives rerolls. The Language reference selector can return to the character’s language
fields. Switching requires two established languages. Bracketed style examples remain
author-fillable templates. A situational card captures a baseline habit and gives an
exception for anger, fear, comfort, or authority; Edit lets you select which habit it
changes. Locks retain that captured baseline if other fields later change.

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
customized sketch selections remain intact. Service-worker version `v15` caches both new
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
5. On your phone, open the installed app online and tap **Check updates**. When
   **App update ready** appears, apply open field edits, then tap **Update & reload**.
   The current release is `v15`. If a pre-v15 app still shows **Install app**, wait for the
   update to download, close it from Recent apps, and reopen online once.
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


## Medical

Open **Explore / tools → Medical**, choose the **Medical** candidate category, or find
Medical after Appearance in Full Character. Its eight fields share the normal Focus,
Lock, Keep, Copy, Edit, and Reroll controls. The calculated weight category has Focus,
Keep, and Copy; edit its source measurements to change it. Any medical field can be
added to Quick Snapshot without changing existing selections.

- **Precise height:** feet and inches (`5'7"`), total inches (`67 inches`), and centimeters
  (`170.18 cm`) show one measurement. Edit in feet/inches, inches, or centimeters.
  Appearance height rolls produce matching precise heights. Editing precise height
  updates unlocked Appearance height. If precise height is locked, full rolls fit the
  unlocked appearance description to it. Explicitly edited locked conflicts are
  preserved and explained in Medical. Height ranges are broad narrative conventions,
  scaled for children and teenagers, rather than population or clinical growth charts.
- **Weight:** edit pounds or kilograms; both display together. Rolls use height to
  produce a range of fictional weights, independently of appearance build.
- **Weight category:** Underweight, At ideal weight, Overweight, or Obese, based on
  unrounded BMI calculated from the stored measurements. “At ideal weight” names the
  adult BMI reference range; it does not establish an individual ideal or overall
  health. Adult human references apply only to Human characters with confirmed age
  20+. Other species, unknown ages, and younger characters stay unclassified; a
  year-only character turning 20 needs an exact story date.
- **Condition / medical history** and **Medications:** common conditions include asthma,
  seasonal allergies, hypothyroidism, and type 2 diabetes; rare prompts include sickle
  cell disease, cystic fibrosis, Wilson disease, and myasthenia gravis. None and Unknown
  are also available. Condition edits and rerolls update unlocked medication prompts;
  locked medication details are retained for review. Edit both fields to write multiple
  conditions or a custom history. Unknown custom conditions never infer a drug.
- **Last ate**, **Hours since last eating**, and **How they feel about what they ate**
  are independent scene details. Hours accept decimals, including zero.

`medical.js` holds the editable pools and relationship rules. Condition grouping and
random weights are storytelling choices, not prevalence estimates. Medication names
are modern reference prompts with no doses or complete treatment plans; adapt them to
the character’s age, circumstances, and story era. They do not assign symptoms,
personality, medication effects, or feelings about food. No health data is accessed.

Old workspaces and saved characters gain missing medical fields once while retaining
profile values, locks, notes, kept snapshots, and customized Quick Snapshot selections.
All medical values persist through save, export, import, and offline use. Kept values
remain accepted snapshots; changes to linked background values do not rewrite them.
The updated ZIP includes `medical.js`, and service-worker cache `v15` installs it offline.

Reference material used for the prompts:

- [CDC adult BMI categories](https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html)
- [MedlinePlus: albuterol](https://medlineplus.gov/druginfo/meds/a607004.html),
  [cetirizine](https://medlineplus.gov/druginfo/meds/a623043.html),
  [levothyroxine](https://medlineplus.gov/druginfo/meds/a682461.html), and
  [metformin](https://medlineplus.gov/druginfo/meds/a696005.html)
- [NHLBI: sickle cell treatment](https://www.nhlbi.nih.gov/health/sickle-cell-disease/treatment)
  and [cystic fibrosis treatment](https://www.nhlbi.nih.gov/health/cystic-fibrosis/treatment)
- [NIDDK: Wilson disease treatment](https://www.niddk.nih.gov/health-information/liver-disease/wilson-disease/treatment)
- [MedlinePlus: myasthenia gravis](https://medlineplus.gov/ency/article/000712.htm)


## Identity languages

**Main language** replaces the former Language label while retaining its stable
`extra.languages` ID. It follows National heritage when that field is edited or rerolled,
and rolls to the country default on a full character roll. For example, Japanese →
Japanese, Mexican → Spanish, French → French, and Singaporean → English. Every original
heritage entry has a mapping. Multilingual countries use one editable default selected
from a widely used national language or lingua franca; it is not an exclusive or
universal language assignment. US diaspora entries default to English; language learning
and family-language details can be authored explicitly. Custom heritage text leaves an
unlocked main language unestablished until you choose one.

**Second language** (`extra.language2`) and **Third language** (`extra.language3`) show
a distinct named language or **None**. A full roll with all three language fields unlocked
uses one probability draw:

| Languages | Chance |
| --- | --- |
| Main only | 55% |
| Main + second | 32% |
| Main + second + third | 13% |

Thus **45%** have a second language overall, including the **13%** with a third language.
The explicit requested 45% generation chance takes precedence over the separate 43%
figure in the brief. These are generation settings, not demographic estimates. Each
extra language is selected uniformly from the named language pool, excluding languages
already assigned to the other slots. Vague language prompts from the older pool are
excluded from automatic extra-language rolls.

Rerolling Main returns to its heritage default. Rerolling Second refreshes the additional
language pair with the same distribution; rerolling Third has a 13% chance of a language
and creates an unlocked missing Second when necessary. Setting Second to None clears
an unlocked Third. Selecting a Third fills an unlocked missing Second. Changes repair
unlocked duplicates. Locked conflicts remain visible for review; locks take precedence
over random probabilities. Manual language edits and locks allow a character to differ
from their country default. Kept details remain accepted snapshots, including when a
heritage edit updates the background main language.

All three fields share Focus, Lock, Keep, Copy, Edit, and Reroll controls and are available
in Quick Snapshot selection, My Sheet, saves, exports, imports, and offline use. Dialogue
Style and language-based wildcard references use all established language slots, omitting
None. Unlocked references follow Identity edits; manual dialogue overrides, locks, and
kept recipes retain their captured text.

On the first load of an older character missing both additional fields, its unlocked
main language is synced to heritage, and Second/Third are initialized once. Existing
locks, kept snapshots, notes, and Quick Snapshot choices survive. Subsequent loads keep
the established values. Customize the mappings and named language pool in `languages.js`.
Service-worker cache `v15` and the current downloadable ZIP include this file.

Country-language reference examples: [Singapore Department of Statistics census language
tables](https://www.singstat.gov.sg/publication-resources/singapore-census-of-population-2020-statistical-release-1-demographic-characteristics-education-language-and-religion)
and [Swiss Federal Department of Foreign Affairs language overview](https://www.aboutswitzerland.eda.admin.ch/en/language).


## Undo, roll history, and the character workshop

Explore / tools now includes **Undo & roll history**, **Connected characters**,
**Put them under pressure**, and **Finished character brief**. All four run locally and
work offline. Character saves and JSON backups include relationships, pressure
situations, scene responses, and brief settings / portrait.

### Undo and roll history

Both Actions menus include **Undo**, **Redo**, and **Roll history**. Undo restores the
working draft, including rolled values, locks, focus, kept snapshots, notes, settings,
and workshop content. It also recovers a draft replaced by New character or by opening
a saved / connected character. Redo reapplies the change. Changes made after Undo begin
a new branch. Field dependency updates are restored together, not rerolled.

Use Ctrl/Cmd+Z to undo, Ctrl/Cmd+Shift+Z or Ctrl+Y to redo when outside text inputs.
Inside an input or textarea, normal text editing keeps its own undo behavior. Recent
keystrokes in the same name, notes, relationship, or scene editor are grouped together.
View changes and candidate browsing do not create history entries.

The history panel separates **Recent rolls** from **Recent changes**. Character rolls,
field rerolls, New character, and generated pressure situations appear under rolls.
Restore opens that complete earlier draft, and the restoration itself can be undone.
History retains up to 20 changes plus 8 roll snapshots, pruning older entries to stay
within an approximate 1.8 MB serialized history budget. Large portraits or large casts
can reduce that count. The working draft is stored separately.

History survives reloading on this device. It is local recovery data and is not included
in character JSON exports or backups; use Save character for permanent versions.
Undo affects the draft only. Saving, importing, or deleting saved snapshots remains
separate, so Undo never deletes a saved character or reverses a backup import.

### Connected characters

Choose Sibling, Rival, Partner / ally, Coworker, Friend, or Mentor; optionally name them;
then generate a new character or select an existing saved snapshot. Each connection has
a full independent character profile, a shared event, what each person remembers, and
a current tension. These are editable story possibilities, not forced facts about a
real person. A generated sibling shares the current character’s heritage and birthplace;
a generated coworker shares occupation. Kept source snapshots take precedence over
background rolls for those shared details. Generated personality differs independently.
An existing saved source keeps its own identity and background.

Expand **Shared history & two perspectives** to edit the relationship and name.
**Copy relationship** copies a writing reference. **Save current & open** first saves a
snapshot of the current character, then opens the connected profile as a new draft with
its relationship notes. Undo returns to the original draft; the protective saved snapshot
remains. Generating or editing a connection never edits its saved source. Connected
profiles are captured copies, not live links. Up to 12 connections can be kept per draft.
Nested casts are flattened inside copied connection profiles to keep backups finite.

### Put them under pressure

Generate a small dilemma with a concrete setup, a choice, possible stakes, and a question
about the response. The generator captures up to three kept motivations, traits, flaws,
or immediate goals / obstacles. It may suggest involving an existing connection.
Background rolls are not silently treated as accepted personality. Without relevant kept
details, the prompt remains open for the author to interpret. The app does not choose a
reaction, change personality, or resolve the scene for you.

Write their response, then **Keep situation** to retain it. Another situation replaces
the candidate while preserving kept situations and their captured character details.
Responses can still be edited after keeping. Copy a situation for a writing session or
include kept situations in the brief. Up to 12 situations can be kept per draft.

### Finished character brief

The brief uses the identity foundation and kept snapshots, including earlier accepted
wording after background rerolls. Add an optional one-line introduction and a PNG, JPEG,
or WebP portrait up to 250 KB. Portraits remain local and travel with JSON character
exports. SVGs and external image URLs are not accepted.

Choose **All kept details** or **Compact reference**. Compact includes the first two
kept details from each of the first eight represented groups, and explicitly reports
how many details it omits. It never removes them from the character. Include or exclude
notes, connected relationships, and kept pressure situations. Age-ineligible adult
intimacy snapshots are omitted from the brief.

- **Copy brief** provides formatted HTML and plain text for a document editor.
- **Print / Save PDF** opens the browser’s print dialog with a clean paper layout.
  The app navigation, form controls, and floating Actions menu are hidden when printing.
- **Download HTML** creates a standalone printable document with its styles and portrait
  embedded. It works without the app or a network connection.

A short compact brief can fit on one page; longer kept text flows across pages without
being truncated. The complete brief remains visible for review before printing.

`character-tools.js` contains the history limits, relationship and pressure pools,
workshop validation, and standalone brief renderer. Browser verification covers full
undo/redo/restore journeys, generated and existing connected profiles, protected opening,
scene responses, portrait validation, HTML/clipboard/PDF output, history reloads, JSON
round trips, mobile layout, and offline use. Service-worker cache `v15` includes this file.


## Installed phone app updates (v15)

The installed app now labels its top button **Check updates**. The same action is
available in How to use and at the bottom of the page. Normal browser tabs retain
**Install app** for installation. A release number is visible in the footer.

The app checks on launch, when brought back to the foreground, when a frozen page is
restored, and when connectivity returns. Automatic checks are limited to one per minute;
a manual Check updates bypasses that interval. The service worker script bypasses the
HTTP cache, and every new release’s offline files are fetched fresh before activation.

A completely downloaded update activates even while another app window or browser tab
is open. The running page continues with its existing code and shows a persistent
**App update ready** panel. It does not unexpectedly reload an open editor. Apply your
field edits, then tap **Update & reload**. **Later** hides the panel while you finish;
Check updates can bring it back. Reload first persists the working draft, saved snapshots,
and local history. If persistence fails, reload is blocked and the app asks you to export
before proceeding. Updates never clear local storage or reinstall the app.

An interrupted or incomplete download leaves the previous release active. Offline checks
explain that the current app remains available. An offline reload uses the last fully
cached release. Old cache deletion remains limited to this app’s own scope.

For a phone stuck on a pre-v15 release, open it online to download this fix, close it
from Recent apps, and reopen once. Future updates use Check updates and Update & reload.
You do not need to remove the home-screen icon or clear Chrome’s site data.

`verify-updates-browser.cjs` runs a separate production-style cache-first upgrade test,
starting with the actual v14 service worker and page from commit `737ccd6`. It keeps a
second window open, simulates installed display mode, upgrades through successive
releases despite HTTP caching, checks unapplied editor text, blocks reload on a simulated
storage error, preserves drafts and saved characters, reopens offline, and detects the
next release when brought to the foreground. This upgrade test requires a Git checkout
containing commit `737ccd6`.

Update lifecycle references: [MDN registration.update](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update),
[updateViaCache](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/updateViaCache),
and [skipWaiting](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting).

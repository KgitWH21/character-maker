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

The default **Character** workspace is a guided builder with three optional questions:

1. **Who are they?** combines age, heritage, a personality trait, gender, species and occupation.
2. **What do they want?** combines a motivation, another trait, an influence and an event.
3. **What gets in their way?** combines a story descriptor, a trait and an obstacle source.

Every ingredient comes from the current character arrays or an explicit author edit. Sentence
connectors adapt the grammar; the ingredient panel retains the original pool wording. Duplicate
entries keep their weighting except species: automatic rolls use 90% Human, with the remaining
10% shared by other kinds. Manual selection and locks can choose any original kind. Influences can draw from homeland, family status, allies, enemies,
organizations or formative trauma. Obstacles can draw from events, organizations, enemies,
abilities, skills, either parental figure, occupation, motivations or flaws. Parent fields combine
the existing alive/deceased arrays. The composed family ingredient uses the requested original
`background.family_status` pool; the full generator retains its added family-connection pool.

- **See ingredients:** inspect the elements in a sentence. Click an element directly or use
  its Edit button to choose a pool entry or write a custom value. Click the age to enter years directly or choose a birth date. Who are they? draws from
  all age ranges, with equal chance per range, independently of the full-roll age setting.
- **Reroll an ingredient:** change just that element. **Hold** preserves an element during
  Try another. Existing generator locks also apply; kept facts stay stable across suggestions.
- **Change the pool:** influence and obstacle selectors let you choose which existing category
  supplies that element.
- **Add to character:** accepts the sentence and its ingredient snapshots into the same character
  used by the original generator, sheet and writing tools. The builder then suggests the next question.
- **Try another:** proposes a fresh combination while retaining kept, held and locked values.
  It never replaces an accepted sentence. Edit a kept ingredient and choose Update character to
  deliberately change that fact; related composed sentences follow an explicit accepted edit.
- **Write my own:** accepts your sentence without silently treating the proposed ingredients as
  character facts. **Skip for now** advances without accepting anything.
- **Your character:** shows accepted sentences and other kept details. Edit revisits a sentence's
  ingredients. On phones, expand **Your sketch** to see the details and notes.

After the three questions, four randomly selected Explore categories provide paths
into deeper development. You can preview and export at any time; no chapter is compulsory.

**Story tools** opens Right Now, Connected characters, Put them under pressure, and Dialogue.
**Library** holds saved versions, JSON export and backup import. **Browse all details** opens
Quick Snapshot, Full Character, the dedicated detail pages listed below, My Sheet,
History, and the retained one-detail builder.
All views share one character. Existing Focus, Lock, Keep, Copy and field editors remain available
in those detailed views. The app menu contains installation/help, story settings, Roll character,
Shuffle focus, New character, Undo/Redo and History.

The draft saves automatically on this device. **Save version** creates a permanent local snapshot;
you can keep multiple versions with the same name. Undo/Redo restores composed prompts, ingredient
edits, acceptance and their linked character changes together. Saves and JSON backups include the
builder state. Older characters gain an empty guided builder without changing their existing fields,
locks, kept wording or notes. A new character resets the builder and asks before discarding accepted
work; saved versions remain available.

Button presses have brief tactile motion, suggestions reveal gently, and newly accepted details
settle into the sketch. Reduced-motion preferences disable these effects. All app features remain
offline-capable, with no runtime dependencies or external fonts.

Saved state is device-local. Export a backup before changing devices or clearing browser data.

## Birthday logic

A year-only story setting displays the age the character turns that year. An exact story date displays their age on that day. Changing the story year recalculates age without changing their birthday. New birthday rolls use the original age-range definitions. Gregorian years 1–9999 are supported; birth years before year 1 aren't generated.

Western sun signs use common approximate date ranges and don't calculate astronomical cusp times. Chinese zodiac uses the browser's built-in Chinese calendar, with Lunar New Year as the changeover and the heavenly-stem year element (Wood, Fire, Earth, Metal, Water). It includes Yin / Yang and the stem name. Ancient and distant future dates are calendar extrapolations. This isn't a full BaZi chart; some traditions use a different year boundary. Birthstone and flower associations vary by tradition.

Adult intimacy is opt-in and available for characters aged 18+. A character who turns 18 in a year-only setting needs an exact story date before this field is generated, since they might still be 17.

## Character data sources

The original baseline for `character_elements.json` came from:

https://github.com/KgitWH21/storyspinner25/blob/main/character_elements.json

Original baseline Git blob SHA: `b48148c3b6106edd33de367534e1d052495c9ba3`.

The current JSON includes your expanded editable arrays. Entries retain their wording, capitalization and order; duplicates retain their weighting. The application does not rewrite or deduplicate your source arrays. `original-data.js` is a JSON-equivalent JavaScript wrapper so the app can also open directly from a local file without fetching JSON. Original lists remain available in the source files. The former family-status field now draws from the added family-connection pool instead of the original marital-status entries. The alive and deceased parent pools are combined for separate maternal and paternal rolls. Every original age range remains available. Tarot retains upright / reversed meanings and all layouts; arc rolls draw three different cards.

Additions live in `additions.js`. Customize those lists freely. The `human_distinctive_features` array adds 64 human features to the existing Distinctive Features field, including facial details, hair, hands, scars, tattoos, accessories, and posture. Its roll and selection menu use the original entries followed by these additions; original duplicates retain their relative weighting. After editing `character_elements.json`, run `python3 package-app.py`. Packaging automatically regenerates `original-data.js` from the JSON before building the ZIP. For a local preview without packaging, regenerate the wrapper with:

```sh
node -e "const fs=require('fs');fs.writeFileSync('original-data.js','window.ORIGINAL_ELEMENTS = '+JSON.stringify(JSON.parse(fs.readFileSync('character_elements.json','utf8')),null,2)+';\n')"
```

`original-data.js` uses two-space indentation with one array entry per line. Both regeneration methods preserve this formatting. For changes that survive packaging, edit `character_elements.json`; direct edits to `original-data.js` are replaced the next time it is regenerated.

## Files

`index.html`, `style.css`, `guided.css`, `guided-builder.js`, `guided-ui.js`, `app.js`, `core.js`, `life-data.js`, `character-life.js`, `criminal-history.js`, `additions.js`, `right-now-data.js`, `right-now.js`, `dialogue-data.js`, `dialogue.js`, `character-canvas.js`, `medical.js`, `languages.js`, `character-tools.js`, `app-updates.js`, `original-data.js`, `character_elements.json`, `manifest.webmanifest`, `sw.js`, `icon.svg`, and the PNG files in `icons/` are the app. This README and `character-maker.zip` are optional on your GitHub site. No external fonts or runtime dependencies are used.

## App updates

Before publishing JSON pool edits, regenerate `original-data.js` using `python3 package-app.py`; the browser loads that JavaScript wrapper. Publish both files along with the updated service worker and release marker. Existing character results stay as saved until you reroll an unlocked field or choose an entry in Edit.

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

The service worker uses scope-specific cache version `v31`, including both Right Now
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
customized sketch selections remain intact. Service-worker version `v29` caches both new
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
   The current release is `v29`. If a pre-v15 app still shows **Install app**, wait for the
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
The updated ZIP includes `medical.js`, and service-worker cache `v29` installs it offline.

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
Service-worker cache `v29` and the current downloadable ZIP include this file.

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
round trips, mobile layout, and offline use. Service-worker cache `v29` includes this file.


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


## Guided builder implementation and verification (v16)

`guided-builder.js` defines the multi-array recipes, source ingredients, sentence composition and
backward-compatible builder migration. `guided-ui.js` connects the responsive workspace and ingredient
editors to the existing app state, history and exports; `guided.css` supplies its layout and motion.
The service worker and downloadable ZIP include all three files.

Run `node verify.cjs` and `node verify-guided.cjs` for the dependency-free checks. With Playwright
installed, run `node verify-guided-browser.cjs`, `node verify-browser.cjs` and
`node verify-updates-browser.cjs`. Browser scripts accept `PLAYWRIGHT_MODULE` and
`CHROMIUM_EXECUTABLE` overrides. The update test also requires legacy commit `737ccd6`.

The composed-builder checks cover source provenance, ingredient edits/holds/pool changes, kept facts,
atomic undo/redo, old/new saves, custom writing, source escaping, HTML export, mobile controls,
reduced motion and offline reload.


## Education, relationships, and accepted identity (v17)

**Identity details** stays blank until its details are accepted with **Add to character**
or **Keep**. It displays the accepted snapshots, so background rerolls do not replace
established identity. The finished brief follows the same accepted-only rule. Custom
whole sentences do not implicitly accept the proposed identity ingredients.

**Browse all details → Education & Training** contains seven fields: overall education,
college subject, graduate subject, doctoral subject, current education status, trade or
specialty training, and feelings about education. The level spectrum covers no formal
schooling, school in progress, high school dropout, diploma/GED, unfinished college,
vocational/apprenticeship credentials, associate, bachelor’s, graduate certificate,
master’s, professional, and doctoral degrees. Current status includes enrollment, leave,
breaks, funding delays, administrative holds, transfers, thesis work, and awaiting conferral.
Subjects, trades, enrollment statuses, and education feelings are editable arrays in
`life-data.js`; feelings can also draw from the original personality traits.

Automatic completion ages and education weights are fiction conventions, not demographic
estimates. Degree subjects follow the overall level. Editing an established subject can
promote an unlocked overall level. Explicit None/Unknown subject edits are allowed.
Locked conflicts remain available for the author to review. Kept snapshots remain separate
from subsequent background repairs.

**Browse all details → Relationships & Family** adds longest/current relationship duration,
first serious relationship, first marriage/divorce, current status from romantic entries
in the original `background.family_status` array, children (including Unknown), relationship
behavior from traits, and a current-relationship viewpoint made from the original
`STORY_DESCRIPTOR` and `BASIC_EVENT` arrays. The full original status list remains available
to adult authors in Edit; nonromantic/custom statuses can have unknown romantic metrics.
Current single status produces Not applicable for current relationship ratings. Durations
support hours, days, weeks, months, and years; longest-relationship rolls use hours, days,
or years. Dates and durations stay within the available age timeline, and longest duration
covers the current relationship. Manual edits and locks allow deliberate exceptions.

For confirmed adults (18+), this category also includes first sexual experience, partner
count (0–10, Too many to count, or Unknown), sexual attitudes, perceived attractiveness,
author-rated attractiveness, sexual compatibility, and the existing opt-in **Adult intimacy**
field. Its toggle is also available at the top of Relationships & Family and stays synced
with Roll settings. First-experience age draws start at 18. Attractiveness ratings are subjective fictional
viewpoints, on a 0–10 scale. These fields are omitted for minors from suggestions, category
cards, accepted details, My Sheet, copy output, and the finished brief. Teenagers age 13+
receive nonsexual relationship prompts; children receive no relationship-detail prompts.
Adult histories are never generated with under-18 sexual ages. A year-only age must establish
that the character is already 18; an exact story date permits the precise eighteenth birthday.

Each current relationship area has F, D, C, B, A, or S-tier: shared values, communication,
financial compatibility, sexual compatibility (adults), and willingness to stay. The overall
rating is the rounded average of the available area ranks. Unknown or nonapplicable areas
are excluded. Change the areas to change the overall rating.

Every new detail participates in Focus, Lock, Keep, Copy, Edit, Reroll, one-detail suggestions,
Quick Snapshot selection, undo/redo, saves, JSON import/export, briefs, and offline use.
Calculated overall rating has Keep/Copy/Focus; change its contributing areas to edit it.
Older characters initialize missing fields once and retain existing values, locks, snapshots,
notes, and custom selections. `character-life.js` contains the generation and consistency
rules. Neither original source array data nor existing accepted identities are rewritten.

### Demographic references and their limits

Marriage defaults use the ONS **England 2025** all-persons age bands in Table 1 of
[Population estimates by marital status and living arrangements, England](https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/populationestimatesbymaritalstatusandlivingarrangementsengland/current),
published 31 July 2026 (`maritalstatuslivingarrangements2002to2025england.xlsx`). This is
an England reference, not a worldwide marriage rate. Civil partnerships are included.

| Age band | Never married / civil partnered | Married | Civil partnered | Divorced | Widowed | Ever legally partnered draw |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 18–24 | 4,812,716 | 73,560 | 14,344 | Suppressed | Suppressed | 1.79% lower bound |
| 25–44 | 7,983,045 | 7,406,972 | 161,668 | 392,259 | 29,991 | 50.02% |
| 45–64 | 2,851,538 | 9,698,602 | 163,443 | 1,759,900 | 294,781 | 80.69% |
| 65+ | 801,946 | 6,459,125 | 54,330 | 1,551,679 | 2,367,312 | 92.86% |

The generation probability is the observed ever-partnered count divided by the known
band total. Suppressed youngest-adult divorce/widow counts are excluded, making that
estimate a lower bound. First-marriage ages are fictional uniform draws from 18 through
the smaller of current age and 45; the source does not measure these event ages. First
divorce uses the current-divorced share among ever-partnered people as a conservative
fiction reference (0%, 4.91%, 14.77%, 14.87% by band), then draws a fictional age between
first marriage and current age. A current-status prevalence is not a measured lifetime
divorce probability. Manual statuses and locks can override these generation defaults.

Children use the [UN World Fertility 2024](https://www.un.org/development/desa/pd/node/4354)
global total-fertility reference of **2.25 births per woman in 2024** as an anchor. Total
fertility is a synthetic period measure, not the actual child-count distribution of
individual people. The generator deliberately uses a fictional Poisson count with mean
`2.25 × clamp((age − 18) / 27, 0, 1)`, for all character genders. There is a separate 4%
Unknown option; counts above ten display 11 or more. The age scaling, Poisson shape,
unknown probability, and application to all genders/species are authoring choices, not
claims about observed global household sizes or personal fertility.

Run `node verify-life.cjs` for weighted generation, education, age/timeline validation,
source probability boundaries, fictional child-count behavior, locks and migration.
`node verify-life-browser.cjs` checks the actual identity/category/edit controls,
clipboard, undo/redo, saves, import/export, age filtering, mobile layout, and offline use.


## Next-step help and rapid iteration (v21)

**Help me decide**, beside **What would help you picture them next?**, suggests one
next step at a time from the four categories currently suggested. The four cards
randomly sample distinct categories from the same catalog as **Explore your character**:
the twelve detail pages, Connections, Pressure situations, Character sheet, All character
details, and Add one detail at a time. Only Quick snapshot and Undo & roll history are excluded. The set stays stable
while browsing a draft; a new or reopened draft gets a new draw. **Suggest another**
cycles those four choices; choosing one opens that existing tool on the same character.

Once all three starting answers are added, **Save & start another** appears near the
top of the workspace and remains available in the deeper views. It saves a complete
version in Library, then returns to a fresh **Who are they?** question in one click.
The next character keeps the story settings. A failed save leaves the current draft
open. Undo can recover the previous draft, and the saved version stays in Library.


On mobile, adding the third starting answer scrolls to **What would help you picture them
next?** and focuses its heading. This also works when the third answer uses **Write my own**.
Reduced-motion settings use an immediate scroll. Editing an already completed sketch or
reopening it leaves scrolling under the author’s control.


On mobile, the four next-step suggestions are large, full-width buttons in a single column.
**Your sketch** shows its detail count and turns gold once details are kept. New or edited
kept content adds an **Updated** indicator and a subtle pulse until the sketch is opened;
opening it clears that indicator while retaining the gold styling. Screen readers receive
an update announcement. Reduced-motion settings retain the color and text feedback without
animation. These updates apply to both composed answers and individual kept details.


## Criminal history (v26)

Open **Browse all details → Criminal history** for a history overview, pattern of involvement,
and one expandable incident. **Add incident** adds an empty incident; up to 20 can be kept.
Each incident has its own stable field IDs. **Remove incident** removes its fields and Quick
Snapshot selections; Undo restores them. Unlock an incident's fields before removing it.
A new character starts with one incident again.

The overview includes no criminal history, an isolated incident, repeated involvement,
ongoing activity, or unknown history. Patterns include one bad decision, occasional
opportunism, a former way of life, and a current livelihood. A record-free character can
still have concealed wrongdoing. Actual involvement, the official account, and the
character's own account are separate; an accusation, arrest, or conviction never forces
an admission of responsibility.

Each incident includes:

- Offense or accusation, age, location, role, actual involvement, official record, and what
  the character tells people.
- Official consequence, present situation, feelings, and lasting effects.
- Motive and circumstances: desperation, loyalty, profit, revenge, ideology, coercion,
  and recklessness.
- Boundaries: what they justified then, what they refuse to do now, and what could draw
  them back.
- Separate people fields for an accomplice, person harmed, investigator, lawyer, informant,
  and someone who helped afterward. These are editable story prompts; they do not create
  Connected characters automatically.
- Who knows: public knowledge, close family only, employer unaware, someone knows a
  distorted version, and other secrecy prompts.
- Unresolved threads including unfinished restitution, resurfacing evidence, someone
  seeking an apology, and the return of an old associate.

Choose a history overview before rolling an incident. Editing or rerolling the overview
refreshes unlocked dependent fields. Editing the official record refreshes its unlocked
consequence and present situation. Editing involvement refreshes relevant motive prompts.
**Reroll unlocked incident fields** changes that incident alone. None and Unknown are
available alongside custom wording; incident ages accept whole years within the character's
established age at the story date. A year-only setting uses the youngest possible current
age. Birthday or story-date changes repair unlocked incident ages and flag preserved
conflicts. Locked values and accepted Keep snapshots survive dependent rerolls.

Generation uses editable fictional pools and authoring weights in `criminal-history.js`;
these are not crime statistics or jurisdiction-specific legal rules. Automatic histories
start at age 8 as a story convention; custom incident ages can start at 0. Generation does
not use heritage, gender, occupation, personality, or other demographic traits.

Every field supports the existing Focus, Lock, Keep, Copy, Edit, and Reroll controls,
one-detail suggestions, Quick Snapshot selection, My Sheet, briefs, saves, undo/redo,
JSON backups, and offline use. Older drafts and saves initialize missing history fields
to **Unknown / not established**, preserving their existing details and accepted snapshots.

Run `node verify-criminal.cjs` for module consistency checks and
`node verify-criminal-browser.cjs` for the browser workflow, migration, multiple incidents,
mobile layout, and offline reload. Browser checks use the same `PLAYWRIGHT_MODULE` and
`CHROMIUM_EXECUTABLE` overrides as the other suites. The v26 service-worker cache and
rebuilt ZIP include the new module.


## Dedicated character detail pages (v29)

Browse all details now offers twelve pages, with a shared page map powering the Explore
menu, guided development suggestions, single-detail candidate categories, and Explore section links:

| Page | Details |
| --- | --- |
| Identity & Naming | Identity, origins, languages, and naming prompts |
| Physical Appearance | Height description, build, hair, eyes, skin, and distinctive features |
| Personality & Behavior | Traits, flaws, values, motivations, social reactions, habits, and personal texture |
| Background & Past | Homeland, occupation, social class, formative experiences, and childhood beliefs |
| Skills & Possessions | Skills, abilities, equipment, unusual expertise, collections, and signature possessions |
| Symbolism & Story Sparks | Birthday traditions/associations, beliefs, superstitions, tarot, and story seeds |
| Relationships & Family | Family/parental figures, allies, enemies, organizations, attraction, relationship history, current relationship, compatibility, and intimacy |
| Medical | Precise measurements, medical history, medications, and meals |
| Education & Training | Education, degree subjects, student status, trade training, and feelings about education |
| Criminal History | Overview and expandable incidents, records, people, and consequences |
| Voice & Dialogue | Voice sound, dialogue habits, and optional dialogue challenges |
| Right Now | Location, action, thoughts, devices, media, conversations, sightings, status, and context |

Each field has one primary detail page. Full Character retains the complete view and its
original module headings. Medical and Physical Appearance link to each other. Relationships
& Family separates family, social connections, current relationship, history, ratings, and
intimacy into subsections. Existing age restrictions continue to apply per field, so family
and social connections remain available even when age-restricted relationship fields are hidden.

Back to Character is the first entry in the floating Actions menu outside the main builder.
It closes the menu and returns to the same sketch. Navigation preserves rolls, focus, locks,
kept snapshots, and notes. Saved drafts retain their selected page, and legacy candidate
categories migrate to the corresponding page. No source pools or saved field IDs changed.

Run `node verify.cjs` for the field partition, navigation, and migration checks.
`node verify-detail-pages-browser.cjs` checks all twelve pages, mobile return navigation,
related-page links, reload persistence, Explore targets, and overflow at 1440, 390, and 320 pixels.
It accepts the same Playwright/Chromium overrides as the other browser suites.


## Random Quick Snapshot and expanded exploration (v29)

Explore your character includes all twelve dedicated pages. All character details and
Add one detail at a time can also appear among the four suggestions after the opening
questions; Help me decide opens both using the same navigation as Browse all details.
The four choices remain distinct and stable while exploring the same draft.

Quick Snapshot automatically displays six existing details from six randomly selected
modules, giving every available module an equal chance. Opening the view again draws a
new selection; editing a card or reloading keeps the current selection. Shuffle snapshot
selects another mix without rerolling values, changing focus, or altering kept snapshots.
Age restrictions and disabled dialogue wildcards apply to the sample.

Choose snapshot fields switches to a manual selection that persists across visits.
Use random snapshot switches back to automatic selection. Earlier customized snapshots
remain manual; earlier default snapshots adopt automatic sampling. Both modes and the
current selection are included in saved versions, backups, and undo history.

## Personality, social context, and life game genres (v30)

Browse all details opens the new cards on the existing pages:

| Page | New details |
| --- | --- |
| Personality & Behavior | Personal archetype, personal narrative perspective, what makes them feel safe, descriptive quality, Life game genre |
| Background & Past | Social issue affecting them |
| Symbolism & Story Sparks | Story genre and the universal question their life explores |

Archetypes describe the role or recurring pattern the character sees in their own life.
Perspectives frame their inner narrative and are separate from Right Now's viewing perspective.
Each control theory keeps its title and “I feel safe…” statement together in a single card.
The character-descriptor pool supplements the existing traits and flaws without changing their weights.

Social issues combine the upstream 57 general, 50 men's, and 53 boys' prompts with the
locally authored **50 women's and 50 girls' prompts**: **260 total**. Automatic suggestions
follow accepted gender when available, otherwise the current gender result, and confirmed age.
Trans men use the men's/boys' pools and trans women use the women's/girls' pools. Other or
unknown identities use general suggestions by default. Younger children receive only reviewed
age-appropriate prompts; year-only dates use the existing conservative age calculation.

Edit the issue card to choose Follow character, General, Men's, Women's, Boys', Girls', or
All issues. **Include situation-specific prompts** adds entries mentioning circumstances
such as parenthood, disability, or identity. An issue is a writing prompt; it does not set
another identity, medical, or relationship field. Age filters remain active for manual contexts.
Explicit adult issues also require the existing Adult intimacy setting.

Gender and date edits reconcile unlocked, unkept suggestions. Custom wording, locks, and
kept snapshots remain preserved. Wording outside the current age/content settings is masked
on cards and omitted from kept sheets, briefs, and scene anchors. Original backup JSON retains
author data so changing story settings does not destroy saved work. Edit or reroll a masked
result to choose a new eligible issue.

**Life game genre** describes how the character views life if it were a video game:

```text
whimsical Detective game
melancholy Farming Survival game
```

The editor offers a descriptor pool and descriptor, a primary genre, and an optional distinct
second genre from **105 games across 13 families**. Automatic mode includes the second genre
35% of the time by default; change the percentage or choose One genre / Two genres. Selecting
None sets One genre until changed deliberately. Hold any ingredient to preserve it on rerolls;
Lock preserves the entire card. Apply edit saves the ingredient settings and phrase together.
Your version supports custom whole-phrase text. Game goals and twists appear in an optional
inspiration section; they do not assign real-life goals to the character.

Every card supports the existing editing, focus, locks, Keep, copy, canvas, Quick Snapshot,
sheet, saved versions, JSON backup, undo/redo, and brief flows. Older characters gain the
new cards as unkept suggestions without changing existing accepted wording. Social issues
can be explicitly selected as an obstacle ingredient; initial guided suggestions keep their
existing source choices. Kept issues, archetypes, control theories, and universal questions
can also provide anchors for pressure exercises.

The species pool adds **genetically enhanced-human** and **bio-hacked human**. Human remains
90% of automatic rolls; the other four kinds share the remaining 10%. First sexual-experience
history now consistently requires a confirmed adult age, matching the existing documented rule.

The upstream story source is [story_elements.json](https://github.com/KgitWH21/storyspinner25/blob/main/story_elements.json),
blob `a0449e5ea25c1376597dc26b2c3e82a00bb5bbb4`, preserved locally in `story_elements.json`.
`social-issues-additions.json` contains the authored additions and `game-genres.json` the game
source. `story-metadata.js` holds editable age/context rules and stable content-based IDs;
`story-elements.js` implements generation, editing, and migration. `story-data.js` combines
the upstream story data and additions under separate namespaces; `game-genres-data.js` is
the game wrapper. Both wrappers support direct-file launch and offline use.

After editing any source JSON, run `python3 package-app.py` to regenerate wrappers and
`character-maker.zip`. Release v30 caches all new assets; installed apps use Check updates
and Update & reload as before.

Run `node verify-story.cjs` for source counts, option integrity, age/gender/context filtering,
kept/locked behavior, game composition, migration, and history checks. Run
`node verify-story-browser.cjs` for actual editor controls, saves, exports, briefs, mobile
layouts, direct-file opening, and offline reload. Browser checks accept the same
`PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` overrides as the other suites.

## Animal and supernatural affinity (v31)

Browse all details now includes **Animal Affinity** and **Supernatural Affinity** as
two independent detail pages. Personality & Behavior links to both; Symbolism & Story
Sparks also links to Supernatural Affinity.

Each section has its own **Active / Inactive** switch. Roll character and Shuffle focus
independently randomize the two unlocked switches using the existing focus density:
60% active per section at the default setting. Either, both, or neither can be active.
Individual fields retain their own independent focus, so turning a section on does not
light up every detail. **Lock section** preserves its on/off choice while field rerolls
and individual field locks continue to work normally. A new character resets section locks.

Inactive means the topic is not prominent in how the character thinks about life. It
does not establish pet ownership or a belief. Inactive sections are omitted from automatic
snapshot sampling, snapshot presentation, single-detail candidates, and random development
suggestions. Both remain accessible in Browse all details and Full Character. Turning one
off preserves values, notes, and accepted details; kept facts remain in the sketch, sheet,
and finished brief. Custom snapshot selections are preserved when their fields are inactive.

Animal Affinity has an eight-position descriptive spectrum from **Hates animals** to
**Believes they are an animal reincarnated**. Separate fields cover practical comfort,
what shaped the attitude, favored/avoided animals, animal responses, a defining encounter,
and what could change their mind. The believed past-life animal appears when relevant.

Current pet status and childhood pet status are separate choices. A pet-owning status
reveals its records; No current pets reveals a reason instead. Each pet has independent
animal/species, name, and bond fields. Childhood pets also have an outcome. **Add another
pet** supports up to eight current and eight childhood pets, with stable record IDs.
Records can be rerolled together while respecting individual locks. Unlock a record's
fields before removing it; removal can be undone. Change the status to None to hide all
records without destroying them or their accepted snapshots. A pet's type can include a
breed or other detail through the usual custom editor.

Supernatural Affinity has an eight-position spectrum from **Only believes what they can
directly observe** to **Believes they may be a supernatural being in temporary flesh**.
Supporting fields include phenomena, basis for belief or skepticism, claimed experience,
emotion, public/private stance, practices, and what could change their mind. Possible
supernatural identity and its meaning appear for the corresponding beliefs. **Author's
truth** is an independent field; beliefs do not rewrite species or abilities. Existing
superstitions, symbolism, and tarot retain their original fields.

All details use the existing Focus, Lock, Keep, Copy, Edit, and Reroll controls. Both section
states and pet records survive saves, JSON backups, imports, undo/redo, and offline reload.
Older characters gain the two inactive sections with unkept suggestions, preserving all
existing accepted work. Source pools live in `affinity-data.js`; behavior and migration
live in `character-affinities.js`. Both are cached and included in the rebuilt ZIP.

Run `node verify-affinities.cjs` for independent gates, locks, conditional fields, pet record
IDs and limits, snapshots, migration, and history. Run `node verify-affinities-browser.cjs`
for actual controls, multiple pets, preserved kept facts with sections off, import/export,
mobile layout, direct-file startup, and offline use. It accepts the standard browser overrides.

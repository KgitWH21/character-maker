# Story elements integration plan

Prepared against the current app on 2026-10-30. Implemented as release v30. This document retains the design decisions and implementation checklist; current usage and verification commands are documented in README.md.

Source: [Story Spinner story_elements.json](https://github.com/KgitWH21/storyspinner25/blob/main/story_elements.json), Git blob `a0449e5ea25c1376597dc26b2c3e82a00bb5bbb4`. Game source: this repository's `game-genres.json`. Locally authored social-issue additions: [social-issues-additions.json](social-issues-additions.json).

## Recommended placement

Keep the existing twelve detail pages. Put the new personality aspects together, social issues beside the character's circumstances, and broader story prompts with the existing story sparks. **Life game genre** becomes its own named subsection and composed card in **Personality & Behavior**, available as a category of personality detail without adding a thirteenth navigation page.

| Source | Current coverage | Destination and proposed detail |
| --- | --- | --- |
| `plot.archetypes` — 130 entries | Some words already occur in event pools; there is no equivalent dedicated field | **Personality & Behavior → Self-image & inner narrative → Personal archetype** |
| `plot.perspectives` — 16 entries | No equivalent field | **Personality & Behavior → Self-image & inner narrative → Personal narrative perspective** |
| `character.theories_of_control` — 110 objects | No equivalent field | **Personality & Behavior → Security & control → What makes them feel safe** |
| `character.descriptors` — 323 entries, 322 distinct ignoring case and spacing | Partial overlap with existing traits, flaws, and other pools | **Personality & Behavior → Traits, values & motivations → Descriptive quality**, using a separate source pool |
| `plot.social_issues` — 160 entries | Related themes exist elsewhere, but no social-issue field | **Background & Past → Social context → Social issue affecting them**, connected to gender and age |
| Local `social-issues-additions.json` — 50 women's issues and 50 girls' issues | Authored for this integration; not yet loaded by the app | Supplement the same **Social issue affecting them** field and its gender/age-aware suggestion pools |
| `plot.universal_human_questions` — 60 entries | No equivalent field | **Symbolism & Story Sparks → Questions & themes → Question their life explores** |
| `plot.genres` — 111 entries | Some labels occur elsewhere; no narrative-genre field | **Symbolism & Story Sparks → Story framing → Story genre** |
| `character.gender` — 13 weighted entries, 4 distinct labels | Every label is already in `basic.gender`; the app also has nonbinary, genderfluid, and agender options | Reuse **Identity & Naming → Gender** and its existing pool |
| `character.race` — 9 weighted entries, 5 distinct labels | Human, Cyborg, and human with animal abilities already exist | Add **genetically enhanced-human** and **bio-hacked human** to **Identity & Naming → Species / kind** |
| `character.relationship` — 169 weighted entries, 88 distinct labels | Every distinct label already exists in `background.family_status` | Reuse existing relationship data; retain the distinction between family connection, romantic status, and connections between people |
| `character.age` — 9 entries | Source contains only `month` once and `year` eight times | Keep the app's birthday and numeric age-range system; these unit strings do not specify usable ages |
| Local `game-genres.json` — 105 entries across 13 families | Not loaded or packaged by the app | **Personality & Behavior → Life game genre → Their life as a game** |

Coverage means equivalent functionality, not just a matching word. An archetype such as “Revenge” still merits a personal-archetype field even if “Revenge” appears in the event pool. Existing gender and relationship pools already cover their source labels, so importing the repeated lists again would only change weighting.

## Personality additions

**Personal archetype** describes the recurring role or pattern the character sees in their own life: “Underdog,” “The Mentor,” “Fish Out of Water,” or “Redemption.” Some source entries are plot structures, so present the field as an inner narrative that shapes choices, rather than treating every entry as a personality adjective. Preserve all 130 original entries in the chooser.

**Personal narrative perspective** describes how their inner story is framed. “First Person Unreliable,” for example, suggests a self-account that edits or rationalizes events; “Third Person Objective” suggests imagining observable actions from a distance. Keep the source labels intact. Any explanatory hints should be separately authored metadata, clearly distinct from source wording. This belongs in Personality as requested and remains separate from Right Now's “Known to whom?” presentation setting.

**What makes them feel safe** keeps each theory's title and statement together. A result should read:

> The Analyst  
> I feel safe when I know all the variables.

The title and statement are one choice, reroll, lock, and kept snapshot. Splitting them into independently generated fields could produce mismatched pairs. These are character beliefs and coping patterns.

**Descriptive quality** exposes the complete descriptor pool without changing the weighting of the existing trait and flaw rolls. Several entries describe temporary feelings or tone rather than enduring traits; the broader label accommodates both. Existing personality fields remain available, and this new field is optional.

## Social issues connected to gender and age

The upstream pool contains **57 general issues, 50 men's issues, and 53 boys' issues**. Add the **50 women's issues and 50 girls' issues** authored in `social-issues-additions.json`, bringing the combined pool to **260 entries**. Preserve the original 53 boys' issues. The requested additions provide equal adult men's/women's counts and closely matched boys'/girls' counts without removing source entries.

The new prompts cover work and education, money, family expectations, care, friendship, independence, body image, health access, safety, discrimination, identity, ambition, and joy. Some experiences are shared across genders; audience labels guide relevance rather than claiming exclusivity. Entries about disability, race, trans identity, queer relationships, parenthood, pregnancy, and other specific circumstances need context tags so selecting an issue does not establish those facts about the character automatically. Preserve the distinction between these locally authored additions and the upstream data.

There is no dedicated nonbinary-specific list in these sources. General issues remain the automatic fallback for identities without a corresponding list; the author can select a different suggestion context explicitly.

Use explicit metadata for identity relevance, minimum/maximum age where applicable, and adult content. The source prefix supplies an initial audience tag, but every issue still needs review for age and context. A “boy's issue” about explicit sexual material must not become eligible for a minor just because of its prefix. Use the app's existing confirmed-age calculation, including its conservative handling of year-only dates.

Proposed automatic selection:

| Character context | Suggested issue pool |
| --- | --- |
| Confirmed adult man, including a trans man | Age-appropriate general issues plus applicable men's issues |
| Boy aged 13–17 | Age-appropriate general issues plus applicable boys' issues |
| Confirmed adult woman, including a trans woman | Age-appropriate general issues plus applicable women's issues |
| Girl aged 13–17 | Age-appropriate general issues plus applicable girls' issues |
| Child under 13, of any gender | Explicitly reviewed child-appropriate general issues, plus suitable boys' or girls' entries where applicable |
| Nonbinary, genderfluid, agender, unrecognized custom gender, or unknown gender | Age-appropriate general issues |
| Unknown age | Reviewed all-ages general issues |

For supported labels, map “transgender (woman to man)” to man and “transgender (man to woman)” to woman. Match existing Male/male and Female/female variants without changing their saved wording. An unrecognized custom label uses general suggestions until the author chooses an issue context explicitly.

Default to one equal-weight draw across eligible upstream and locally authored entries. Do not add the whole 260-entry list to every character's automatic pool. Keep all general issues available to eligible identities, so gender does not force a gender-specific conflict.

The card's editor should offer **Follow character** by default, plus **General**, **Men's issues**, **Women's issues**, **Boys' issues**, **Girls' issues**, and **All issues** as author-selected suggestion contexts. Manual contexts override gender relevance, while existing age/content restrictions still apply. Show a short explanation such as “Suggestions follow gender and confirmed age.” Store the context per character, not as a global preference.

Use accepted gender when present, falling back to the current gender result. This matches the app's established separation between accepted identity and background suggestions. Use the current birthday/story date for age, consistently with existing eligibility rules. Explicit accepted-gender edits, gender rerolls when no gender is accepted, birthday changes, story-date changes, and issue-context changes all run reconciliation.

On those changes, replace an ineligible **unlocked, unkept** issue suggestion. Preserve locked results and kept snapshots, with a clear note when they differ from the automatic suggestion context. Apply existing age/content restrictions to rendering, suggestions, copying, and exports. A kept issue must never silently change because the character's gender or age was edited.

Keep source wording available in Edit and source inspection. The visible card may put “Men's issue,” “Women's issue,” “Boys' issue,” or “Girls' issue” in a small context label and show the issue text below it. Do not turn a social issue into a medical diagnosis, criminal incident, relationship fact, or predicted behavior automatically.

## Life game genre

This is the character's own metaphor for their life. Use one composed field with an ingredient editor:

```text
[descriptor] [GENRE 1] [GENRE 2] game
```

Examples using entries already available in the app and genre file:

- `whimsical Detective game`
- `melancholy Farming Survival game`
- `strategic Inventory management game`

**Descriptor:** default to the existing `STORY_DESCRIPTOR` pool, which already supplies tone to the guided builder and relationship viewpoint. Offer the imported character-descriptor pool as an alternate source. Choosing a descriptor here does not change the character's traits or the guided builder's current descriptor.

**Genre 1:** choose from all 105 `game-genres.json` entries. Use `name` for the phrase, `family` to group choices in Edit, and preserve `goal` and `twist` as optional expandable inspiration. Those mechanic descriptions should not be copied verbatim into the character's real-life goals.

**Genre 2:** propose a configurable **35% chance** of a second genre and **65% chance** of none. Draw a different genre from Genre 1; same-family combinations are allowed. The editor offers **Automatic / One genre / Two genres**, plus an explicit None choice. Choosing None switches to One genre so it remains a deliberate choice on later rerolls. The percentage is a creative default, not a fact about the supplied file.

Keep source genre names unchanged in data. Remove a trailing `game` from genre names for presentation (for example, `Dialogue game` → `Dialogue` and `Dice game` → `Dice`), then append exactly one final `game`. Collapse extra whitespace and omit the absent Genre 2 completely. Preserve capitalization within genre names.

Use a single card so the result is easy to Keep, Copy, or add to Quick Snapshot. Edit reveals the descriptor source, descriptor, Genre 1, optional Genre 2, and second-genre mode. Ingredients can be rerolled or held individually; whole-card Lock preserves everything. Whole-card Reroll changes unheld ingredients and applies the second-genre mode. If Genre 2 is held, retain it even in Automatic mode. If one genre is held, draw the other from the remaining names. Reject duplicate manual selections with a short inline message.

Persist ingredient references, held flags, mode, and the formatted value together. Keep captures the formatted phrase as the accepted snapshot. Subsequent rolls change the background candidate; explicitly applying an edit to the accepted card updates its snapshot. Allow custom whole-phrase text, with an explicit custom mode so reloading does not regenerate it from old ingredient metadata.

## Source data and implementation

Add a dedicated `story-elements.js` behavior module rather than expanding the education/relationship-specific `character-life.js` or the already broad `core.js` with all these rules.

Keep editable source JSON and generated runtime wrappers, following the repository's existing direct-file and offline model:

- Add a pinned local `story_elements.json` containing the complete upstream data, with its blob SHA documented.
- Generate `story-data.js` exposing `window.StoryData` from that JSON.
- Include the authored `social-issues-additions.json` pools in `story-data.js` under a separate additions namespace; retain the upstream data unchanged. A single generated wrapper can contain both sources.
- Generate `game-genres-data.js` exposing `window.GameGenres` from the existing local genre JSON.
- Keep IDs, audience/age tags, presentation aliases, and suggestion settings in a separate editable `story-metadata.js`. Do not rewrite the upstream source to attach implementation details.
- Assign stable IDs to referenced options, including duplicate occurrences where source weighting matters. Do not derive persisted identity solely from array position; reordering a source file must not change a saved selection.
- Preserve source order, wording, and repeated entries in the raw pools. Use normalized comparisons to audit overlap, never to silently rewrite or deduplicate source data.

Proposed fields:

| Field ID | Display label | Owning page |
| --- | --- | --- |
| `personality.archetype` | Personal archetype | Personality & Behavior |
| `personality.perspective` | Personal narrative perspective | Personality & Behavior |
| `personality.controlTheory` | What makes them feel safe | Personality & Behavior |
| `personality.descriptor` | Descriptive quality | Personality & Behavior |
| `personality.lifeGameGenre` | Life game genre | Personality & Behavior |
| `story.socialIssue` | Social issue affecting them | Background & Past |
| `story.universalQuestion` | Question their life explores | Symbolism & Story Sparks |
| `story.genre` | Story genre | Symbolism & Story Sparks |

Use explicit definitions with a dedicated field kind for module dispatch. A field's ID and its page/group are independent: `story.socialIssue` can belong to a Social context group mapped to Background & Past. Distinguish the narrative Story genre pool from the video-game genre pool.

The module should provide definitions, generation, edit/formatting, dependency reconciliation, metadata sanitization, eligibility, warnings, and migration. Proposed files and hooks:

| File | Required changes |
| --- | --- |
| `character_elements.json` | Add the two missing species once; keep the 90% Human rule and share the remaining 10% across other kinds |
| `app.js` | Register definitions in `allDefinitions`; dispatch rolls and editors; run reconciliation after identity/date/issue-context edits; sanitize and retain option/composite metadata in `validSnapshotBase`; invoke migration in restore/rebuild paths |
| `character-canvas.js` | Map every new field to exactly one page; add personality subsections and Social context; make Life game genre a single suggestion candidate |
| `guided-ui.js` | Include new kept details in the sketch and return links; support accepted-gender edit reconciliation |
| `guided-builder.js` | In a follow-on step, offer the social issue as an obstacle source while preserving existing accepted recipes |
| `character-tools.js` | Let kept control theories, issues, archetypes, and universal questions supply pressure-exercise anchors; keep them optional |
| `index.html` | Load generated data and the new module before `app.js`; update help/source descriptions |
| `package-app.py` | Generate the three runtime wrappers, including both upstream story data and local social-issue additions; include all source JSON, metadata, module, and wrappers in the ZIP |
| `sw.js`, `app-updates.js` | Cache every new runtime asset and JSON source; advance matching release markers during implementation |
| `README.md` | Explain placement, source provenance, social-issue defaults, game-genre settings, and source regeneration |

The current generic object chooser assumes tarot-shaped objects. It cannot render `{title, statement}` or `{name, family, goal, twist}` correctly without module-specific handling. Likewise, current backup sanitization only retains extra field metadata for Dialogue and Right Now. Extending that sanitizer is required for game ingredients, custom mode, held flags, and issue context to survive saves and history.

Do not add new inputs as requirements in the three opening guided questions. Optional obstacle integration should be explicitly chosen in the ingredient editor. The theory, archetype, and perspective should influence writing prompts only through accepted anchors, never by overwriting motivations or dialogue.

## Migration and shared behavior

Preserve current field IDs, storage keys, saved versions, locks, kept wording, notes, accepted guided sentences, and custom Quick Snapshot selections. Add new slots once as unkept background suggestions; leave existing accepted characters unchanged. Migration must be idempotent, including when importing legacy backups, restoring undo history, or opening a connected character.

Validate composite metadata and source IDs before using them. If an option disappears from a later data file, retain saved text and show it as a custom/legacy result rather than drawing a replacement during import. Persist any new per-character settings through the existing settings sanitizer. No randomness should occur on a repeated migration of the same updated character.

Every new card must support existing Focus, Lock, Keep, Edit, Copy, Reroll, canvas suggestions, Full Character, manual and random Quick Snapshot, My Sheet, saved versions, JSON backups, undo/redo, and finished briefs. Update all accepted-edit paths as well as ordinary field editing. The composed game phrase counts as one detail; its ingredient controls do not become separate snapshot candidates.

## Implementation sequence and acceptance checks

1. **Data preparation:** pin the upstream source, include the authored women's/girls' additions, assign stable option IDs, add metadata and wrappers, and add the two species. Verify wrapper/source equality, exactly 50 new entries per audience, 260 combined issues, valid unique IDs, source weighting, and 105 distinct game names.
2. **Personality and story cards:** add archetype, perspective, control theory, descriptor, universal question, and story genre; update the page partition. Verify title/statement pairing, source selection, custom text, and exactly one owning page per field.
3. **Social issues:** review age/context tags for upstream and authored entries, add gender/age-aware suggestions and all five audience contexts, then connect all identity/date edit paths. Verify women's/girls' eligibility alongside men's/boys', existing gender variants, both trans labels, unknown/custom identities, youth/adult date boundaries, context-specific entries, general fallback, and preservation of kept/locked issues.
4. **Life game genre:** implement the composite editor and metadata round trip. Verify one- and two-genre results, distinct genres, explicit None, held ingredients, custom phrases, clean spacing, and the `Dialogue game` alias. Test the 35% branch with controlled random inputs.
5. **Optional writing connections:** add the issue to obstacle choices and new accepted details to pressure anchors. Verify older accepted guided recipes and kept scenes remain intact.
6. **Persistence and release:** test old/new saves, JSON import/export, undo/redo, kept edits, and connected-character copies; regenerate wrappers/ZIP, update release markers, and verify direct-file launch plus installed offline reload.

Extend the existing meaningful checks in `verify.cjs`, guided, life, and browser suites where their behavior is affected; add a focused story-module check for dependency rules and composite state. Browser verification should cover the three affected detail pages, ingredient editing, copy/brief output, and 320/390-pixel layouts. Release only after current checks and those new integration cases pass.

The proposed defaults to carry into implementation are: existing twelve-page navigation; personality ownership for archetypes, perspectives, control beliefs, descriptors, and Life game genre; social issues in Background & Past; automatic gender/age relevance with an author override; and a 35% optional second game genre.

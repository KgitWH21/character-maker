# Character Maker design system

## Product and audience
An offline-first writing companion for developing fictional characters. The existing app is dependency-free vanilla HTML, CSS and JavaScript. Its deep local generators, curated snapshots, undo, local versions, relationships, scene prompts, printable briefs and backups must remain accessible. This round produces a reviewable responsive design prototype; application implementation follows review.

## Approved experience
Character is the default destination. Primary navigation has Character, Story tools, Library. The guided builder asks Who are they?, What do they want?, What gets in their way? These are optional, revisitable chapters, with one possibility at a time. Accepting updates the visible character sketch; Try another affects only the current suggestion. Write my own, Skip for now, and Browse all details remain accessible. Show one prominent action in each decision area.

After the three questions, offer See them, Hear them, Know their past, Watch them act as routes into appearance, dialogue, backstory, relationships and scene tools. Preview & export is available throughout. Distinguish draft persistence on this device from Save version. Do not imply cloud sync, AI inference, purchases or account features. Contextual advanced controls retain generation locks and focus without requiring beginners to learn them. Use only accepted details in the character sketch. Existing identity foundation remains editable. Avoid completion scores, compulsory steps and gamification.

## Brand and visual source
The current codebase is the visual source: retain its navy and warm gold identity, and exact icon.svg brand mark. Google-inspired approachability means clear hierarchy, familiar controls, generous space and contextual depth. No external-site extraction or competing style library is needed.

## Tokens
- Background: #10151d; header: #151b24; surface: #19212c; control: #202a37.
- Border: #303c4b; text: #edf2f6; secondary text: #a4b2c3; blue: #9abce0.
- Primary accent: #e4b45a; hover: #f0c87c; text on accent: #171b23.
- Subtle accent surfaces use the same gold at 8–14% opacity.
- UI typography: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif. No external webfonts. Georgia is reserved for character names and expressive suggestion text; existing source uses it for names.
- Base: 16px, 1.55 line height. Labels 12–14px; body 16–18px; question headings 28–36px; name 28–40px.
- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.
- Rounded controls 10–12px, main suggestion and sketch surfaces 20–24px, pills fully rounded.
- Shadows: subtle black transparency, limited to raised suggestion surfaces, menus and dialogs.
- Desktop content max width 1200–1320px. At 1000px and up, give the question most of the width and use a narrower character sketch beside it. At mobile widths, a compact summary is collapsible and the active question takes priority.
- Touch controls minimum 44px. Visible gold keyboard focus; secondary text keeps adequate contrast. Never rely on hover to reveal essential controls.

## Motion requested by the user
Make interactions tactile and slightly playful, always quick and interruptible:
- Buttons compress to scale(.96–.98) and translateY(1px) on pointer or keyboard press, about 90ms; release settles within 160–220ms.
- Add to character: checkmark acknowledgement and a short settling/highlight animation on the newly accepted sketch detail, 220–320ms.
- Try another: the single possibility fades/slides a few pixels and is replaced, about 180ms. Preserve the question and layout dimensions.
- Next question: gentle opacity/8px translate reveal, 220ms. Step indicators update without large movement.
- Icons can rotate briefly on a relevant deliberate action. No idle animation, confetti, bouncing layouts or automatic carousels.
- Under prefers-reduced-motion: reduce, eliminate transforms, keyframe animations and smooth scrolling; retain immediate text/state feedback.
- Immediate state updates, preserved keyboard focus and usable repeated clicks take precedence over animation timing. Do not suggest vibration support.

## Option content: required source of truth
The implemented builder composes a full sentence from multiple current source arrays. Who combines age, heritage, trait, gender, species and occupation. Want combines motivation, trait, an influence and an event. Obstacle combines descriptor, trait and a selectable resistance source. Grammar/connective language may adapt while original values remain inspectable as ingredients. The control is named See ingredients. Each element can be edited, rerolled or held, and influence/resistance source pools can be changed. Previously accepted facts and generator locks remain protected. Whole-sentence author overrides are separate from generated character facts.

## Scope of this canvas round
Create one coherent responsive builder direction, including initial identity, motivation, obstacle and optional deeper development states. Demonstrate button press, next suggestion and accepted-detail feedback. Sketch versions of Story tools and Library may demonstrate navigation using explicitly labeled sample content. Prototype storage must use separate demo keys and never read or overwrite production character-maker localStorage keys.

For a faithful current-UI baseline, the existing source wins on all dimensions and styles; the redesign-specific layout and motion apply only to the subsequent guided-builder iteration.

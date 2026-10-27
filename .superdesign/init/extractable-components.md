# Extractable UI patterns

No component framework; these are template/DOM patterns suitable for extraction.

## AppShell
- Source: `index.html`
- Category: layout
- Description: Header, navigation and workspace hosts
- Extractable state/navigation props: activeView
- Hardcoded: labels, icons, CSS classes, theme and brand asset path.

## WorkspaceNavigation
- Source: `index.html`
- Category: layout
- Description: Build and Quick buttons plus tools select and back action
- Extractable state/navigation props: activeView, showBack
- Hardcoded: labels, icons, CSS classes, theme and brand asset path.

## FieldCard
- Source: `app.js`
- Category: basic
- Description: Generated field with copy, focus, lock, keep, reroll and editor
- Extractable state/navigation props: mode, locked, focused, kept
- Hardcoded: labels, icons, CSS classes, theme and brand asset path.

## AcceptedCard
- Source: `app.js`
- Category: basic
- Description: Kept snapshot card with editing and removal
- Extractable state/navigation props: keptValue
- Hardcoded: labels, icons, CSS classes, theme and brand asset path.

## ConnectionCard
- Source: `app.js`
- Category: basic
- Description: Connected profile and shared history
- Extractable state/navigation props: connection
- Hardcoded: labels, icons, CSS classes, theme and brand asset path.

## SceneCard
- Source: `app.js`
- Category: basic
- Description: Pressure situation with authored response
- Extractable state/navigation props: candidate, scene
- Hardcoded: labels, icons, CSS classes, theme and brand asset path.

## HistoryCard
- Source: `app.js`
- Category: basic
- Description: Restorable full draft history entry
- Extractable state/navigation props: active, entry
- Hardcoded: labels, icons, CSS classes, theme and brand asset path.


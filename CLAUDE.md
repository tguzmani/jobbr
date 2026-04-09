# Jobbr — Project Guidelines

## Angular Component Structure
- **Always** use separate `.html` and `.scss` files for component templates and styles.
- Never use inline `template:` or `styles:` in `@Component` — use `templateUrl` and `styleUrl` instead.

## Page Layout
- All pages must be **full width** (`width: 100%`). Never use `max-width` to constrain page containers.

## Firestore
- When adding a new entity/collection, **always** update `firestore.rules` with the corresponding read/write rules.

## Styling
- For `input`, `select`, and `textarea` elements, use `background-color` instead of `background` shorthand — the shorthand resets the global select caret `background-image` defined in `styles.scss`.

## Icons
- Use `<app-icon name="..." />` from `shared/components/icon/icon.component.ts` for all icons.
- Never write inline SVG in templates — add new icons to the `ICON_PATHS` registry in the icon component instead.
- Note: Dashboard stats and profile field groups use data-driven SVG paths (`[attr.d]`) — those are the only exception.

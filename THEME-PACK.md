# Discussion Forge Theme Package Specification

**Specification Version:** 1.0

---

## Overview

A theme package defines the visual presentation of Discussion Forge cards.

Themes are trusted application packages. They control presentation only and must not alter deck-generation behavior, card-pack content, catalog relationships, manifest semantics, or application security boundaries.

Card packs own content and card-back identity text. Themes own presentation such as colors, typography, icons, and decorative card-back artwork.

---

## Directory Structure

Each bundled theme package follows this structure:

```text
themes/
└── <theme-id>/
    ├── index.js
    ├── theme.css
    └── assets/
        ├── fonts/
        ├── icons/
        ├── card-back.svg
        └── other optional presentation assets
```

A future preview image may be added as a theme metadata or packaging feature, but it is not currently part of the runtime contract.

---

## Theme Registry

Bundled themes are registered through the trusted application theme registry.

A theme package exports declarative metadata through `index.js`.

Example:

```javascript
export const theme = Object.freeze({
  id: "trail-blue",
  name: "Trail Blue",
  version: "1.0.0",
  author: "Overlanding Atlas",
  description: "A navy trail-inspired card theme.",
  license: "Apache-2.0",
  className: "theme-trail-blue",
  stylesheet: "themes/trail-blue/theme.css",
  assetRoot: "themes/trail-blue/assets",
});
```

The application validates trusted theme definitions before use.

---

## Required Metadata

Current trusted theme definitions include:

| Field | Purpose |
|:------|:--------|
| `id` | Permanent lowercase kebab-case identifier |
| `name` | Human-readable theme name |
| `version` | Stable semantic version |
| `author` | Theme author or organization |
| `description` | Short description |
| `license` | Theme/package license |
| `className` | CSS class matching `theme-<id>` |
| `stylesheet` | Trusted relative path to `theme.css` |
| `assetRoot` | Trusted relative path to the theme asset directory |

The runtime validates registry paths so themes cannot escape their expected directory structure.

---

## `theme.css`

`theme.css` contains visual styling owned by the theme, including:

- Card-front and card-back colors
- Category presentation
- Typography overrides
- Decorative visual effects
- Theme-specific artwork presentation

Themes must not change application behavior.

Application layout and interaction remain application-owned.

---

## Theme Assets

Themes may provide:

- Category icons
- Card-back artwork
- Decorative graphics
- Fonts bundled with the trusted theme package

Only assets intentionally different from the fallback theme need to be supplied.

---

## Fallback Theme

Trail Blue is currently the canonical fallback theme.

That role is an application configuration choice, not application identity.

Category icons resolve in this order:

1. Selected theme icon
2. Trail Blue fallback icon
3. Catalog emoji

Card-back artwork resolves in this order:

1. Selected theme `card-back.svg`
2. Trail Blue fallback `card-back.svg`
3. Text-only card back

Missing optional artwork must not prevent Discussion Forge from rendering a usable deck.

The Sample Trivia reference pack intentionally uses a category without a bundled theme icon and therefore exercises the catalog-emoji fallback path.

---

## Canonical Trail Talk Icon Names

The current Trail Talk categories use these icon filenames:

```text
gear.svg
story-time.svg
lightning.svg
wildcard.svg
```

These filenames correspond to Trail Talk category IDs; they are not universal category requirements for all card packs.

Other packs may introduce other category IDs. Themes are not required to provide icons for every possible category because the runtime falls back safely to catalog emoji.

---

## Recommended SVG Editor

For simple edits to icons and artwork:

- SVG Viewer: https://www.svgviewer.dev/

Its live source and preview panes are useful for inspecting and adjusting paths, fills, strokes, and transforms without requiring a full vector graphics editor.

---

## Icon Requirements

SVG assets should:

- Use a valid `viewBox`
- Avoid embedded stylesheets
- Avoid scripts
- Avoid external references
- Be optimized for screen and print
- Provide their own color when loaded through `<img>`, unless intentionally used through another trusted rendering technique

Themes are not required to override every icon.

---

## Security Requirements

Theme packages are considered trusted only after review and inclusion in the Discussion Forge repository.

Community-submitted themes and assets remain untrusted until reviewed and accepted.

Trusted theme packages may contain:

- CSS
- Static SVG assets
- Declarative metadata exported by the bundled `index.js`
- Other reviewed static presentation assets

Theme contributions may not introduce arbitrary runtime behavior.

Theme packages may not contain:

- Application logic
- Unreviewed executable JavaScript
- Embedded scripts
- Inline event handlers
- Remote executable content
- Dynamic code generation

The bundled `index.js` file is part of the trusted application registry contract; it is not a mechanism for community-supplied executable extensions.

---

## Design Guidelines

A theme may change:

- Colors
- Backgrounds
- Textures
- Icons
- Decorative artwork
- Typography

A theme should not change:

- Card dimensions
- Semantic card structure
- Deck generation
- Pack selection
- Catalog contents
- Printing behavior
- Manifest format
- Accessibility semantics
- Security behavior

---

## Compatibility

Theme packages should remain compatible with:

- Secure by Design principles
- Strict Content Security Policy goals
- Offline operation
- Portable deployment
- Screen and print rendering
- Application fallback behavior

---

# SVG Acceptance and Sanitization Policy

SVG files are XML documents and may contain active or externally referenced content. All contributed SVG assets are considered untrusted until they have been reviewed, sanitized, tested, and accepted into the Discussion Forge repository.

Discussion Forge does not load arbitrary community-supplied SVG files directly at runtime.

Only reviewed SVG assets bundled with trusted theme packages may be used by the application.

## Accepted Uses

SVG assets may be used for:

- Category icons
- Card-back artwork
- Decorative theme artwork
- Future theme preview graphics

SVG assets must remain presentation-only and must not alter application behavior.

## Required SVG Structure

Every accepted SVG file shall:

- Be valid XML
- Use the SVG namespace
- Include a valid `viewBox`
- Use local vector geometry
- Render without external resources
- Remain legible at its intended display size
- Contain no application logic
- Include a documented source and license when derived from third-party work

Explicit pixel `width` and `height` attributes should normally be omitted so the application can scale the asset through CSS.

## Prohibited Content

SVG files shall not contain:

- `<script>`
- `<foreignObject>`
- Inline event handlers such as `onclick`, `onload`, or `onerror`
- JavaScript or other executable URI schemes
- Remote URLs
- External stylesheets
- External fonts
- Embedded HTML
- Embedded audio or video
- Embedded raster images
- `<iframe>`, `<object>`, or similar embedded content
- Animation elements
- Dynamic code generation
- Data URLs
- References to files outside the trusted theme package
- Unnecessary metadata from design applications

Attributes beginning with `on` are prohibited.

URL-bearing attributes such as `href`, `xlink:href`, `src`, `filter`, `clip-path`, `mask`, and `style` require explicit review. External references are prohibited.

## Allowed Elements

The preferred allowlist is limited to common static vector elements such as:

- `<svg>`
- `<g>`
- `<path>`
- `<rect>`
- `<circle>`
- `<ellipse>`
- `<line>`
- `<polyline>`
- `<polygon>`
- `<title>`
- `<desc>`

The following may be accepted when necessary and reviewed carefully:

- `<defs>`
- `<linearGradient>`
- `<radialGradient>`
- `<stop>`
- `<clipPath>`
- `<mask>`
- `<text>`

Use of `<text>` should be avoided for essential artwork because rendering may depend on locally available fonts. Paths are preferred when exact typography must be preserved.

Elements outside the allowlist require a documented security and compatibility review before acceptance.

## Styling

SVG presentation should prefer simple attributes such as:

- `fill`
- `stroke`
- `stroke-width`
- `stroke-linecap`
- `stroke-linejoin`
- `opacity`
- `transform`

Embedded `<style>` blocks should be avoided.

Inline `style` attributes should be normalized into explicit presentation attributes when practical.

SVG assets loaded through `<img>` do not inherit CSS `currentColor` from the parent document. Assets used this way must therefore provide their own colors unless another reviewed rendering technique is intentionally used.

## Sanitization Workflow

Before an SVG asset becomes trusted:

1. Confirm its source and redistribution license.
2. Open it in a text editor and inspect the XML.
3. Remove scripts, event handlers, external references, embedded content, and unnecessary metadata.
4. Reduce the document to the permitted element and attribute allowlists.
5. Normalize the `viewBox`.
6. Remove unnecessary explicit dimensions.
7. Confirm that all references are local and internal to the SVG.
8. Validate the sanitized file as XML.
9. Test it using the same embedding method used by Discussion Forge.
10. Test fallback behavior by temporarily removing or renaming the asset.
11. Test screen preview and printed output.
12. Review the final diff before committing it to the trusted repository.

Sanitization shall not rely only on filename extensions, MIME types, or visual inspection in a browser.

## Testing Requirements

Category icons shall be tested in:

- Card banners
- Card center icons
- Quick List output
- Screen and print rendering
- Theme fallback scenarios

Card-back artwork shall be tested in:

- Interactive preview
- Printed output
- Theme fallback scenarios
- Text-only fallback mode

Artwork must remain recognizable and must not overlap:

- Hole-punch guides
- Card text
- Cut-safe areas
- Card boundaries

## Review and Trust

Community-submitted SVG assets remain untrusted until accepted into the repository through review.

Acceptance into the repository changes the asset's trust classification to trusted bundled content.

Any later modification requires the SVG to be reviewed again.

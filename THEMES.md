# Theme Package Specification

## Overview

A theme package defines the visual presentation of Trail Talk.

Themes are declarative. They control appearance only and must never alter
application behavior.

---

## Directory Structure

Each theme package shall follow this structure.

```text
themes/
└── <theme-id>/
    ├── index.js
    ├── theme.css
    ├── assets/
    │   ├── fonts/
    │   ├── icons/
    │   ├── card-back.svg
    │   ├── other_graphics_assets_for_card_backs
    │   └── preview.png (optional - not yet implemented)
```

---

## Required Files

### index.js

Defines the theme metadata exported to the trusted theme registry.

Example:

```javascript
export const theme = Object.freeze({
  id: "trail-blue",
  name: "Trail Blue",
  className: "theme-trail-blue",
  stylesheet: "themes/trail-blue/theme.css",
  assetRoot: "themes/trail-blue/assets",
});
```

---

### theme.css

Contains all visual styling owned by the theme, including:

- Card back appearance
- Category colors
- Typography overrides
- Theme-specific visual effects
- Future SVG icon styling

Themes shall not modify application layout or functionality.

---

## Default Assets

Trail Blue provides the canonical default assets. Themes may override
any supported asset by supplying a file with the same relative path.
Missing theme assets fall back to Trail Blue, then to the built-in
emoji where applicable.

Themes may override any default asset by providing a file with the same
relative path.

Missing assets automatically fall back to the application default.

If both the theme asset and application asset are unavailable, the
application will fall back to built-in emoji where applicable.

Future category additions will introduce additional required icons.

---

## Canonical Icon Names

gear.svg

story-time.svg

lightning.svg

wildcard.svg

---

## Icon Requirements

Themes are not required to override every icon.

Only assets that intentionally differ from the application defaults
should be included in the theme package.

SVG assets should:

- Use viewBox
- Avoid embedded stylesheets
- Avoid scripts
- Avoid external references
- Use currentColor where practical
- Be optimized for print and screen

---

## Security Requirements

Theme packages are considered trusted only after review and inclusion in the
Trail Talk repository.

Community-submitted themes remain untrusted until approved.

Theme packages may contain:

- CSS
- SVG assets
- Declarative metadata (`index.js`)

Theme packages may not contain:

- Application logic
- Additional JavaScript modules
- Embedded scripts
- Event handlers
- Remote assets
- External URLs
- Dynamic code generation

---

## Design Guidelines

Themes should preserve the Trail Talk user experience.

A theme may change:

- Colors
- Backgrounds
- Textures
- Icons
- Decorative artwork
- Typography

A theme should not change:

- Card dimensions
- Card layout
- Deck generation
- Printing behavior
- Manifest format
- Accessibility semantics

---

## Compatibility

Theme packages should remain compatible with:

- Secure by Design principles
- The project's Content Security Policy goals
- Offline operation
- Portable deployment

---

## SVG Acceptance and Sanitization Policy

SVG files are XML documents and may contain active or externally referenced
content. All contributed SVG assets are considered untrusted until they have
been reviewed, sanitized, tested, and accepted into the Trail Talk repository.

Trail Talk does not load community-supplied SVG files directly at runtime.

Only reviewed SVG assets bundled with trusted theme packages may be used by
the application.

### Accepted Uses

SVG assets may be used for:

- Category icons
- Card-back artwork
- Decorative theme artwork
- Theme preview graphics

SVG assets must remain presentation-only and must not alter application
behavior.

### Required SVG Structure

Every accepted SVG file shall:

- Be valid XML
- Use the SVG namespace
- Include a valid `viewBox`
- Use local vector geometry
- Render without external resources
- Remain legible at its intended display size
- Contain no application logic
- Include a documented source and license when derived from third-party work

Explicit pixel `width` and `height` attributes should normally be omitted so
the application can scale the asset through CSS.

### Prohibited Content

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

URL-bearing attributes such as `href`, `xlink:href`, `src`, `filter`,
`clip-path`, `mask`, and `style` require explicit review. External references
are prohibited.

### Allowed Elements

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

Use of `<text>` should be avoided for essential artwork because rendering may
depend on locally available fonts. Paths are preferred when exact typography
must be preserved.

Elements outside the allowlist require a documented security and compatibility
review before acceptance.

### Styling

SVG presentation should prefer simple attributes such as:

- `fill`
- `stroke`
- `stroke-width`
- `stroke-linecap`
- `stroke-linejoin`
- `opacity`
- `transform`

Embedded `<style>` blocks should be avoided.

Inline `style` attributes should be normalized into explicit presentation
attributes when practical.

SVG assets loaded through `<img>` do not inherit CSS `currentColor` from the
parent document. Assets used this way must therefore provide their own colors,
unless they are intentionally used as CSS masks.

### Sanitization Workflow

Before an SVG asset becomes trusted:

1. Confirm its source and redistribution license.
2. Open it in a text editor and inspect the XML.
3. Remove scripts, event handlers, external references, embedded content, and
   unnecessary metadata.
4. Reduce the document to the permitted element and attribute allowlists.
5. Normalize the `viewBox`.
6. Remove unnecessary explicit dimensions.
7. Confirm that all references are local and internal to the SVG.
8. Validate the sanitized file as XML.
9. Test it in the application using the same embedding method used in
   production.
10. Test its fallback behavior by temporarily removing or renaming the asset.
11. Test it in both screen preview and printed output.
12. Review the final diff before committing it to the trusted repository.

Sanitization shall not rely only on filename extensions, MIME types, or visual
inspection in a browser.

### Testing Requirements

Category icons shall be tested in:

- The card banner
- The center of the card
- Quick List output
- Both screen and print rendering
- Theme fallback scenarios

Card-back artwork shall be tested in:

- Interactive preview
- Printed output
- Both supported card dimensions
- Theme fallback scenarios
- Text-only fallback mode

Artwork must remain recognizable and must not overlap:

- Hole-punch guides
- Card text
- Cut-safe areas
- Card boundaries

### Fallback Behavior

Category icons resolve in this order:

1. Selected theme icon
2. Trail Blue canonical icon
3. Built-in emoji

Card-back artwork resolves in this order:

1. Selected theme `card-back.svg`
2. Trail Blue canonical `card-back.svg`
3. Text-only card back

Missing or rejected assets must not prevent the application from rendering a
usable deck.

### Review and Trust

Community-submitted SVG assets remain untrusted until accepted into the
repository through code review.

Acceptance into the repository changes the asset’s trust classification from
conditionally trusted to trusted bundled content.

Any later modification requires the SVG to be reviewed again.
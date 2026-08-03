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
    │   ├── icons/
    │   └── preview.png (optional)
```

---

## Required Files

### index.js

Defines the theme metadata exported to the trusted theme registry.

Example:

```javascript
export const trailBlueTheme = Object.freeze({
  id: "trail-blue",
  name: "Trail Blue",
  className: "theme-trail-blue",
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

## Required Icon Assets

Each theme shall provide the following icon filenames.

```text
gear.svg
story-time.svg
lightning.svg
wildcard.svg
```

Future category additions will introduce additional required icons.

---

## Icon Requirements

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
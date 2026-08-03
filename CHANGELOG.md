# Changelog

All notable changes to Trail Talk will be documented in this file.

The project follows a Keep a Changelog–style format during development.

---

## [0.2.0-alpha3]

### Added

- Interactive preview card flipping.
- Theme selection.
- Live deck preview status panel.
- Separate preview and print renderers.
- Trusted theme registry.
- Self-contained theme package architecture.
- Theme package specification.
- Secure by Design documentation.
- Project architecture documentation.

### Changed

- Rebranded application from **Convoy Conversations** to **Trail Talk**.
- Reduced printed card size to **2.40 × 3.40 inches** for easier lamination.
- Moved category presentation into theme packages.
- Refactored utility functions into `utils.js`.
- Converted themes into self-contained packages.
- Added complete catalog validation before rendering.
- Replaced inline presentation with semantic CSS classes.
- Improved preview card interaction and keyboard accessibility.
- Hardened HTML metadata and browser input constraints.

### Fixed

- Duplex printing now produces correctly paired front/back pages.
- Hole-punch guide now appears only on card backs.
- Theme switching now correctly updates preview and printed card backs.
- Front cards no longer inherit card-back theme backgrounds.

### Security

- Hardened DOM rendering to eliminate HTML injection paths.
- Added validation for themes, catalogs, identifiers, and relationships.
- Preserved validated card metadata.
- Removed inline category styling in preparation for a strict Content Security Policy.
- Established explicit trust boundaries for themes and community assets.

---

## [0.2.0-alpha2]

### Added

- Paired front/back print layout.
- Printable deck manifest.
- Preview improvements.
- Utility function refactoring.

---

## [0.2.0-alpha1]

### Added

- Initial Trail Talk prototype.
- JSON card catalog.
- Seeded deck generation.
- Printable poker card output.
- Quick List output.
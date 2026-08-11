# Changelog

All notable changes to Discussion Forge will be documented in this file.

The project follows a Keep a Changelog–style format during development.

---

## [Unreleased]

### Added

- Dedicated category-record validator module.
- Dedicated edition-record validator module.
- Dedicated catalog-integrity validator for cross-catalog uniqueness and relationship checks.
- Dedicated theme-definition validator module.
- Integration validation for the actual bundled Trail Talk and Sample Trivia card packs.
- Bundled-theme integration validation, including declared stylesheet and asset-root existence checks.
- Automated semantic builder-status tests.
- Live builder statistics for available cards and selected editions/categories.
- Visual warning when the requested deck size exceeds the currently available card count.
- Preview guidance explaining that Poker Cards can be selected to flip and inspect the card back.
- Advanced Deck Settings accordion placeholder for future metadata-driven filters.

### Changed

- Removed obsolete validation helpers, allowlists, patterns, and limits from `app.js` after validator extraction.
- Reframed `app.js` around loading, orchestration, deck generation, rendering, interaction, and trusted-state publication rather than record validation.
- Reorganized the builder into content-selection and builder-option columns.
- Moved live deck-selection statistics beside the Build Your Deck heading.
- Improved responsive card-preview layout so two-column previews remain usable on wider narrow-screen layouts before collapsing to one column.
- Expanded README documentation for application/card-pack separation, trust boundaries, deterministic deck identity, and the known-good print workflow.

### Fixed

- Generated output now clears immediately when builder configuration changes make an existing deck stale.
- Card-pack switching now clears generated output with the complete required state/output context instead of raising a runtime error.
- Print / Save PDF now refuses to print when no valid generated deck exists and reports a visible warning instead of opening a blank print job.
- Keyboard flow after generation now reaches generated preview content rather than leaving Quick List users with no discoverable path into the generated results.
- Partial duplex sheets now preserve physical card positions so fronts and backs remain aligned for non-six-card page groups.
- Builder status messages consistently distinguish successful operations, validation warnings, and actual runtime/load errors.

### Security

- Catalog record, catalog-integrity, and theme validation now have explicit module boundaries.
- Theme resource-path validation remains constrained to trusted relative theme namespaces after extraction from `app.js`.
- Cross-catalog category, edition, primary-category, and identity checks remain fail closed before replacement catalog state is published.
- Bundled-content integration tests now verify that the files being shipped form internally consistent card packs and theme packages.

---

## [0.3.0-alpha1]

### Added

- Discussion Forge application identity separated from Trail Talk content identity.
- Trusted `CARD_PACK_REGISTRY` for bundled card-pack definitions.
- Card-pack loading and activation pipeline.
- Runtime separation between the active card pack and validated catalog.
- Card Pack selector populated from the trusted registry.
- Multi-pack switching with pack-dependent edition and category controls.
- Active card-pack ID and version in generated deck manifests.
- Active card-pack ID and version in deterministic deck identity schema version 2.
- Sample Trivia reference pack for multi-pack regression testing.
- Dedicated card-pack manifest validator module.
- Dedicated card-record validator module.
- `CARD-PACK.md` specification updated for the multi-pack runtime.
- `THEME-PACK.md` specification replacing the previous `THEMES.md` filename.

### Changed

- Renamed the application identity from Trail Talk to Discussion Forge.
- Repositioned Trail Talk as the canonical bundled card pack.
- Card-back title, taglines, and brand now come from the active card-pack manifest.
- Deck identity contract now uses `DECK_IDENTITY_SCHEMA_VERSION` and schema version 2.
- Validated cards, categories, and editions are grouped under a catalog runtime object.
- Generated manifest filenames use Discussion Forge application naming rather than Trail Talk naming.
- Project, security, card-pack, and theme documentation updated to reflect the application/content separation.
- Validation responsibilities began moving out of `app.js` into dedicated validator modules.

### Fixed

- Cleared stale generated output after successful card-pack changes.
- Preserved the previously active trusted pack when a replacement pack fails to load or validate.
- Enforced exact agreement between a registered card-pack ID and the ID declared by its manifest.
- Corrected Trail Talk manifest category identifiers to match the catalog.

### Security

- Card-pack IDs are resolved through a trusted registry rather than arbitrary resource paths.
- Card-pack catalog data is validated before entering trusted runtime state.
- Failed card-pack activation remains fail closed and does not publish partially validated replacement state.
- Card-pack manifest and card-record validation now have dedicated module boundaries.

---

## [0.2.0-alpha3]

### Added

- Deterministic deck identities and SHA-256 deck fingerprints.
- Complete Secure by Design documentation and security policy.
- Theme package specification and contributor documentation.
- Interactive preview card flipping with keyboard focus support.
- Live deck preview status panel.
- Root-level theme package architecture.

### Changed

- Refactored themes into self-contained packages with dedicated assets.
- Separated preview rendering from print rendering.
- Reorganized project documentation into dedicated architecture, security, theme, and project guides.
- Moved category presentation into theme packages.
- Improved project portability through declarative theme registration.
- Updated repository structure for future community theme support.

### Security

- Hardened DOM rendering by eliminating HTML injection paths.
- Added strict validation for catalog, theme, and metadata content.
- Introduced explicit trust boundaries throughout the application.
- Hardened utility functions and input validation.
- Established Secure by Design engineering standards based on OWASP and MITRE guidance.

### Fixed

- Removed the legacy deck summary panel.
- Improved preview accessibility and keyboard focus visibility.
- Corrected theme rendering consistency between card fronts and backs.
- Unified preview and print rendering behavior.

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

- Initial Trail Talk prototype that later evolved into Discussion Forge.
- JSON card catalog.
- Seeded deck generation.
- Printable poker card output.
- Quick List output.

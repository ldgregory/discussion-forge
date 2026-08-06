# Changelog

All notable changes to Trail Talk will be documented in this file.

The project follows a Keep a Changelog–style format during development.

---

## [Unreleased]

### Added

### Changed

### Fixed

### Security

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

- Initial Trail Talk prototype.
- JSON card catalog.
- Seeded deck generation.
- Printable poker card output.
- Quick List output.
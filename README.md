Copyright © 2026 Leif Gregory

Licensed under the Apache License, Version 2.0.

# Discussion Forge

Discussion Forge is an open-source browser application for building, previewing, printing, and reproducing card decks.

**Discussion Forge is the application, not a card deck.** Card packs supply deck content and card-back identity, while trusted theme packages supply visual presentation. The application loads those packages through explicit registries and validation boundaries rather than hardcoding pack-specific content into the runtime.

Trail Talk is the canonical bundled conversation card pack. Sample Trivia is a deliberately small reference pack used to demonstrate and test that Discussion Forge can operate with content other than Trail Talk.

---

## Features

- Multiple selectable card packs
- Deterministic deck generation from a seed
- Deterministic Deck IDs and SHA-256 fingerprints
- Printable poker-sized cards
- Interactive front/back deck preview
- Quick List output
- Trusted theme package support
- Modular validation for card packs, catalogs, catalog relationships, and themes
- Downloadable deck manifests
- Offline operation
- Browser-based deployment with no application server required

---

## Architecture

Discussion Forge separates application behavior, deck content, validation, and visual presentation.

```text
Discussion Forge
├── Card Pack Registry
│   ├── Trail Talk
│   └── Sample Trivia
├── Validation Layer
│   ├── Card-pack manifest
│   ├── Cards
│   ├── Categories
│   ├── Editions
│   ├── Catalog integrity
│   └── Themes
├── Active Card Pack
├── Validated Catalog
│   ├── cards
│   ├── categories
│   └── editions
├── Theme Registry
└── Deck Generation and Rendering
```

Card packs provide metadata, cards, categories, editions, and card-back identity. Themes provide trusted presentation assets and styles. Dedicated validator modules establish trust before pack or theme data is consumed by the runtime, while `app.js` remains responsible for loading, orchestration, deck generation, rendering, and interaction.

### Trust and validation boundary

Discussion Forge treats data as untrusted until it has crossed the appropriate validation or review boundary.

Bundled card packs are registered through the trusted card-pack registry. An unknown pack ID is rejected before resource paths are constructed. A requested pack's manifest, cards, categories, editions, identifiers, supported metadata, and cross-catalog relationships are validated before the replacement catalog is published into trusted runtime state. If loading or validation fails, activation fails closed and the previously trusted pack remains active.

Bundled themes are registered separately and their definitions are validated before use. Theme resource paths must remain inside the theme's own namespace. Theme SVG assets are trusted only after review and sanitization; arbitrary community-supplied SVG or executable content is not loaded directly at runtime.

Pack-supplied and user-supplied text is rendered with DOM APIs and `textContent` rather than being interpreted as HTML.

See `SECURITY.md`, `CARD-PACK.md`, and `THEME-PACK.md` for the complete security and package contracts.

---

## Deterministic Deck Identity

Discussion Forge separates a deck's deterministic identity from the identity of an individual generation event.

The **Deck ID** and full **SHA-256 deck fingerprint** are deterministic. With the same identity inputs and the same validated card content, regenerating a deck produces the same Deck ID, fingerprint, card order, and permanent deck positions.

Deck identity schema version 2 includes:

- deck-identity schema version
- generator version
- active card-pack ID and version
- generation seed
- selected editions
- selected categories
- requested card count
- ordered selected card identities and content versions

Changing an input that changes this canonical identity payload can therefore change the Deck ID. A card-content revision can also change identity when its content version changes.

The selected **theme is presentation state and is not a deterministic Deck ID input**. A generated deck may be switched to another trusted theme without changing its Deck ID or card order. The exported manifest records the currently selected theme so it describes the presentation selected at export time.

Each manifest also receives a new `deck_uuid` and `generated_at` timestamp for that particular generation event. Those instance-specific values are expected to differ when the same deterministic deck is generated again; the Deck ID and fingerprint remain the reproducibility checks.

---

## Printing

Discussion Forge renders dedicated duplex-ready print output from the same generated deck state used by the browser preview.

Poker-card output uses six cards per full sheet. Each front sheet is followed immediately by its corresponding back sheet, and partial sheets preserve physical card positions so fronts and backs remain aligned when duplex printed.

The known-good print workflow used for the v1.0 physical acceptance tests is:

- Paper: US Letter, portrait
- Scale: **100%** — do not use Fit to Page
- Double-sided printing: **Flip on long edge**
- Print backgrounds: **On**
- Browser headers and footers: **Off**
- Card size: **2.40 in × 3.40 in**
- Cut guides: card backs only
- Hole-punch guide: card backs only

Browser and printer-driver wording can vary, so verify the preview before committing a large print job. A small duplex test is recommended when using a new printer or driver.

Quick List mode bypasses poker-card sheet rendering and prints the generated list instead.

---

## Current Status

Current development version:

**0.4.0**

The `release/v1.0` branch is in release hardening for the first stable **1.0.0** release. The validator architecture, bundled-content integration validation, keyboard/accessibility pass, responsive-layout pass, deterministic-generation checks, manifest checks, and physical duplex-print acceptance testing have been completed for the release candidate.

---

## Project Principles

Discussion Forge is guided by a small set of engineering principles:

- Secure by Design
- Accessibility First
- Separation of Concerns
- Declarative Theme Architecture
- Data Validation Before Use
- Portable Deployment
- Reproducible Deck Generation

When tradeoffs occur, these principles take precedence over adding features quickly.

---

## Bundled Card Packs

### Trail Talk

Trail Talk is the canonical bundled conversation pack. It is designed to encourage meaningful conversation on the trail and around the campfire. Trail Talk is bundled content; it does not define Discussion Forge's application identity or runtime architecture.

### Sample Trivia

Sample Trivia is a deliberately small general-knowledge pack used as a reference implementation and regression test for card-pack switching, catalog replacement, card-back identity, theme behavior, deterministic generation, and manifest generation. Its purpose is also architectural: it demonstrates that Discussion Forge can operate without Trail Talk-specific assumptions in the application runtime.

---

## Documentation

- **PROJECT.md** — Architecture and project design decisions
- **SECURITY.md** — Security engineering standards and trust boundaries
- **CARD-PACK.md** — Card-pack format and contributor specification
- **THEME-PACK.md** — Theme package specification and SVG acceptance policy
- **CHANGELOG.md** — Release history
- **TODO.md** — Current roadmap and planned work

---

## License

Discussion Forge is licensed under the Apache License 2.0.

See the `LICENSE` file for the complete license text.

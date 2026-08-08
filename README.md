Copyright © 2026 Leif Gregory

Licensed under the Apache License, Version 2.0.

# Discussion Forge

Discussion Forge is an open-source browser application for building, previewing, printing, and reproducing conversation card decks.

The application is content-agnostic. Conversation content and card-back identity are supplied by installed card packs, while presentation is supplied by trusted theme packages.

Trail Talk is the canonical bundled conversation pack. Sample Trivia is included as a small reference pack used to exercise and demonstrate multi-pack behavior.

---

## Features

- Multiple selectable card packs
- Deterministic deck generation from a seed
- Deterministic Deck IDs and SHA-256 fingerprints
- Printable poker-sized conversation cards
- Interactive front/back deck preview
- Quick List output
- Trusted theme package support
- Downloadable deck manifests
- Offline operation
- Browser-based deployment with no application server required

---

## Architecture

Discussion Forge separates application behavior, conversation content, and visual presentation.

```text
Discussion Forge
├── Card Pack Registry
│   ├── Trail Talk
│   └── Sample Trivia
├── Active Card Pack
├── Validated Catalog
│   ├── cards
│   ├── categories
│   └── editions
├── Theme Registry
└── Deck Generation and Rendering
```

Card packs provide metadata, cards, categories, editions, and card-back identity. Themes provide trusted presentation assets and styles. The application validates pack data before publishing it into runtime state.

---

## Current Status

Current development version:

**0.2.0-alpha3**

Current development is focused on strengthening the card-pack contract, compatibility validation, theme decoupling, contributor documentation, and deployment hardening.

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

Trail Talk is the canonical conversation pack. It is designed to encourage meaningful conversation on the trail and around the campfire.

### Sample Trivia

Sample Trivia is a deliberately small general-knowledge pack used as a reference implementation and regression test for card-pack switching, catalog replacement, card-back identity, theme fallbacks, and manifest generation.

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

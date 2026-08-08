# Discussion Forge Project

## Project Principles

Discussion Forge is guided by the following engineering principles.

- Secure by Design
- Separation of Concerns
- Declarative Theme Architecture
- Data Validation Before Use
- Progressive Enhancement
- Accessibility First
- Portable Deployment
- Reproducible Deck Generation

When tradeoffs occur, these principles take precedence over adding new features.

---

## Security

Security is considered throughout the design and implementation of Discussion Forge.

The project's security architecture, trust boundaries, secure coding standards, and implementation guidance are documented in **SECURITY.md**.

---

## Application and Content Model

Discussion Forge is the application.

Card packs provide conversation content and pack-owned identity. Themes provide visual presentation. Neither card-pack content nor theme presentation should be hardcoded into the application when it belongs to one of those extension points.

The current runtime model is:

```text
Discussion Forge
├── Card Pack Registry
├── Active Card Pack
├── Validated Catalog
│   ├── cards
│   ├── categories
│   └── editions
├── Theme Registry
├── Generated Deck
└── Generated Manifest
```

The bundled Trail Talk pack is content, not application identity.

---

## Card-Pack Architecture

Each registered card pack provides paths to:

- `manifest.json`
- `cards.json`
- `categories.json`
- `editions.json`

The loading pipeline is intentionally layered:

```text
requireCardPack()
        ↓
loadCardPack()
        ↓
validated card pack + catalog
        ↓
activateCardPack()
        ↓
application state
```

Unknown pack IDs are rejected before resource paths are constructed. Pack resources are validated before they enter trusted runtime state.

Changing the active card pack replaces the validated catalog, rebuilds pack-dependent builder controls, and clears generated output only after successful activation.

---

## Deterministic Deck Identity

Generated decks have both deterministic and instance-specific identity.

The deterministic Deck ID and SHA-256 fingerprint are derived from a canonical payload containing the deck-identity schema version, generator version, active card-pack ID and version, generation seed, selected editions and categories, requested card count, and ordered card identities/content versions.

The current deck identity schema version is **2**.

A generated manifest also receives a UUID identifying that particular generation event and manifest instance.

---

## Version 0.2 Architectural Decisions

### Printing

- Six playable cards per page
- Front pages immediately followed by matching back pages
- Flip on the long edge when printing duplex
- Cut guides appear on backs only
- Hole-punch guide appears on backs only
- Card size: 2.40" × 3.40"

### Card Design

Front:

- Clean card face without manufacturing guides
- Large category icon
- Category banner
- Permanent deck position
- Deterministic Deck ID in the footer

Back:

- Card-pack-owned title
- Up to two optional card-pack tagline lines
- Card-pack-owned brand text
- Theme-controlled decorative artwork
- Application-owned hole-punch guide

### Rendering

- Canonical front and back renderers are shared by preview and print output.
- Interactive preview cards can flip between front and back.
- Quick List output uses the same generated deck state and permanent positions.
- Theme assets fall back safely when optional artwork is missing.

### Architecture

- JSON-based card-pack catalogs
- UUID card identities
- Permanent deck positions
- Deterministic deck generation from seed
- Deterministic Deck IDs and SHA-256 fingerprints
- Downloadable generated manifests
- Card-pack registry and dynamic card-pack selector
- Runtime separation between active card-pack metadata and validated catalog data
- Theme registry with self-contained trusted theme packages

---

## Bundled Reference Packs

### Trail Talk

Trail Talk is the canonical bundled conversation pack and remains the primary real-world content set.

### Sample Trivia

Sample Trivia is a small reference pack used to verify that Discussion Forge can switch catalogs and card-back identity without Trail Talk-specific runtime behavior.

Its presence provides a practical regression test for the multi-pack architecture.

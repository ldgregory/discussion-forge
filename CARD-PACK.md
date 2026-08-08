# Discussion Forge Card Pack Specification

**Specification Version:** 1.0  
**Applies to:** Card-pack schema version 1

---

# Introduction

A **Card Pack** is a portable collection of conversation or question content that can be distributed, shared, installed, versioned, and validated independently of Discussion Forge.

A card pack contains:

- A manifest describing the pack
- One or more editions
- One or more categories
- One or more cards

Card packs separate content from application behavior. Discussion Forge supplies the generator, validation pipeline, rendering, printing, and manifest export; card packs supply the content and pack-owned card-back identity.

Trail Talk is the canonical bundled card pack. Sample Trivia is a small reference pack used to demonstrate and test multi-pack behavior.

---

# Card Packs vs. Editions

A **card pack** is a distribution boundary.

An **edition** is a card-selection boundary within a pack.

For example:

```text
Trail Talk
├── Core
├── Campfire
└── Recovery
```

Another author might create:

```text
Golf Trivia
├── Pebble Beach
├── Augusta National
└── Pine Valley
```

The entire Golf Trivia pack can be distributed as one unit, while its editions allow the deck builder to include or exclude subsets of its content.

---

# Card Pack Directory Layout

Every current card pack uses the same directory structure:

```text
data/
└── <pack-id>/
    ├── manifest.json
    ├── cards.json
    ├── categories.json
    └── editions.json
```

| File | Purpose |
|------|---------|
| `manifest.json` | Describes the card pack and its card-back identity. |
| `cards.json` | Contains every card in the pack. |
| `categories.json` | Defines categories referenced by cards. |
| `editions.json` | Defines editions referenced by cards. |

The manifest describes the pack itself. The catalog files remain the authoritative source for the content available to the runtime.

---

# Registration

Discussion Forge currently loads bundled packs from the trusted `CARD_PACK_REGISTRY` in application code.

A registry entry contains a permanent pack ID and trusted relative paths to the pack resources:

```javascript
const MY_CARD_PACK = Object.freeze({
  id: "my-card-pack",

  paths: {
    manifest: "data/my-card-pack/manifest.json",
    cards: "data/my-card-pack/cards.json",
    categories: "data/my-card-pack/categories.json",
    editions: "data/my-card-pack/editions.json",
  },
});
```

Unknown pack IDs are rejected before resource paths are used.

The runtime does not currently discover arbitrary card-pack directories automatically.

---

# `manifest.json`

The manifest provides metadata describing the card pack.

Current card-pack schema version:

```text
1
```

Example:

```json
{
  "schema_version": 1,
  "pack_type": "cards",

  "id": "trail-talk",
  "display_name": "Trail Talk Canonical Deck",
  "version": "1.0.0",

  "author": {
    "name": "Atlas",
    "email": "",
    "website": "",
    "github": ""
  },

  "released_at": "2026-08-02",

  "description": "The canonical Trail Talk conversation deck designed to encourage meaningful conversations on the trail and around the campfire while helping travelers learn more about one another.",

  "card_back": {
    "title": "TRAIL TALK",
    "tagline": [
      "Real Questions. Real Connections."
    ],
    "brand": "Overlanding Atlas"
  },

  "license": "Apache-2.0",

  "minimum_application_version": "0.4.0",

  "dependencies": [],

  "tags": [
    "overlanding",
    "camping",
    "off-roading",
    "conversation"
  ],

  "editions": [
    "core",
    "campfire",
    "recovery"
  ],

  "categories": [
    "gear",
    "story-time",
    "lightning",
    "wildcard"
  ],

  "card_count": 32
}
```

---

# Manifest Fields

## `schema_version`

Identifies the card-pack manifest format.

Current value:

```text
1
```

Required by the specification. Runtime enforcement of the complete manifest contract is still being expanded.

---

## `pack_type`

Identifies the package type.

Current value:

```text
cards
```

Required by the specification.

---

## `id`

Permanent machine-readable identifier for the pack.

Rules:

- lowercase
- kebab-case
- unique within the installation
- should not change after publication

Examples:

```text
trail-talk
golf-trivia
winter-camping
```

The manifest ID should match the ID used by the trusted card-pack registry.

---

## `display_name`

Human-readable name for the card pack.

Unlike the permanent ID, the display name may change between releases.

---

## `version`

Version of the card pack.

Discussion Forge uses stable semantic-version strings for current pack validation:

```text
Major.Minor.Patch
```

Examples:

```text
1.0.0
1.2.5
2.0.0
```

Pack ID and version participate in deterministic deck identity.

---

## `author`

Information about the card-pack author.

| Field | Required | Description |
|:------|:--------:|:------------|
| `name` | Yes | Author or organization name |
| `email` | No | Contact email |
| `website` | No | Project website |
| `github` | No | GitHub username or organization |

---

## `released_at`

Release date using ISO-8601 date format.

Example:

```text
2026-08-02
```

---

## `description`

Short summary describing the pack, its subject, intended audience, or intended style of interaction.

Avoid listing every card.

---

## `card_back`

Defines card-back identity text owned by the card pack.

Current fields:

| Field | Description |
|:------|:------------|
| `title` | Primary card-back title |
| `tagline` | Zero, one, or two tagline lines |
| `brand` | Pack-owned author, organization, or brand text |

The runtime normalizes the tagline into exactly two positions. Either position may be intentionally blank.

Example:

```json
"card_back": {
  "title": "SAMPLE TRIVIA",
  "tagline": [
    "Test Your Knowledge",
    "Learn Something New"
  ],
  "brand": "Discussion Forge"
}
```

Card-back text belongs to the pack. Decorative card-back artwork belongs to the active theme.

---

## `license`

Content license for the card pack.

Examples:

```text
Apache-2.0
MIT
CC-BY-4.0
```

---

## `minimum_application_version`

Earliest Discussion Forge version intended to support the pack.

Compatibility enforcement is part of the planned manifest-validation work. Pack authors should still provide this field now so packs are ready for that contract.

---

## `dependencies`

Lists other card packs required by this pack.

Current independent packs normally specify:

```json
[]
```

Dependency enforcement is planned but is not yet part of the active runtime contract.

---

## `tags`

Informational keywords for discovery and organization.

Example:

```json
[
  "camping",
  "overlanding",
  "conversation"
]
```

---

## `editions`

Lists editions declared by the pack.

Each declared ID should exist in `editions.json`.

---

## `categories`

Lists categories declared by the pack.

Each declared ID should exist in `categories.json`.

---

## `card_count`

Human-readable informational value.

Discussion Forge determines the actual runtime card count from `cards.json`. Validation tooling should eventually verify that `card_count` matches the catalog.

---

# Catalog Validation

Before catalog data enters trusted application state, Discussion Forge validates individual records and relationships between records.

Current runtime checks include:

- Catalog size limits
- Card UUID format
- Unique category IDs
- Unique edition IDs
- Unique card UUIDs
- Required card fields
- Allowlisted card metadata values
- Prompt and instruction length limits
- Category and edition references
- Primary-category membership
- Category color format
- Active/status values

A failed pack load must not replace the previously active trusted pack state.

---

# Card-Pack Switching

The builder populates its Card Pack selector from `CARD_PACK_REGISTRY`.

When a different registered pack is selected, Discussion Forge:

1. Resolves the trusted registry entry.
2. Fetches all four pack resources.
3. Validates the manifest fields currently consumed by the runtime.
4. Validates and cross-checks the catalog.
5. Publishes the new active card pack and catalog only after successful loading.
6. Rebuilds edition and category controls.
7. Clears generated output created from the previous pack after successful activation.

If activation fails, the previously active trusted pack remains in state and the selector returns to it.

---

# Deterministic Deck Identity

The active card-pack ID and version participate in deck identity schema version 2.

This means identical seeds and otherwise similar card selections from different packs do not share a deterministic identity merely because their generation settings happen to match.

Generated deck manifests record the active pack as:

```json
"card_pack": {
  "id": "sample-trivia",
  "version": "1.0.0"
}
```

---

# Designing Good Card Packs

A good pack should be internally coherent and appropriate for its intended use.

Depending on the pack's purpose, cards may be designed for conversation, reflection, education, counseling, trivia, storytelling, group activities, or other structured interaction.

General guidance:

- Keep the pack focused enough that users understand its purpose.
- Use categories when they provide meaningful filtering or presentation value.
- Use editions when they represent meaningful selectable subsets.
- Keep prompts concise enough to render cleanly.
- Keep instructions brief and actionable.
- Avoid unnecessary duplication.
- Treat sensitive subjects intentionally and use metadata consistently.

Discussion Forge does not require every pack to optimize for casual conversation; the application is intentionally content-agnostic.

---

# Publishing Checklist

Before releasing a card pack:

- [ ] `manifest.json` is complete.
- [ ] The permanent pack ID uses lowercase kebab-case.
- [ ] `cards.json` validates successfully.
- [ ] `categories.json` validates successfully.
- [ ] `editions.json` validates successfully.
- [ ] All IDs are unique.
- [ ] Card category and edition references are valid.
- [ ] Primary categories are declared on their cards.
- [ ] Prompt and instruction lengths have been reviewed.
- [ ] `card_count` matches `cards.json`.
- [ ] Card-back title, tagline positions, and brand render correctly.
- [ ] Missing theme-specific category icons fall back safely.
- [ ] The pack switches cleanly from another installed pack.
- [ ] Generated manifests contain the correct pack ID and version.
- [ ] Deterministic generation reproduces the same Deck ID for the same inputs.

---

# Design Philosophy

Discussion Forge intentionally separates **application behavior**, **pack metadata**, **content catalogs**, and **visual themes**.

The application owns generation, validation, rendering, and interaction.

The card-pack manifest describes the pack and its card-back identity.

Catalog files define the cards and their selection relationships.

Theme packages define trusted presentation.

Keeping those responsibilities separate allows packs and themes to evolve independently while preserving a small, understandable runtime trust model.

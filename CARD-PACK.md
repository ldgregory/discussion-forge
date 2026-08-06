# Trail Talk Card Pack Specification

**Version:** 1.0
**Applies to:** Schema Version 1

---

# Introduction

A **Card Pack** is a portable collection of conversation content that can be distributed, shared, installed, and validated independently of the application.

A card pack contains:

- A manifest describing the pack
- One or more editions
- One or more categories
- One or more conversation cards

Card packs allow the application to grow without modifying the source code.

---

# Card Packs vs. Editions

One of the most important concepts is understanding the difference between a **card pack** and an **edition**.

A **card pack** is a distribution boundary.

An **edition** is a card-selection boundary.

For example:

```
Trail Talk Canonical Pack
│
├── Core
├── Campfire
└── Recovery
```

Another author may create:

```
Golf Trivia Pack
│
├── Pebble Beach
├── Augusta National
└── Pine Valley
```

The entire Golf Trivia Card Pack can be shared with another user, while the individual editions allow the deck builder to include or exclude specific topics.

---

# Card Pack Directory Layout

Every card pack follows the same directory structure.

```
my-card-pack/
│
├── manifest.json
├── cards.json
├── categories.json
└── editions.json
```

| File | Purpose |
|------|---------|
| manifest.json | Describes the card pack. |
| cards.json | Contains every card. |
| categories.json | Defines categories referenced by cards. |
| editions.json | Defines editions referenced by cards. |

The manifest describes the pack itself.

The catalog files remain the authoritative source for the content contained within the pack.

---

# manifest.json

The manifest provides metadata describing the card pack.

Current Schema Version:

```
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
    "gear-vehicle",
    "story-time",
    "lightning-round",
    "wild-cards"
  ],

  "card_count": 32
}
```

---

# Manifest Fields

## schema_version

Identifies the manifest format used by the card pack.

This value allows Trail Talk to support future manifest revisions while maintaining backward compatibility.

Current value:

```
1
```

Required.

---

## pack_type

Identifies the type of package.

Current supported value:

```
cards
```

Future versions may introduce additional package types.

Required.

---

## id

A permanent machine-readable identifier.

Rules:

- lowercase
- hyphen-separated
- unique
- should never change once published

Good:

```
trail-talk
golf-trivia
winter-camping
```

Poor:

```
Trail Talk
Golf Trivia
```

---

## display_name

Human-readable name shown in the application.

Unlike the ID, this value may change between releases.

---

## version

The version of the card pack.

Trail Talk recommends Semantic Versioning.

```
Major.Minor.Patch
```

Examples:

```
1.0.0
1.2.5
2.0.0
```

---

## author

Information about the card pack author.

Fields:
| Field | Required | Description |
|:------|:------:|:-------------|
| name | Yes | Author or organization name |
| email | No | Contact email |
| website | No | Project website |
| github | No | GitHub username or organization |


---

## released_at

Release date using ISO-8601 format.

Example:

```
2026-08-02
```

---

## description

A short summary describing the card pack.

Describe:

- intended audience
- subject
- conversation style

Avoid listing every card.

---

## license

The content license for the card pack.

Examples:

```
Apache-2.0
MIT
CC-BY-4.0
```

---

## minimum_application_version

The earliest Trail Talk version capable of loading this card pack.

Older versions should refuse to load incompatible packs.

---

## dependencies

Lists required card packs.

Current packs normally specify:

```json
[]
```

Future versions may reference additional packs.

---

## tags

Keywords intended for discovery.

Example:

```json
[
  "camping",
  "overlanding",
  "conversation"
]
```

Tags are informational only.

---

## editions

Lists every edition provided by this card pack.

Every value must exist in:

```
editions.json
```

---

## categories

Lists every category provided by this card pack.

Every value must exist in:

```
categories.json
```

---

## card_count

Human-readable informational value.

Trail Talk determines the actual card count by reading:

```
cards.json
```

Validation tools should verify that this value matches the catalog.

---

# Designing Good Card Packs

Trail Talk is designed to encourage meaningful conversation.

Good packs generally:

- Stay focused on a single topic.
- Reuse existing categories whenever practical.
- Introduce new categories only when necessary.
- Write concise prompts.
- Keep instructions brief.
- Prefer interesting conversations over trivia memorization.

Quality is more important than quantity.

---

# Validation

Every card pack should be validated before distribution.

Validation includes checks such as:

- Required files exist.
- Manifest fields are complete.
- IDs are unique.
- Card references are valid.
- Categories exist.
- Editions exist.
- Prompt lengths are within limits.
- Instructions are within limits.
- Colors are valid.
- Card count matches the catalog.

A validation failure must be corrected before publishing.

---

# Publishing Checklist

Before releasing a card pack:

- [ ] manifest.json is complete.
- [ ] cards.json validates successfully.
- [ ] categories.json validates successfully.
- [ ] editions.json validates successfully.
- [ ] All IDs are unique.
- [ ] Card references are valid.
- [ ] Prompt and instruction lengths have been reviewed.
- [ ] card_count matches cards.json.
- [ ] The pack loads successfully in Trail Talk.

---

# Design Philosophy

Trail Talk intentionally separates **metadata** from **content**.

The manifest describes the card pack.

The catalog files define the actual conversation content.

This separation keeps the runtime simple while allowing packs to be independently distributed, validated, versioned, and maintained.
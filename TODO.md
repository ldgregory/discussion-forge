# TODO

## Application and Trail Talk Pack Decoupling

### Application-owned branding

- [ ] index.html page title, heading, metadata, and noscript text
- [ ] README.md application description
- [ ] SECURITY.md project terminology
- [ ] PROJECT.md application terminology
- [ ] CHANGELOG.md current header wording only
- [ ] css/styles.css file-level comment
- [ ] js/app.js file-level and runtime comments
- [ ] js/utils.js generic encoding comment
- [ ] themes/index.js registry wording

### Trail Talk pack-owned identity

- [ ] Move card-back title into pack metadata
- [ ] Move tagline into pack metadata
- [ ] Move brand into pack metadata
- [ ] Validate card-back metadata
- [ ] Render active pack identity
- [ ] Include pack identity in generated manifests
- [ ] Include pack ID and version in deterministic deck identity

### Theme documentation and comments

- [ ] Replace fixed Trail Talk text references with semantic names
- [ ] Decide whether bundled themes are generic or Trail Talk-specific
- [ ] Rename THEMES.md to THEME-PACK.md
- [ ] Generalize theme specification wording

### Card-pack documentation

- [ ] Replace application-level Trail Talk wording with “the application”
- [ ] Preserve Trail Talk as the canonical example pack

## High Priority

### General

- [x] Make deck identifier deterministic from the generated deck
- [x] Remove the legacy deck summary (yellow box)
- [ ] Make preview cards visually match the printed cards
- [ ] Keep the print renderer completely independent of interactive preview styles

### Security

- [x] Define SVG acceptance and sanitization workflow
- [ ] Document recommended production security headers
- [ ] Add Content Security Policy deployment guidance

---

## Medium Priority

### General

- [x] Replace emoji with SVG icons (emoji is still full failthrough)
- [ ] Add subtle category banner patterns
- [x] Dynamically load theme CSS from the trusted theme registry
- [ ] But I think we can make that significantly cleaner in a later pass by having renderPreviewCard() return a fully interactive card instead of a passive one.

### Generation UX

- [ ] If deck generation fails for any reason (validation or no eligible cards),
clear the existing preview and print output so the UI never displays a stale
deck that does not correspond to the current builder settings.

---

## Application and Canonical Pack Separation

Decouple the generic conversation-deck application from the
Trail Talk canonical card pack.

The application will own deck generation, validation, themes,
printing, and installed-pack management.

Trail Talk will become one installed card pack under:

data/trail-talk/

---


## Catalog Pack System

Replace the three hardcoded core catalog paths with an
explicit registry of installed catalog packs.

A catalog pack is a distribution boundary, while an edition
remains a semantic card-selection boundary.

Each pack may contribute:

- cards
- categories
- editions
- pack metadata such as ID, name, version, author, and license

Runtime requirements:

- Load registered packs concurrently.
- Combine each catalog type in memory.
- Validate every record using existing validators.
- Enforce global uniqueness across all installed packs.
- Validate relationships after all packs are merged.
- Reject the entire startup transaction if any pack fails.
- Preserve the existing `state.cards`, `state.categories`,
  and `state.editions` runtime model.
- Report validation errors with the originating pack ID.

Future considerations:

- Optional catalog files
- Pack dependencies
- Compatibility versions
- Enable/disable controls
- Pack provenance in manifests
- Standalone pack validation tooling

---

## Builder Evolution

Expand the deck builder to support additional generation filters.

Potential controls:

- Audience (Family / Mixed / Adults)
- Sensitivity level
- Card-type selection
- Difficulty
- Icebreaker mode
- Time available
- Group size (optional)

Requirements:

- UI controls
- Input validation
- Manifest support
- Deterministic Deck ID participation
- Builder state persistence

---

## Documentation

- [ ] Create ARCHITECTURE.md
- [ ] Create CONTRIBUTING.md

---

## Someday

### Features

- [ ] QR code support
- [ ] Community question submission

### Theme System

- [ ] Add additional official themes
  - Classic
  - Dark
  - Topographic
  - National Parks
  - Retro Camp

- [ ] Expand renderer options

```javascript
renderPrintPage(cards, {
  type: "front",
  theme: "classic",
});
```
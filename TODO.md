# TODO

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
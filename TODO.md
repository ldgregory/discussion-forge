# TODO

## High Priority

### General

- [ ] Make deck identifier deterministic from the generated deck
- [ ] Remove the legacy deck summary (yellow box)
- [ ] Make preview cards visually match the printed cards
- [ ] Keep the print renderer completely independent of interactive preview styles

### Security

- [x] Define SVG acceptance and sanitization workflow
- [ ] Document recommended production security headers
- [ ] Add Content Security Policy deployment guidance

---

## Medium Priority

### General

- [ ] Replace emoji with SVG icons
- [ ] Add subtle category banner patterns
- [ ] Dynamically load theme CSS from the trusted theme registry

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
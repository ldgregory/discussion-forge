# TODO

## High Priority

### Security

- [ ] Add Secure by Design requirements to PROJECT.md
- [ ] Add SECURITY.md
- [ ] Inventory every use of innerHTML and insertAdjacentHTML
- [ ] Replace untrusted-text rendering with DOM APIs and textContent
- [ ] Add strict catalog and theme validation
- [ ] Define canonical theme asset names and required files
- [ ] Define SVG acceptance and sanitization policy
- [ ] Remove dynamic inline styles in preparation for CSP
- [ ] Document recommended production security headers
- [ ] Add integrity metadata to catalog and theme formats

### General

- [x] Increase center icon size
- [x] Keep hole-punch guide on card backs only
- [x] Remove trim marks from fronts
- [x] Replace remaining “Convoy Conversations” branding with “Trail Talk”
- [ ] Deck ID correction
- [ ] Remove duplicate yellow box for Deck information
- [ ] Fix theme folder structure so index is at js/themes and each theme has it's own subfolder with assets.

### Preview and Print Architecture

- [x] Separate preview rendering from print rendering
- [x] Preserve one shared generated-deck data source
- [ ] Make preview cards visually match the printed design
- [x] Add preview card flip to show the back
- [x] Add restrained drop shadows and hover/focus states
- [ ] Keep print renderer free of interactive presentation styles

## Medium Priority

### General

- [ ] Replace emoji with SVG icons
- [ ] Add subtle category banner patterns

## Someday

### General

- [ ] QR code support
- [ ] Community question submission

### Future Themes

- [ ] Add theme support after multiple real themes exist
  - Classic
  - Dark
  - Topographic
  - National Parks
  - Retro Camp
- [ ] Use an options object for renderer configuration

```javascript
renderPrintPage(cards, {
  type: "front",
  theme: "classic",
});
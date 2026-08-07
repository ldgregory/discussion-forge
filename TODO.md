# TODO

## High Priority

### Discussion Forge / card-pack separation

- [ ] Complete application-owned branding cleanup:
  - `index.html` page title, heading, metadata, and noscript text
  - `README.md` application description
  - `SECURITY.md` project terminology
  - `PROJECT.md` application terminology
  - `CHANGELOG.md` current header wording only
  - `css/styles.css` file-level comment
  - `js/app.js` remaining Trail Talk-specific runtime comments
  - `js/utils.js` generic encoding comment
  - `themes/index.js` registry wording
- [ ] Include active card-pack identity in generated deck manifests.
- [ ] Include active card-pack ID and version in deterministic deck identity.
- [ ] Add a card-pack selector to the builder.
- [ ] Populate the selector from `CARD_PACK_REGISTRY` rather than hardcoded UI options.
- [ ] Switch packs through `activateCardPack(cardPackId)` and rebuild pack-dependent controls.
- [ ] Clear generated preview, print output, and stale manifest data when the active card pack changes.
- [ ] Validate that a loaded pack manifest ID matches its registry ID.

### Card-pack runtime and validation

- [ ] Expand `validateCardPackManifest()` beyond the currently consumed runtime fields.
- [ ] Validate pack compatibility using `minimum_application_version`.
- [ ] Validate pack dependencies before activation.
- [ ] Report card-pack validation failures with the originating pack ID.
- [ ] Decide whether registry entries should be deeply frozen or otherwise protected from accidental mutation.
- [ ] Preserve fail-closed activation: a failed pack load must leave the previously active trusted state intact.

### Theme decoupling

- [ ] Decide whether bundled themes are generic Discussion Forge themes or Trail Talk-specific themes.
- [ ] Replace fixed Trail Talk text references in theme comments and documentation with semantic names where appropriate.
- [ ] Rename `THEMES.md` to `THEME-PACK.md`.
- [ ] Generalize the theme specification wording around the application/pack ownership model.

---

## Medium Priority

### Builder evolution

Expand the deck builder with additional generation filters only after the card-pack selector and activation flow are stable.

Potential controls:

- Audience (Family / Mixed / Adults)
- Sensitivity level
- Card-type selection
- Difficulty
- Icebreaker mode
- Time available
- Group size (optional)

Requirements for each new filter:

- UI control
- Input validation
- Manifest support
- Deterministic Deck ID participation
- Builder state persistence

### Preview and rendering

- [ ] Make preview cards visually match printed cards more closely.
- [ ] Keep the print renderer completely independent of interactive preview styles.
- [ ] Refactor `renderPreviewCard()` so it can return a fully interactive card rather than a passive preview.
- [ ] Add subtle category banner patterns.

### Generation UX

- [ ] If deck generation fails for any reason, clear existing preview and print output so stale output never represents invalid or changed builder settings.

### Security

- [ ] Document recommended production security headers.
- [ ] Add Content Security Policy deployment guidance.
- [ ] Create standalone validation tooling for submitted card packs before approval.

### Documentation

- [ ] Create `ARCHITECTURE.md` after the current identity/card-pack refactor stabilizes.
- [ ] Create `CONTRIBUTING.md` after the pack contribution workflow stabilizes.
- [ ] Update `CARD-PACK.md` to use generic application terminology while preserving Trail Talk as the canonical example pack.

---

## Low Priority

### Card-pack ecosystem

- [ ] Optional catalog files within a card pack.
- [ ] Enable/disable controls for installed card packs.
- [ ] Pack provenance details in generated manifests.
- [ ] Additional compatibility/version negotiation beyond the minimum application version.
- [ ] Consider whether card-pack discovery should eventually move from static registration to a data-driven registry.

### Features

- [ ] QR code support.
- [ ] Community question submission and approval workflow.

### Theme system

- [ ] Add additional official themes:
  - Classic
  - Dark
  - Topographic
  - National Parks
  - Retro Camp
- [ ] Expand renderer configuration options, for example:

```javascript
renderPrintPage(cards, {
  type: "front",
  theme: "classic",
});
```

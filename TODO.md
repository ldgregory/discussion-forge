# TODO

## High Priority

### Card-pack runtime and validation

- [ ] Validate that a loaded pack manifest ID matches its registry ID.
- [ ] Expand `validateCardPackManifest()` beyond the currently consumed runtime fields.
- [ ] Validate pack compatibility using `minimum_application_version`.
- [ ] Validate pack dependencies before activation.
- [ ] Report card-pack validation failures with the originating pack ID.
- [ ] Decide whether registry entries should be deeply frozen or otherwise protected from accidental mutation.
- [ ] Decide whether `sample-trivia` remains bundled as a visible example pack, moves to developer/test fixtures, or becomes documentation-only sample content.

### Application / card-pack decoupling cleanup

- [ ] Complete remaining application-owned branding and terminology cleanup:
  - `README.md`
  - `SECURITY.md`
  - `PROJECT.md`
  - `CHANGELOG.md`
  - `CARD-PACK.md`
  - `THEMES.md`
  - `css/styles.css` file-level comments
  - `js/app.js` remaining Trail Talk-specific comments that describe application behavior rather than the Trail Talk pack
  - `js/utils.js` generic encoding comments
  - `themes/index.js` registry wording
- [ ] Decide whether bundled themes are generic Discussion Forge themes or Trail Talk-specific themes.
- [ ] Replace fixed Trail Talk text references in theme comments and documentation with semantic names where appropriate.
- [ ] Rename `THEMES.md` to `THEME-PACK.md`.
- [ ] Generalize the theme specification wording around the application/card-pack ownership model.

### Documentation synchronization

- [ ] Update `CARD-PACK.md` for the now-implemented multi-pack runtime and selector model while preserving Trail Talk as the canonical example pack.
- [ ] Document the card-pack registration contract and directory structure, including the relationship between registry ID and manifest ID.
- [ ] Document pack-switch behavior: validated load, activation, pack-dependent control refresh, and stale generated-output clearing.
- [ ] Create `ARCHITECTURE.md` now that the application/card-pack separation has stabilized.

---

## Medium Priority

### Builder evolution

Expand the deck builder with additional generation filters after card-pack manifest validation and compatibility handling are complete.

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
- Deterministic Deck ID participation where generation results can change
- Builder state persistence

### Preview and rendering

- [ ] Add subtle category banner patterns.
- [ ] Add regression tests or a repeatable manual test checklist to ensure preview and printable output continue to use the same canonical card renderers.

### Generation UX

- [ ] If deck generation fails for any reason, clear existing preview and print output so stale output never represents invalid or changed builder settings.
- [ ] Consider displaying active card-pack name/version in the preview summary so generated output is visually attributable before manifest download.

### Security

- [ ] Document recommended production security headers.
- [ ] Add Content Security Policy deployment guidance.
- [ ] Create standalone validation tooling for submitted card packs before approval.

### Contribution workflow

- [ ] Create `CONTRIBUTING.md` after the pack contribution workflow and validation requirements stabilize.
- [ ] Define a repeatable acceptance checklist for bundled/community card packs.

---

## Low Priority

### Card-pack ecosystem

- [ ] Optional catalog files within a card pack.
- [ ] Enable/disable controls for installed card packs.
- [ ] Pack provenance details in generated manifests.
- [ ] Additional compatibility/version negotiation beyond the minimum application version.
- [ ] Consider whether card-pack discovery should eventually move from static registration to a data-driven registry.
- [ ] Consider whether selector display labels should come from registry metadata, preloaded manifest metadata, or the current humanized pack ID.

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

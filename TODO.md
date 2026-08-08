# TODO

## High Priority

### Card-pack runtime and validation

- [ ] Expand `validateCardPackManifest()` beyond the currently consumed runtime fields.
- [ ] Validate pack compatibility using `minimum_application_version`.
- [ ] Validate pack dependencies before activation.
- [ ] Report card-pack validation failures with the originating pack ID.
- [ ] Decide whether registry entries should be deeply frozen or otherwise protected from accidental mutation.
- [ ] Decide whether `sample-trivia` remains bundled as a visible example pack, moves to developer/test fixtures, or becomes documentation-only sample content.

### Application / card-pack decoupling cleanup

- [ ] Complete remaining application-owned branding and terminology cleanup in code and comments:
  - `css/styles.css` file-level comments
  - `js/app.js` remaining Trail Talk-specific comments that describe application behavior rather than the Trail Talk pack
  - `js/utils.js` generic encoding comments
  - `themes/index.js` registry wording
- [ ] Decide whether bundled themes are generic Discussion Forge themes or Trail Talk-specific themes.
- [ ] Replace fixed Trail Talk text references in theme comments with semantic names where appropriate.

### Documentation synchronization

- [ ] Create `ARCHITECTURE.md` now that the application/card-pack separation has stabilized.

---

## Medium Priority

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

### Advanced deck settings

Add an **Advanced Deck Settings** area for optional card metadata filters after the v1.0 release.

The area should be hidden or collapsed by default and populated dynamically from metadata actually present in the active card pack. A filter should appear only when the loaded cards contain meaningful values for that field. For example, if a pack uses `experience_level` but never uses `sensitivity`, the advanced settings should expose experience-level controls and omit sensitivity controls entirely.

Potential dynamic filters include:

- Experience level
- Audience
- Sensitivity level
- Response style
- Answer length
- Card type
- Group familiarity
- Difficulty or other future pack-defined metadata
- Icebreaker mode
- Time available
- Group size (optional)

Requirements for advanced filters:

- Discover available filter dimensions and values from the validated active catalog rather than hardcoding pack-specific controls.
- Render only controls that are relevant to the active card pack.
- Rebuild advanced settings whenever the active card pack changes.
- Prefer checkboxes for multi-select dimensions and dropdowns/radios where a single selection is more appropriate.
- Keep the basic deck-builder experience uncluttered when advanced settings are not needed.
- Validate all selected values before generation.
- Include filter state in generated manifests.
- Include filters in deterministic Deck ID inputs whenever they can change the generated card set.
- Preserve builder state only where doing so is safe and meaningful across pack changes.
- Clear or invalidate generated output when an advanced filter changes in a way that makes existing output stale.

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

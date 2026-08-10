# Discussion Forge Testing

This document defines the repeatable automated and manual checks used before merging release-facing changes and before publishing a Discussion Forge release.

The automated suite protects data contracts and small isolated runtime helpers. The manual regression checklist covers browser behavior, rendering, printing, and workflows that are not currently exercised by browser automation.

---

## Automated Tests

Run the complete Node test suite from the repository root:

```bash
npm test
```

All tests must pass before a release candidate is accepted.

The current automated suite covers:

- card-pack manifest validation and normalization
- card validation and metadata allowlists
- category validation
- edition validation
- catalog-integrity relationships
- theme validation and path safety
- recursive configuration freezing
- generated-output clearing behavior

When a bug is practical to reproduce in an isolated module, prefer adding a regression test before considering the bug closed.

---

## Browser Regression Checklist

Run these checks using the release candidate from a local HTTP server or the intended deployment environment.

Use a browser cache bypass when validating changed CSS or theme assets. In Firefox, opening Developer Tools and enabling **Network → Disable Cache** before reloading is the most reliable development check.

### Application startup

- [ ] Discussion Forge loads without uncaught console errors.
- [ ] Trail Talk loads as the default card pack.
- [ ] Card Pack, Theme, Edition, Category, Deck Size, Seed, and Output Mode controls are usable.
- [ ] Builder summary values update when selections change.

### Card-pack switching

Test both bundled packs:

- [ ] Switch from Trail Talk to Sample Trivia successfully.
- [ ] Editions and categories rebuild for the newly active pack.
- [ ] Available-card count reflects the active pack and selections.
- [ ] Generate a valid deck from Sample Trivia.
- [ ] Switch back to Trail Talk and generate a valid deck.
- [ ] No card-pack-specific text or controls from the previous pack remain visible after switching.

### Theme switching

Test both bundled themes with both bundled card packs:

- [ ] Trail Blue loads and renders successfully.
- [ ] Trail Charcoal loads and renders successfully.
- [ ] Trail Talk category-specific banner patterns render correctly:
  - Gear & Vehicle: tire-tread treatment
  - Story Time: radiating arcs
  - Lightning Round: diagonal speed lines
  - Wild Cards: offset lozenge treatment
- [ ] Sample Trivia uses the generic Discussion Forge category-banner fallback pattern.
- [ ] Category icons fall back gracefully when a theme-specific SVG is unavailable.
- [ ] Card-back artwork and text remain legible in both themes.

### Deck generation

- [ ] Generate a deck using the default builder settings.
- [ ] The generated card count matches the requested size when enough eligible cards exist.
- [ ] A shortage message is shown when fewer eligible cards exist than requested.
- [ ] The same seed and identical builder selections reproduce the same ordered deck and deterministic Deck ID.
- [ ] Changing a generation input that affects the eligible card set changes generated output as expected.
- [ ] Generated cards retain stable one-based deck positions.

### Generation failure and stale-output protection

Begin each failure test with a valid generated deck visible.

- [ ] Clear all edition selections and click Generate Deck.
- [ ] The existing preview disappears.
- [ ] The status message explains that at least one edition and category must be selected.
- [ ] Restore a valid edition/category selection and generate again successfully.
- [ ] Enter an invalid deck size such as `0` and click Generate Deck.
- [ ] The existing preview disappears.
- [ ] The validation error is shown in the status area.
- [ ] Restore a valid deck size and generate again successfully.
- [ ] A configuration with zero eligible cards clears previous generated output and reports that no cards match.

The preview and printable DOM outputs are cleared by the same generated-output helper. Visual confirmation of the preview plus the automated `generated-output` tests covers both output containers without requiring interaction with the browser print modal.

---

## Canonical Preview / Print Rendering Regression

Preview and print must continue to use the same canonical front and back card renderers. These checks are specifically intended to detect accidental divergence.

Generate a Trail Talk deck containing at least one card from each available category when practical.

### Card fronts

For several cards, compare the interactive preview card against the corresponding print-preview card face:

- [ ] Category banner color matches.
- [ ] Category banner pattern matches.
- [ ] Category icon matches.
- [ ] Category label matches.
- [ ] Main category artwork/icon matches.
- [ ] Prompt text matches exactly.
- [ ] Optional instruction text matches exactly.
- [ ] Deck position/footer identity matches.
- [ ] Font sizing, wrapping, alignment, and spacing are materially consistent.

### Card backs

- [ ] Preview and printable backs use the same active theme.
- [ ] Card-pack title matches.
- [ ] Tagline matches.
- [ ] Brand text matches.
- [ ] Decorative card-back artwork matches.
- [ ] Punch guide appears only where intended by the output contract.

A difference caused solely by preview interaction mechanics, such as the flip wrapper, is acceptable. Semantic card content and canonical face rendering must not differ.

---

## Preview Interaction

- [ ] Clicking a preview card flips it to the back.
- [ ] Clicking it again returns it to the front.
- [ ] Keyboard activation works on a focused preview card.
- [ ] The card's accessible label/state changes appropriately when flipped.
- [ ] Multiple preview cards can be flipped independently.

---

## Quick List

- [ ] Quick List contains the same number of cards as the generated deck.
- [ ] Deck positions correspond to the card preview/print positions.
- [ ] Category name/icon information corresponds to each source card.
- [ ] Prompt text matches the card.
- [ ] Optional instruction text appears when present and is omitted gracefully when absent.
- [ ] Switching back from Quick List to card preview does not regenerate or reorder the deck.

---

## Manifest Download

- [ ] Download Manifest becomes usable only when a generated manifest exists.
- [ ] Downloaded manifest parses as valid JSON.
- [ ] Card-pack ID and version match the active pack.
- [ ] Theme matches the generation configuration.
- [ ] Selected editions and categories match the builder state used to generate the deck.
- [ ] Requested and playable card counts are correct.
- [ ] Deck ID shown in the application matches the downloaded manifest.
- [ ] Ordered manifest card positions and UUIDs correspond to the generated deck.

---

## Print Regression

Use print preview before committing paper or laminate.

- [ ] Printable output contains six cards per card-face page when enough cards remain.
- [ ] Front and back pages alternate as paired pages: fronts, matching backs, fronts, matching backs.
- [ ] Back-page card ordering correctly mirrors the matching front page for duplex alignment.
- [ ] Card dimensions remain 2.40 × 3.40 inches at 100% scale.
- [ ] Printing at 100% scale preserves expected dimensions.
- [ ] Duplex printing uses **Flip on long edge**.
- [ ] Fronts do not show manufacturing trim/punch guides that are intended only for backs.
- [ ] Back punch guides and other manufacturing guides remain correctly positioned.
- [ ] No card content is clipped at normal print scale.
- [ ] Category patterns remain visible but subtle in print.

For a release candidate that changes card geometry, print CSS, page ordering, or manufacturing guides, perform a physical duplex test rather than relying only on browser print preview.

---

## Responsive / Small-Screen Smoke Test

- [ ] At desktop width, builder content and builder controls use the intended two-column layout.
- [ ] At narrower widths, the builder collapses cleanly without horizontal overflow.
- [ ] At phone-scale width, card preview becomes a single-column layout.
- [ ] Controls remain readable and operable without overlapping content.
- [ ] Builder summary remains readable after its responsive collapse.

---

## Accessibility Smoke Test

- [ ] Primary controls can be reached with the keyboard.
- [ ] Visible focus indication is present for interactive controls.
- [ ] Preview cards can be operated without a mouse.
- [ ] Status messages are announced through the live region when generation succeeds or fails.
- [ ] Meaningful text remains available when decorative images fail to load.
- [ ] Theme/category colors retain readable text contrast.

---

## Release Acceptance

A release candidate is ready for publication when:

- [ ] `npm test` passes with zero failures.
- [ ] Both bundled card packs pass the browser regression checklist.
- [ ] Both bundled themes pass the theme and rendering checks.
- [ ] Preview and print canonical-renderer checks pass.
- [ ] Quick List and manifest checks pass.
- [ ] Print preview passes, and a physical duplex test has been completed when print-related code changed.
- [ ] Responsive and accessibility smoke tests pass.
- [ ] No known release-blocking console errors or stale-output behavior remain.

Record any accepted non-blocking defects in `TODO.md` rather than relying on memory.

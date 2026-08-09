# TODO

## Medium Priority

### Preview and rendering

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

## Low Priority / Post-v1.0

### Sample Trivia demonstration pack

Retain `sample-trivia` as a bundled example card pack that demonstrates the Discussion Forge card-pack format and provides controlled sample content for exercising application features.

- [ ] Expand the Sample Trivia catalog beyond the initial small demonstration set.
- [ ] Deliberately vary optional card metadata such as experience level, audience, sensitivity, response style, answer length, and group familiarity.
- [ ] Ensure metadata combinations are diverse enough to exercise dynamic Advanced Deck Settings discovery and filtering.
- [ ] Keep the pack small enough to remain understandable as reference content for prospective card-pack authors.
- [ ] Use Sample Trivia to demonstrate card-pack capabilities without introducing Trail Talk-specific assumptions into application behavior.

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

### Flashcards

Add a first-class `flash-card` card type for study and learning card packs.

- [ ] Define the `flash-card` data contract and required/optional fields.
- [ ] Render the question or study prompt on the front and the answer on the back.
- [ ] Remove decorative front imagery for flashcards so the available face area is prioritized for readable study content.
- [ ] Treat the answer side as functional study content rather than a conventional themed card back.
- [ ] Determine which theme responsibilities still apply to flashcards, such as typography, borders, category treatment, print guides, and general presentation, without allowing decorative card-back identity to interfere with the answer.
- [ ] Preserve category and edition support so flashcard packs can be filtered and organized using the existing card-pack model.
- [ ] Ensure preview, print, Quick List, deterministic identity, and generated manifests understand the `flash-card` type.
- [ ] Consider future study modes such as reversible question/answer cards without making them part of the initial flashcard implementation.

### Card-pack creator toolkit

Create a non-developer-friendly authoring workflow that lets card-pack creators work in a validated spreadsheet instead of manually writing JSON.

- [ ] Create a downloadable card-pack authoring workbook with:
  - Sheet 1: Instructions
  - Sheet 2: Manifest
  - Sheet 3: Editions
  - Sheet 4: Categories
  - Sheet 5: Cards / Questions
- [ ] Organize data columns with required fields first and optional fields continuing to the right.
- [ ] Use workbook validation and dropdowns wherever practical for controlled values.
- [ ] Build Cards-sheet edition and category choices from the values entered on the Editions and Categories sheets.
- [ ] Define a portable, macro-free convention for multi-value fields such as cards belonging to multiple editions or categories.
- [ ] Flag missing required values, invalid IDs, invalid controlled values, and useful length limits within the workbook where practical.
- [ ] Avoid requiring creators to supply mechanical metadata that the creator can safely generate, such as card UUIDs and generated timestamps.
- [ ] Treat the workbook as a human-friendly authoring schema rather than requiring a one-to-one representation of runtime JSON.

Create a **Discussion Forge Card Pack Creator** that accepts the completed workbook and produces a validated distributable package.

- [ ] Validate workbook structure and schema before conversion.
- [ ] Validate cross-sheet references and relationships.
- [ ] Normalize authoring values into the strict Discussion Forge runtime schema.
- [ ] Present actionable validation errors and warnings before package generation.
- [ ] Generate `manifest.json`, `editions.json`, `categories.json`, and `cards.json`.
- [ ] Package generated files under a web-root-compatible hierarchy:

```text
data/
└── <card-pack-id>/
    ├── manifest.json
    ├── editions.json
    ├── categories.json
    └── cards.json
```

- [ ] Generate a downloadable `.zip` containing the correct folder hierarchy.
- [ ] Keep theme creation optional so a valid card pack can use existing Discussion Forge themes without requiring theme-design knowledge.
- [ ] Consider optional theme-authoring support that can generate the expected `themes/<theme-id>/` hierarchy and requisite files/assets.
- [ ] Reuse the same validation contracts as the Discussion Forge runtime wherever practical so creator validation and runtime validation cannot silently diverge.

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

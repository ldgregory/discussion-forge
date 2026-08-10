# TODO

## High Priority / v1.0

### Generation UX

- [ ] Finish semantic live-status classifications so success/info messages use the success treatment, validation/warning messages use the warning treatment, and actual load/runtime failures use the error treatment.
- [ ] Classify deck-size validation messages such as `Deck size must be between 1 and 250.` as warnings rather than runtime errors.
- [ ] Review every remaining `setStatus()` call so no message accidentally inherits an inappropriate severity.
- [ ] Add automated coverage for status classification where practical.

### Bundled-content validation

- [ ] Add an integration test that loads and validates the actual bundled Trail Talk pack rather than only validator fixtures.
- [ ] Add equivalent integration validation for the Sample Trivia pack.
- [ ] Validate bundled themes during automated tests.
- [ ] Run catalog-integrity validation against the real bundled catalogs.
- [ ] Fail automated validation when a pack manifest `card_count` disagrees with the validated card catalog.
- [ ] Add a release-level validation path that can answer: "Do the files we are actually about to ship form a valid Discussion Forge installation?"

### v1.0 release acceptance

- [ ] Create and execute a v1.0 release checklist covering:
  - `node --check`
  - `npm test`
  - clean browser console
  - Trail Blue browser preview
  - Trail Charcoal browser preview
  - Quick List
  - card flipping and keyboard behavior
  - deterministic generation
  - manifest download
  - stale-output clearing
  - 100% print scale
  - duplex long-edge alignment
  - print backgrounds enabled
  - browser headers/footers disabled
  - physical card dimensions
  - punch-safe area
- [ ] Perform a final keyboard-only accessibility pass.
- [ ] Perform a final narrow/mobile-layout pass.
- [ ] Perform a final print/PDF regression pass.

---

## Medium Priority

### Generation UX

- [ ] Consider displaying active card-pack name/version in the preview summary so generated output is visually attributable before manifest download.

### Deck generation limits

- [ ] Document the purpose of `maxDeckSize` and why a defensive generated-deck limit exists independently of catalog-size limits.
- [ ] Revisit whether 250 remains the appropriate application-wide maximum after v1.0 testing.
- [ ] Consider whether a future maximum should remain application-wide, be pack-defined, or be derived from the number of eligible cards.
- [ ] Keep catalog-size limits and generated-deck-size limits conceptually and operationally separate.

### Documentation

- [ ] Ensure the README clearly distinguishes Discussion Forge (application) from Trail Talk (bundled content pack).
- [ ] Document the card-pack/theme trust boundary and validation pipeline.
- [ ] Document the print settings exposed by the UI and the known-good physical print workflow.
- [ ] Document deterministic Deck ID behavior, including which configuration changes alter Deck ID inputs.

### Security

- [ ] Document recommended production security headers.
- [ ] Add Content Security Policy deployment guidance.
- [ ] Create standalone validation tooling for submitted card packs before approval.

### Contribution workflow

- [ ] Create `CONTRIBUTING.md` after the pack contribution workflow and validation requirements stabilize.
- [ ] Define a repeatable acceptance checklist for bundled/community card packs.

---

## Low Priority / Post-v1.0

### Survival Craft Trail Talk edition

Create a `survival-craft` Trail Talk edition focused on outdoor skills, preparedness, self-reliance, emergency decision-making, and deliberately playful survival hypotheticals. Keep it conversational rather than turning it into a survival-skills examination.

Use this edition as an early real-world project for the Card-pack Creator Toolkit workbook so the spreadsheet authoring workflow is exercised against meaningful multi-category, multi-edition, and advanced-metadata content.

#### Proposed new categories

- **Craft** (`craft`) — fire, navigation, shelter, water, knots, weather awareness, wild plants, primitive skills, and fieldcraft.
- **Hunting** (`hunting`) — hunting skills, bows, game processing, food procurement, traps, and snares.
- **Safety** (`safety`) — first aid, emergency preparedness, survival equipment, contingency planning, and risk awareness.
- **Zombie Apocalypse** (`zombie-apocalypse`) — intentionally ridiculous disaster/survival hypotheticals intended primarily for fun and group discussion.
- Reuse existing **Story Time**, **Lightning Round**, and **Wild Card** categories where those interaction styles are the card's primary presentation.

Cards may belong to more than one category. Preserve a single `visual.primary_category` for banner/icon presentation while additional categories provide semantic filtering. Cards may likewise belong to both an existing Trail Talk edition and `survival-craft` rather than being removed from their useful existing editions.

#### Proposed Survival Craft cards

Wording below is the working editorial wording to carry into the creator workbook.

**Craft / fieldcraft**

- [ ] Can you start a fire with only flint and steel? — categories: `craft`.
- [ ] Can you confidently determine your direction of travel without a compass, GPS, or phone? — categories: `craft`.
- [ ] Can you build a shelter from natural materials? — categories: `craft`.
- [ ] Can you confidently identify wild plants that are safe to eat? — categories: `craft`.
- [ ] Could you build a functional trap or snare if you had to? — categories: `craft`, `hunting`.
- [ ] Can you navigate with a paper topographic map and compass? — categories: `craft`.
- [ ] Could you find and make water safe to drink if your carried water were gone? — categories: `craft`, `safety`.
- [ ] Can you tie three knots you would trust with your safety or equipment? — categories: `craft`, `safety`.
- [ ] Could you keep yourself warm overnight without a tent? — categories: `craft`, `safety`.
- [ ] Can you recognize the signs of approaching dangerous weather? — categories: `craft`, `safety`.

**Hunting / food procurement**

- [ ] Can you hunt with a bow? — categories: `hunting`.
- [ ] Can you make a functional bow? — categories: `hunting`, `craft`.
- [ ] Do you know how to skin and dress game? — categories: `hunting`.

**Safety / preparedness**

- [ ] Do you know basic first aid? — categories: `safety`.
- [ ] Do you know advanced first aid? — categories: `safety`; candidate experienced-level card.
- [ ] What's the one emergency item you think most people forget to carry? — categories: `safety`.
- [ ] Have you ever used your first-aid training in a real situation? — categories: `safety`, `story-time`.
- [ ] What emergency skill do you know you need to learn but haven't yet? — categories: `safety`.
- [ ] If your vehicle became completely disabled tonight, how long could you comfortably stay where you are? — categories: `safety`; also candidate for `recovery` edition membership.

**Story Time**

- [ ] Have you ever gotten lost in the outdoors? — categories: `story-time`, `craft`.
- [ ] Have you ever had to improvise a repair to get yourself home? — categories: `story-time`, `safety`.
- [ ] What's the closest you've come to running out of something essential? — categories: `story-time`, `safety`.
- [ ] Tell us about a time the weather forced you to completely change your plans. — categories: `story-time`, `safety`.
- [ ] What's a mistake you made outdoors that you'll never make again? — categories: `story-time`, `safety`.

**Lightning Round**

- [ ] Do you know how to find the North Star at night? — categories: `lightning`, `craft`.
- [ ] What survival gear do you have in your vehicle? — categories: `lightning`, `safety`.
- [ ] What survival gear do you have in your pack? — categories: `lightning`, `safety`.
- [ ] You are stuck on a deserted island. What three non-survival items do you bring for comfort? — categories: `lightning`.
- [ ] You must bring one fictional character with you to survive a month in the woods. Who do you pick, and do they help or just annoy you? — categories: `lightning`.
- [ ] Your only weapon in a disaster is the last item you touched with your left hand. What is your weapon? — categories: `lightning`, `zombie-apocalypse`.
- [ ] You are very hungry. Do you eat a large bowl of crunchy bugs or one mystery roadkill stew? — categories: `lightning`.
- [ ] You can only eat one single food item for the next five years of survival. What do you pick? — categories: `lightning`.
- [ ] You have an endless supply of one condiment to make gross survival food taste better. Do you choose ketchup, hot sauce, or ranch? — categories: `lightning`.
- [ ] Knife or hatchet? — categories: `lightning`, `craft`.
- [ ] Lighter or ferro rod? — categories: `lightning`, `craft`.
- [ ] Map or compass? — categories: `lightning`, `craft`.
- [ ] Water or shelter? — categories: `lightning`, `craft`.
- [ ] Fire or sleeping bag? — categories: `lightning`, `craft`.
- [ ] Signal mirror or whistle? — categories: `lightning`, `safety`.
- [ ] One gallon of water or one extra gallon of fuel? — categories: `lightning`, `safety`.

**Zombie Apocalypse**

- [ ] You can pick three people in this group to join your zombie apocalypse team. Who is the first person you cut, and who is your MVP? — categories: `zombie-apocalypse`; candidate `friends`-only and medium sensitivity.
- [ ] Do you hide out in an abandoned Costco, a high-security prison, or your vehicle in the deep forest? — categories: `zombie-apocalypse`.
- [ ] The vehicle you're driving right now is your apocalypse vehicle. What's its biggest weakness? — categories: `zombie-apocalypse`, `safety`.
- [ ] You get one unlimited resource: fuel, clean water, food, or ammunition. Which one? — categories: `zombie-apocalypse`, `lightning`.
- [ ] Someone in your group gets bitten but insists it's "probably nothing." What's the group policy? — categories: `zombie-apocalypse`.
- [ ] You can raid one store before leaving civilization. Which store? — categories: `zombie-apocalypse`, `lightning`.
- [ ] Your apocalypse base has electricity but no running water, or running water but no electricity. Which do you choose? — categories: `zombie-apocalypse`, `lightning`.
- [ ] You hear another group approaching your camp after dark. Hide, make contact, or leave? — categories: `zombie-apocalypse`.

#### Existing Trail Talk cards to add to the Survival Craft edition

Do not automatically remove these from their current editions. Add `survival-craft` as an additional edition where appropriate so the same canonical card can serve multiple deck contexts.

- [ ] What is the closest you have come to calling for help? — existing `recovery`, `campfire`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] Tell us about a trip you had to abandon. — existing `recovery`, `campfire`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] Tell us about the closest call you have had damaging your vehicle. — existing `recovery`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] What obstacle made you seriously question your choices? — existing `recovery`, `campfire`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] What recovery lesson did you learn the hard way? — existing `recovery`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] Tell us about weather that completely changed your plans. — existing `campfire`, `recovery`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] Tell us about a repair you improvised well enough to get home. — existing `recovery`, `campfire`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] What is the closest you have come to running out of something essential? — existing `recovery`, `campfire`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] What mistake have you made outdoors that you will never make again? — existing `campfire`, `recovery`; add `survival-craft`; semantic categories could include `story-time`, `safety`.
- [ ] What would make you turn around even if the trail were technically passable? — existing `core`, `recovery`; add `survival-craft`; semantic categories could include `safety`.
- [ ] What emergency item do you think most people forget to carry? — existing `core`, `recovery`; add `survival-craft`; semantic categories could include `safety`.
- [ ] If your vehicle became completely disabled tonight, how long could you comfortably stay where you are? — if already present in the canonical catalog when this edition is built, add `survival-craft`; categories: `safety`; preserve `recovery` where applicable.

Potential secondary cross-edition candidates to evaluate during workbook authoring rather than automatically migrate: `Maps or GPS?`, `Winch or traction boards?`, `Snow or sand?`, `What do you carry that most people do not?`, and `What piece of gear has earned your trust the hard way?`.

#### Survival Craft metadata / schema considerations

- [ ] Use deliberately varied advanced metadata so Survival Craft exercises Advanced Deck Settings well: experience level, group familiarity, sensitivity, response style, answer length, and card type.
- [ ] Consider experienced-only metadata for advanced first aid, game processing, hunting, and other questions where an experienced filter is meaningful.
- [ ] Keep playful hypotheticals broadly accessible while using `friends` and/or medium sensitivity where a prompt could put group members on the spot.
- [ ] Evaluate adding `skill` or `self-assessment` as a future `response_style` rather than forcing capability questions into `discussion` or `challenge`; prefer `skill` if a generic reusable style is added.
- [ ] Preserve multi-category semantics in the creator workbook and generated JSON while retaining one `visual.primary_category` for presentation.
- [ ] Use the creator workbook to test the portable multi-value convention for cards belonging to multiple categories and editions.

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
- Conversation depth (distinct from sensitivity: a reflective question can be deep without being sensitive)

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

# Discussion Forge Architecture

This document describes the runtime architecture of Discussion Forge, the boundaries between application code, card-pack content, and themes, and the invariants future development should preserve.

`PROJECT.md` describes the project's principles and major decisions. `SECURITY.md` defines the security model and trust boundaries. This document focuses on how the application is structured and how data moves through it.

---

## Architectural Goals

Discussion Forge is designed around a small set of architectural goals:

- Keep the application independent from any individual card pack.
- Keep card-pack content independent from application behavior.
- Keep visual presentation independent from card-pack data.
- Validate data before it enters trusted runtime state.
- Fail closed when replacement content cannot be loaded or validated.
- Keep generated decks reproducible when their identity inputs are unchanged.
- Share canonical rendering behavior between preview and printable output.
- Minimize third-party dependencies and preserve portable deployment.
- Make extension points explicit rather than allowing content packages to introduce executable behavior.

These goals are implementation constraints, not merely organizational preferences.

---

## System Boundaries

Discussion Forge has three primary architectural domains:

```text
Discussion Forge Application
│
├── Card Packs
│   ├── manifest metadata
│   ├── cards
│   ├── categories
│   └── editions
│
└── Themes
    ├── theme metadata
    ├── CSS
    └── reviewed presentation assets
```

### Application

The Discussion Forge application owns behavior.

Application responsibilities include:

- card-pack registration and loading
- validation orchestration
- runtime state
- builder controls
- deck generation
- deterministic deck identity
- preview rendering
- print rendering
- Quick List rendering
- generated manifests
- theme selection and application
- user interaction

Application code must not depend on Trail Talk, Sample Trivia, or any other individual pack for its identity or behavior.

### Card Packs

Card packs own content and pack-specific identity.

A card pack currently provides:

```text
data/<card-pack-id>/
├── manifest.json
├── cards.json
├── categories.json
└── editions.json
```

Pack-owned concerns include:

- pack ID and display name
- pack version and compatibility metadata
- author and licensing metadata
- card-back title, tagline, and brand text
- cards
- categories
- editions
- supported card metadata values present in the catalog

Card packs are data packages. They do not own application logic and must not gain executable runtime privileges.

### Themes

Themes own visual presentation.

Theme responsibilities include:

- theme identity and metadata
- CSS class and stylesheet
- theme-owned decorative assets
- visual styling of canonical application renderers

Themes do not own card content, deck-generation behavior, validation behavior, or application state.

---

## Runtime Model

The runtime can be summarized as:

```text
Trusted Configuration
├── Application configuration
├── Card Pack Registry
└── Theme Registry
          │
          ▼
Card-Pack Loading
          │
          ▼
Validation Layer
          │
          ▼
Trusted Runtime State
├── activeCardPack
├── catalog
│   ├── cards
│   ├── categories
│   └── editions
├── generated deck
├── generated manifest
└── active theme ID
          │
          ▼
Rendering / Export
├── Preview
├── Print Pages
├── Quick List
└── Manifest Download
```

The central rule is that externally represented card-pack data does not become trusted runtime state merely because it was successfully fetched.

---

## Configuration and Mutability

Discussion Forge distinguishes trusted configuration from intentionally mutable runtime state.

### Immutable Configuration

Application configuration and card-pack registry definitions are immutable.

Nested registry structures are protected with `deepFreeze()` so freezing applies to nested path objects and arrays as well as their root objects.

This prevents accidental runtime changes such as:

- changing a registered resource path
- adding or removing registry entries through array mutation
- changing nested trusted configuration after initialization

Theme definitions are likewise treated as trusted immutable configuration after validation and registration.

### Mutable Runtime State

The application-level `state` object is intentionally mutable.

It contains the currently active validated pack and catalog, generated deck state, generated manifest, and selected theme.

Mutable state is kept separate from immutable configuration so ordinary application behavior does not require modifying trusted definitions.

---

## Card-Pack Registry

Bundled card packs are available only through the trusted card-pack registry.

Each registry entry contains a stable pack ID and trusted relative paths to its resources.

Conceptually:

```text
registered pack ID
      │
      ▼
requireCardPack()
      │
      ├── known ID ──► trusted registered paths
      │
      └── unknown ID ──► reject
```

The caller selects a registered ID. The caller does not provide arbitrary paths.

This boundary is important both architecturally and for security: an unregistered card-pack ID cannot be transformed into an arbitrary resource path.

The registry is currently static and bundled with the application. A future data-driven registry may replace this implementation, but it must preserve the same trust boundary.

---

## Card-Pack Loading Pipeline

The card-pack loading pipeline intentionally separates lookup, transport, validation, and activation.

```text
requested card-pack ID
        │
        ▼
requireCardPack()
        │
        ▼
trusted registry entry
        │
        ▼
fetch manifest + catalogs
        │
        ▼
validate manifest
        │
        ├── registry/manifest ID match
        ├── application compatibility
        └── dependencies
        │
        ▼
validate catalog containers
        │
        ▼
record validators
        │
        ▼
catalog-integrity validator
        │
        ▼
validated card pack + catalog
        │
        ▼
activateCardPack()
        │
        ▼
trusted application state
```

### Lookup

`requireCardPack()` resolves a requested ID against the trusted registry and rejects unknown IDs before resource loading begins.

### Transport

`fetchJson()` loads same-origin JSON resources using trusted paths from the registry.

Transport success does not imply data validity.

### Validation

The manifest and catalogs are validated and normalized before activation.

### Activation

`activateCardPack()` publishes the validated card pack and catalog to application state only after the entire loading pipeline succeeds.

This separation allows a candidate pack to be completely evaluated without partially replacing the active trusted pack.

---

## Validation Architecture

Validation is implemented in dedicated modules rather than embedded throughout rendering and generation code.

Current validators are:

```text
js/validators/
├── card-pack-validator.js
├── card-validator.js
├── category-validator.js
├── edition-validator.js
├── catalog-integrity-validator.js
└── theme-validator.js
```

### Record Validators

Record validators validate individual objects and normalize accepted values into the representation consumed by the runtime.

They own intrinsic record contracts such as:

- required fields
- identifier formats
- string lengths
- Boolean values
- supported metadata values
- UUID format
- timestamps
- semantic versions
- normalized optional values

Validators should not need knowledge of the card-pack registry or UI state.

### Catalog Integrity

`catalog-integrity-validator.js` operates after individual records have been validated.

It owns relationships that cannot be established by validating a single record in isolation, including:

- unique card UUIDs
- unique category IDs
- unique edition IDs
- valid card-to-category references
- valid card-to-edition references
- primary-category membership
- manifest card-count agreement
- manifest/catalog category agreement
- manifest/catalog edition agreement

### Loading-Boundary Validation

Some checks intentionally remain in the application loading boundary because they describe the relationship between trusted application configuration and incoming data rather than the intrinsic validity of a record.

These include:

- catalog resources must be arrays
- catalog resources must remain within application size limits
- the validated manifest ID must match the trusted registry ID
- the pack's minimum application version must be compatible with the running application
- declared card-pack dependencies must be available and valid

### Validation Error Context

Individual validators remain registry-agnostic.

The loading layer wraps validation failures with the originating registered card-pack ID. The original error is retained as the error cause so debugging information and the original stack remain available.

This produces useful pack-level diagnostics without coupling reusable validators to registry behavior.

---

## Trust Lifecycle

Card-pack data moves through explicit trust stages:

```text
JSON resource
    │
    │ untrusted representation
    ▼
parsed JavaScript value
    │
    │ validation + normalization
    ▼
validated candidate data
    │
    │ cross-record integrity checks
    ▼
trusted candidate card pack
    │
    │ successful activation
    ▼
trusted runtime state
```

Bundled JSON is still validated at runtime. Being stored in the repository does not bypass the data contract.

Future imported or community-created packs must pass equivalent validation before they can cross the same trust boundary.

---

## Fail-Closed Activation

Card-pack switching is transactional from the perspective of trusted application state.

A candidate pack is loaded and validated before the active pack is replaced.

If loading or validation fails:

- the candidate pack is not activated
- partially validated candidate data is not published
- the previously active trusted pack remains active
- the card-pack selector can be restored to the previous valid selection
- existing generated output is not discarded merely because an invalid replacement was requested

After a successful pack change, generated output is cleared because output produced from the previous pack is now stale relative to the active builder state.

---

## Card-Pack Compatibility and Dependencies

A validated card-pack manifest can declare a minimum Discussion Forge application version.

The runtime compares that requirement against the current application version before activation. A pack requiring a newer application version is rejected.

A pack may also declare dependencies on other registered card packs.

Dependency validation currently requires:

- every dependency ID to exist in the installed registry
- a pack not to depend on itself

Dependency declarations do not grant one card pack executable access to another. They are compatibility and availability metadata within the content model.

---

## Theme Architecture

Themes are selected through a trusted theme registry.

Theme definitions are validated before use and include constrained metadata such as:

- ID
- name
- version
- author
- description
- license
- application class name
- stylesheet path
- asset-root path

Theme resource paths are constrained to the theme's own namespace. Path traversal, cross-theme resource ownership, Windows-style separators, and colon-containing paths are rejected by the theme contract.

The application uses a canonical fallback theme when necessary.

Theme assets are presentation resources, not arbitrary runtime content. Community theme assets must be reviewed and sanitized before becoming trusted bundled resources.

---

## Rendering Architecture

Discussion Forge separates canonical card construction from the contexts in which cards are displayed.

The same canonical front and back renderers are used for preview and printable cards.

```text
generated card
     │
     ├──► canonical front renderer ──► preview / print
     │
     └──► canonical back renderer  ──► preview / print
```

This prevents preview and printed output from gradually developing independent interpretations of a card.

### Preview

Preview is interactive presentation of the generated deck. Cards can expose front/back behavior without changing the canonical card content.

### Print

Printable output arranges canonical card faces into physical pages according to the printing contract.

The current contract uses:

- six playable cards per page
- a front page immediately followed by its matching back page
- duplex printing with long-edge flip
- manufacturing guides on backs only
- 2.40 × 3.40 inch cards

### Quick List

Quick List is an alternate representation of the same generated deck state. It does not generate a separate logical deck.

It preserves deck identity and permanent card positions while presenting content in a compact text-oriented form.

---

## Deck Generation Pipeline

Deck generation begins with validated runtime data and validated builder selections.

Conceptually:

```text
validated active catalog
        +
builder selections
        +
generation seed
        │
        ▼
eligible card set
        │
        ▼
deterministic shuffle / selection
        │
        ▼
ordered generated deck
        │
        ├── permanent deck positions
        ├── deterministic identity
        └── generated manifest
        │
        ▼
preview / print / Quick List
```

A generated deck is therefore derived state. It must not be treated as valid after builder inputs change in a way that affects generation.

Current and future filters that change the eligible card set must participate in stale-output handling and deterministic identity where appropriate.

---

## Deterministic Deck Identity

Discussion Forge distinguishes deterministic deck identity from generation-instance identity.

### Deterministic Identity

The deterministic Deck ID and SHA-256 fingerprint are derived from a canonical identity payload.

The payload currently includes the deck-identity schema version, generator version, active card-pack ID and version, generation seed, selected editions and categories, requested card count, and the ordered identities/content versions of generated cards.

The deck-identity schema version is an application-owned versioned constant. Its current value is defined in the implementation and should not be duplicated here.

The human-readable Deck ID is a shortened representation intended for printed and conversational use. The full fingerprint preserves the stronger machine-readable identity.

If a future feature can change the generated card set, that feature must be evaluated as a deck-identity input.

### Generation Instance Identity

Generated manifests also receive a UUID for the specific generation event.

Two generation events can therefore describe the same deterministic deck while still being distinct manifest instances.

---

## Permanent Deck Positions

Each generated card receives a permanent position within that generated deck.

The position is part of the deck instance's usable identity and supports:

- printed card numbering
- replacement-card workflows
- manifest reconstruction
- Quick List correspondence
- front/back pairing

A card's position is not a global property of the source card. It belongs to that generated deck.

---

## Generated Manifest

The generated manifest records enough information to identify and describe a generated deck and the inputs that produced it.

Its responsibilities include recording:

- Discussion Forge generator version
- active card-pack identity and version
- deterministic deck identity
- generation-instance identity
- generation seed
- relevant builder selections
- requested deck size
- ordered generated-card identity information

The manifest is an output artifact. It does not replace source card-pack validation and must not be treated as executable configuration.

---

## Application / Card-Pack / Theme Ownership Rules

When deciding where new functionality belongs, use ownership rather than convenience.

### Put it in application code when it describes behavior

Examples:

- how decks are generated
- how filters operate
- how validation is orchestrated
- how output is rendered
- how manifests are generated
- how card packs are activated

### Put it in a card pack when it describes content or pack identity

Examples:

- questions and instructions
- categories and editions
- card metadata
- pack display name
- card-back title and tagline
- author and license metadata

### Put it in a theme when it describes presentation

Examples:

- colors
- typography
- borders
- decorative artwork
- background treatment
- theme-specific layout styling that does not alter semantic card content

A feature should not be placed in `app.js` merely because that is convenient if its ownership belongs to a card pack or theme.

---

## Testing Architecture

Discussion Forge uses Node's built-in test runner rather than a third-party test framework.

The project remains dependency-light while still providing automated regression protection for validation and utility contracts.

The test tree mirrors the relevant source structure:

```text
tests/
├── validators/
│   ├── card-pack-validator.test.js
│   ├── card-validator.test.js
│   ├── catalog-integrity-validator.test.js
│   ├── category-validator.test.js
│   ├── edition-validator.test.js
│   └── theme-validator.test.js
└── utils.test.js
```

Current automated coverage includes:

- manifest validation and normalization
- card validation and metadata allowlists
- category validation
- edition validation
- catalog relationship integrity
- theme definition and path-safety validation
- recursive configuration freezing

Tests should use synthetic fixtures for exact contract behavior rather than modifying bundled production/reference packs to provoke errors.

Bundled packs, especially Sample Trivia, remain useful for browser-level and integration testing of complete application behavior.

---

## Bundled Reference Packs

### Trail Talk

Trail Talk is the primary bundled real-world conversation pack.

It exercises Discussion Forge with production-oriented conversation content while remaining architecturally separate from the application.

### Sample Trivia

Sample Trivia is a bundled demonstration and reference pack.

Its architectural purposes include:

- demonstrating the card-pack file structure
- proving that application behavior is not Trail Talk-specific
- exercising pack switching and pack-owned identity
- providing controlled sample content for future metadata-driven features

Post-v1.0, Sample Trivia can be expanded with deliberately varied metadata so Advanced Deck Settings can be exercised against a small, understandable reference catalog.

---

## Architectural Invariants

The following rules should remain true as Discussion Forge evolves.

1. **Card-pack data is validated before activation.** Raw or partially validated pack data does not enter trusted runtime state.
2. **Unknown card-pack IDs cannot determine resource paths.** Resource paths originate from trusted registration metadata.
3. **Pack activation is fail closed.** A failed candidate does not replace the previously trusted active pack.
4. **Card packs are data, not executable plugins.** Content packages do not gain arbitrary JavaScript execution privileges.
5. **Themes own presentation, not application behavior.** Theme packages do not control generation or validation logic.
6. **Application behavior is card-pack agnostic.** Trail Talk and Sample Trivia are content packages, not hidden application dependencies.
7. **Cross-record relationships are validated after record validation.** Individual record validity does not imply catalog integrity.
8. **Preview and print share canonical card renderers.** Different output contexts do not define competing card semantics.
9. **Generated output is derived state.** Changes to generation inputs must invalidate or clear stale output when necessary.
10. **Deck identity inputs are explicit.** Any setting capable of changing the generated card set must be considered for deterministic identity.
11. **Trusted configuration is immutable.** Registry and configuration objects are protected against accidental runtime mutation.
12. **Runtime state is intentionally mutable and isolated from configuration.** Normal application behavior does not rewrite trusted definitions.
13. **Untrusted text is rendered as text.** Pack/user text must not acquire HTML or script execution privileges through rendering.
14. **Extension points preserve trust boundaries.** Future registries, creator tools, imports, flashcards, and advanced filters must cross the same validation boundary before influencing trusted runtime behavior.
15. **Dependencies remain minimal.** Browser and platform capabilities are preferred when they satisfy the requirement securely and maintainably.

If a proposed implementation violates one of these invariants, the architecture should be deliberately revised and documented rather than allowing the invariant to erode accidentally.

---

## Future Extension Points

Several planned features will extend this architecture without changing its core boundaries.

### Advanced Deck Settings

Advanced filters will be discovered dynamically from metadata present in the validated active catalog.

They should affect builder state and deterministic identity only when their selections can alter the generated card set.

### Flashcards

A future first-class flashcard type will change front/back semantic rendering while remaining card-pack data interpreted by application-owned rendering behavior.

### Card-Pack Creator Toolkit

The creator toolkit will provide a human-friendly authoring layer, likely spreadsheet-based, that normalizes author input into the strict runtime schema.

Creator validation should reuse the same runtime contracts wherever practical so authoring-time and runtime validation cannot silently diverge.

### Community Card Packs

Community distribution may eventually require a data-driven registry or installation mechanism.

Whatever mechanism is chosen must preserve trusted path resolution, validation-before-activation, non-executable content packages, compatibility checks, and fail-closed activation.

### Additional Themes

New themes can expand presentation without changing card-pack data contracts or deck-generation semantics.

---

## Maintaining This Document

`ARCHITECTURE.md` is a living description of the system's structural contracts.

Update it when a change alters:

- system boundaries
- runtime state ownership
- trust transitions
- loading or activation behavior
- validation responsibilities
- extension-point ownership
- rendering contracts
- deterministic identity inputs
- architectural invariants

Implementation details that do not change these contracts generally belong in code comments or focused documentation rather than here.

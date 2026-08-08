# Security Policy

This document defines the security engineering standards used throughout the Discussion Forge project.

## Philosophy

Discussion Forge is developed using **Secure by Design** principles.

Security is an engineering requirement, not a feature added later. Every new feature, architectural decision, and code review considers security before implementation begins.

If a feature cannot be implemented securely, it will not be implemented.

Our security philosophy is guided by:

- OWASP guidance and best practices
- MITRE CWE classifications
- Principle of Least Privilege
- Defense in Depth
- Fail Secure (fail closed)
- Explicit Trust Boundaries
- Input Validation
- Secure Defaults

---

## Current Security Posture

Implemented protections include:

- DOM-only rendering for user and pack-supplied text
- Validation of card-pack catalogs before trusted-state publication
- Trusted card-pack registry for bundled pack resource paths
- Trusted theme registry
- Immutable trusted theme definitions
- Declarative theme architecture
- Explicit trust boundaries
- Browser cryptographic random sources for UUID and random-seed generation
- No runtime loading of arbitrary executable community assets
- Fail-closed pack activation

Future deployment hardening, including Content Security Policy guidance, HTTP security headers, and deployment configuration, will be introduced as deployment targets are formalized.

---

# Trust Boundaries

Everything is considered **untrusted** until it has been validated or reviewed.

## Trusted Bundled Content

The following components are maintained as part of the Discussion Forge repository and are trusted after review:

- Application source code
- Bundled CSS
- Bundled JavaScript modules
- Card-pack registry definitions
- Bundled card-pack JSON resources after runtime validation
- Bundled SVG assets after review and sanitization
- Bundled theme packages

## Conditionally Trusted Contributions

These items become trusted only after review, validation, and approval:

- Community card submissions
- Community card packs
- Community theme packages
- SVG artwork
- Catalog updates

## Untrusted Input

The following must always be treated as untrusted input:

- User input
- Community submissions
- Imported manifests
- Imported or uploaded pack files
- External files
- External URIs
- Browser query parameters
- Future API requests
- Uploaded images
- Uploaded SVG files

---

# Card-Pack Security

## Trusted Registration

Discussion Forge currently loads bundled card packs only from `CARD_PACK_REGISTRY`.

Registry entries provide trusted pack IDs and relative resource paths. Callers request a registered ID rather than constructing arbitrary file paths.

Unknown IDs are rejected before pack resources are fetched.

## Validate Before Activation

Card-pack JSON is treated as untrusted data even when it is bundled with the application.

A pack is not published into trusted runtime state until its consumed manifest fields, catalog records, identifiers, metadata values, and cross-catalog relationships have been validated.

The runtime separates:

```text
activeCardPack
catalog
  cards
  categories
  editions
```

A newly requested pack replaces those trusted objects only after successful loading and validation.

## Fail-Closed Switching

If a requested card pack fails to load or validate:

- The failed pack is not activated.
- The previously active trusted pack remains in runtime state.
- The selector is restored to the previous active pack.
- Existing generated output is not cleared merely because an invalid replacement was requested.

Generated output is cleared after a successful pack change so stale output cannot be mistaken for content from the newly active pack.

---

# Design Principles

## Validate Before Use

Validation occurs before data enters the application's trusted state.

Validation should prefer allowlists over denylists whenever practical.

Examples include:

- UUID validation
- Card-pack ID validation
- Theme ID validation
- Category and edition ID validation
- Allowlisted card metadata values
- Color validation
- Relationship validation
- Trusted resource-path construction

---

## Fail Closed

If validation fails, processing stops.

The application should never continue using partially validated replacement data.

---

## Executable Content

Community contributions must never gain executable runtime privileges merely by being packaged as content or presentation.

Card packs are data packages. They must not contain executable application logic.

Theme contributions may contain reviewed presentation assets and CSS, but must not introduce arbitrary executable behavior.

---

## SVG Security

Detailed SVG acceptance, sanitization, allowlist, testing, licensing, and fallback requirements are documented in `THEME-PACK.md`.

Discussion Forge does not render arbitrary community-supplied SVG files directly at runtime. SVG assets become trusted only after review, sanitization, testing, and inclusion in a trusted bundled theme package.

---

## Rendering

Pack-supplied and user-supplied text is rendered using DOM APIs and `textContent`.

Application code shall avoid using `innerHTML` and `insertAdjacentHTML` for untrusted content.

Decorative SVG assets are loaded from trusted theme-owned paths rather than from arbitrary catalog URLs.

---

## Browser Security

The application shall remain compatible with a strict Content Security Policy.

Future development should avoid unnecessary inline styles or inline scripts and should preserve same-origin/offline-friendly resource loading.

---

# Dependency Policy

Discussion Forge intentionally minimizes third-party dependencies.

Before adding a dependency, consider:

- Is it actively maintained?
- Is it necessary?
- Does the browser already provide this functionality?
- Does it increase attack surface?
- Does it weaken offline or portable deployment?

---

# Vulnerability Reporting

If a security issue is discovered:

1. Do not publish exploit details immediately.
2. Report the issue privately.
3. Investigate root cause.
4. Correct the vulnerability.
5. Document the remediation.
6. Release the fix.
7. Credit the reporter when appropriate.

---

# Security Review Checklist

Before merging significant changes, consider:

- Are trust boundaries maintained?
- Is all external or pack-supplied input validated before use?
- Are cross-catalog relationships validated?
- Are identifiers constrained and allowlisted where practical?
- Are resource paths derived only from trusted registry metadata?
- Does failed activation preserve previously trusted state?
- Is executable content prohibited from data packages?
- Are theme assets reviewed and sanitized?
- Does the change increase attack surface?
- Does it introduce new dependencies?
- Does it remain compatible with strict CSP goals?
- Does it preserve Secure by Design and the project's architectural principles?

---

## Release Criteria

Significant features are considered complete only after functional, architectural, accessibility, and security review appropriate to the change.

---

# Living Document

Security is an ongoing engineering discipline.

This document will evolve alongside Discussion Forge as card-pack distribution, contributor workflows, deployment models, and additional extension points are introduced.

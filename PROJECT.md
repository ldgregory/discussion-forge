# Trail Talk Project

## Project Principles

Trail Talk is guided by the following engineering principles.

- Secure by Design
- Separation of Concerns
- Declarative Theme Architecture
- Data Validation Before Use
- Progressive Enhancement
- Accessibility First
- Portable Deployment
- Reproducible Deck Generation

When tradeoffs occur, these principles take precedence over adding new features.

---

## Security

Security is considered throughout the design and implementation of Trail Talk.

The project's security architecture, trust boundaries, secure coding standards, and implementation guidance are documented in **SECURITY.md**.

---

## Version 0.2 Architectural Decisions

### Printing

- Six playable cards per page
- Front pages immediately followed by matching back pages
- Flip on the long edge when printing duplex
- Cut guides appear on backs only
- Hole-punch guide appears on backs only
- Card size: 2.40" × 3.40"

### Card Design

Front

- Clean card face without manufacturing guides
- Large category icon
- Category banner
- Permanent deck position

Back

- Trail Talk branding
- "Real Questions. Real Connections."
- Theme-controlled artwork
- Compass rose
- Dashed trail
- Destination flag

### Architecture

- JSON-based catalogs
- UUID card identities
- Permanent deck positions
- Deterministic deck generation from seed
- Printable manifest
- Separate preview and print renderers
- Theme registry with self-contained theme packages
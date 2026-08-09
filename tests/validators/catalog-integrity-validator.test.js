import test from "node:test";
import assert from "node:assert/strict";

import {
  validateCatalogIntegrity,
} from "../../js/validators/catalog-integrity-validator.js";

/*
 * Return a fresh valid catalog fixture for every test.
 */
function createValidCatalog() {
  const categories = [
    {
      id: "gear",
      name: "Gear",
      short_name: "Gear",
      icon: "gear",
      color: "#336699",
      active: true,
    },
    {
      id: "camping",
      name: "Camping",
      short_name: "Camp",
      icon: "tent",
      color: "#669933",
      active: true,
    },
  ];

  const editions = [
    {
      id: "core",
      name: "Core",
      description: null,
      active: true,
    },
    {
      id: "advanced",
      name: "Advanced",
      description: null,
      active: true,
    },
  ];

  const cards = [
    {
      card_uuid: "12345678-1234-4123-8123-123456789abc",

      categories: [
        "gear",
      ],

      editions: [
        "core",
      ],

      visual: {
        primary_category: "gear",
      },
    },
    {
      card_uuid: "87654321-4321-4321-8321-cba987654321",

      categories: [
        "camping",
        "gear",
      ],

      editions: [
        "advanced",
      ],

      visual: {
        primary_category: "camping",
      },
    },
  ];

  const cardPack = {
    cardCount: 2,

    editions: [
      "core",
      "advanced",
    ],

    categories: [
      "gear",
      "camping",
    ],
  };

  return {
    cards,
    categories,
    editions,
    cardPack,
  };
}

test("validateCatalogIntegrity accepts a valid catalog", () => {
  const {
    cards,
    categories,
    editions,
    cardPack,
  } = createValidCatalog();

  assert.doesNotThrow(() =>
    validateCatalogIntegrity(
      cards,
      categories,
      editions,
      cardPack,
    ),
  );
});

test("validateCatalogIntegrity rejects duplicate category IDs", () => {
  const fixture = createValidCatalog();

  fixture.categories[1].id = "gear";

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        'categories[1].id duplicates "gear".',
    },
  );
});

test("validateCatalogIntegrity rejects duplicate edition IDs", () => {
  const fixture = createValidCatalog();

  fixture.editions[1].id = "core";

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        'editions[1].id duplicates "core".',
    },
  );
});

test("validateCatalogIntegrity rejects duplicate card UUIDs", () => {
  const fixture = createValidCatalog();

  fixture.cards[1].card_uuid =
    fixture.cards[0].card_uuid;

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    /cards\[1\]\.card_uuid duplicates/,
  );
});

test("validateCatalogIntegrity rejects an unknown card category", () => {
  const fixture = createValidCatalog();

  fixture.cards[0].categories = [
    "missing-category",
  ];

  fixture.cards[0].visual.primary_category =
    "missing-category";

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        'cards[0] references unknown category "missing-category".',
    },
  );
});

test("validateCatalogIntegrity rejects an unknown card edition", () => {
  const fixture = createValidCatalog();

  fixture.cards[0].editions = [
    "missing-edition",
  ];

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        'cards[0] references unknown edition "missing-edition".',
    },
  );
});

test("validateCatalogIntegrity rejects a primary category not listed on the card", () => {
  const fixture = createValidCatalog();

  fixture.cards[0].visual.primary_category =
    "camping";

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        "cards[0].visual.primary_category must also appear in the card's categories array.",
    },
  );
});

test("validateCatalogIntegrity rejects a manifest card-count mismatch", () => {
  const fixture = createValidCatalog();

  fixture.cardPack.cardCount = 3;

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        "manifest.card_count declares 3 cards, but 2 cards were loaded.",
    },
  );
});

test("validateCatalogIntegrity rejects a manifest reference to a missing edition", () => {
  const fixture = createValidCatalog();

  fixture.cardPack.editions = [
    "core",
    "missing-edition",
  ];

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        'manifest.editions references missing edition "missing-edition".',
    },
  );
});

test("validateCatalogIntegrity rejects an undeclared loaded edition", () => {
  const fixture = createValidCatalog();

  fixture.cardPack.editions = [
    "core",
  ];

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        "manifest.editions does not match the loaded edition catalog.",
    },
  );
});

test("validateCatalogIntegrity rejects a manifest reference to a missing category", () => {
  const fixture = createValidCatalog();

  fixture.cardPack.categories = [
    "gear",
    "missing-category",
  ];

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        'manifest.categories references missing category "missing-category".',
    },
  );
});

test("validateCatalogIntegrity rejects an undeclared loaded category", () => {
  const fixture = createValidCatalog();

  fixture.cardPack.categories = [
    "gear",
  ];

  assert.throws(
    () =>
      validateCatalogIntegrity(
        fixture.cards,
        fixture.categories,
        fixture.editions,
        fixture.cardPack,
      ),
    {
      name: "Error",
      message:
        "manifest.categories does not match the loaded category catalog.",
    },
  );
});
import test from "node:test";
import assert from "node:assert/strict";

import {
  validateCardPackManifest,
} from "../../js/validators/card-pack-validator.js";

/*
 * Return a fresh valid manifest for every test so individual
 * tests can mutate their input without affecting one another.
 */
function createValidManifest() {
  return {
    schema_version: 1,
    pack_type: "cards",

    id: "test-pack",
    display_name: "Test Pack",
    version: "1.0.0",

    author: {
      name: "Discussion Forge",
      email: "",
      website: "",
      github: "",
    },

    released_at: "2026-08-09",

    description:
      "A valid card pack used by the automated validator tests.",

    card_back: {
      title: "TEST PACK",
      tagline: ["Test Questions"],
      brand: "Discussion Forge",
    },

    license: "Apache-2.0",

    minimum_application_version: "0.4.0",

    dependencies: [],

    tags: [
      "testing",
    ],

    editions: [
      "general",
    ],

    categories: [
      "test",
    ],

    card_count: 1,
  };
}

test("validateCardPackManifest accepts and normalizes a valid manifest", () => {
  const manifest =
    validateCardPackManifest(createValidManifest());

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.packType, "cards");
  assert.equal(manifest.id, "test-pack");
  assert.equal(manifest.displayName, "Test Pack");
  assert.equal(manifest.version, "1.0.0");
  assert.equal(manifest.minimumApplicationVersion, "0.4.0");
  assert.equal(manifest.cardCount, 1);

  /*
   * Runtime rendering expects exactly two tagline positions.
   * A missing second line should be normalized to "".
   */
  assert.deepEqual(
    manifest.cardBack.tagline,
    ["Test Questions", ""],
  );
});

test("validateCardPackManifest rejects a non-integer schema version", () => {
  const rawManifest = createValidManifest();

  rawManifest.schema_version = "1";

  assert.throws(
    () => validateCardPackManifest(rawManifest),
    {
      name: "TypeError",
      message:
        "manifest.schema_version must be a positive integer.",
    },
  );
});

test("validateCardPackManifest rejects an unsupported schema version", () => {
  const rawManifest = createValidManifest();

  rawManifest.schema_version = 2;

  assert.throws(
    () => validateCardPackManifest(rawManifest),
    /Unsupported card-pack schema version: 2/,
  );
});

test("validateCardPackManifest rejects an unsupported pack type", () => {
  const rawManifest = createValidManifest();

  rawManifest.pack_type = "flashcards";

  assert.throws(
    () => validateCardPackManifest(rawManifest),
    /Unsupported card-pack type: "flashcards"/,
  );
});

test("validateCardPackManifest rejects an invalid release date", () => {
  const rawManifest = createValidManifest();

  rawManifest.released_at = "2026-02-31";

  assert.throws(
    () => validateCardPackManifest(rawManifest),
    {
      name: "TypeError",
      message:
        "manifest.released_at must be a valid ISO date.",
    },
  );
});

test("validateCardPackManifest rejects invalid category IDs", () => {
  const rawManifest = createValidManifest();

  rawManifest.categories = [
    "Invalid Category",
  ];

  assert.throws(
    () => validateCardPackManifest(rawManifest),
    /manifest\.categories\[0\] has an invalid format/,
  );
});

test("validateCardPackManifest rejects invalid semantic versions", () => {
  const rawManifest = createValidManifest();

  rawManifest.minimum_application_version = "0.4";

  assert.throws(
    () => validateCardPackManifest(rawManifest),
    /manifest\.minimum_application_version has an invalid format/,
  );
});

test("validateCardPackManifest limits card-back taglines to two lines", () => {
  const rawManifest = createValidManifest();

  rawManifest.card_back.tagline = [
    "Line one",
    "Line two",
    "Line three",
  ];

  assert.throws(
    () => validateCardPackManifest(rawManifest),
    /manifest\.card_back\.tagline cannot contain more than 2 items/,
  );
});
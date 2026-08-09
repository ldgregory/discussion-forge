import test from "node:test";
import assert from "node:assert/strict";

import {
  validateEdition,
} from "../../js/validators/edition-validator.js";

/*
 * Return a fresh valid edition for every test.
 */
function createValidEdition() {
  return {
    id: "core",
    name: "Core",
    description:
      "The core Discussion Forge test edition.",
    active: true,
  };
}

test("validateEdition accepts and normalizes a valid edition", () => {
  const edition =
    validateEdition(createValidEdition(), 0);

  assert.equal(edition.id, "core");
  assert.equal(edition.name, "Core");
  assert.equal(
    edition.description,
    "The core Discussion Forge test edition.",
  );
  assert.equal(edition.active, true);
});

test("validateEdition allows an omitted description", () => {
  const rawEdition = createValidEdition();

  delete rawEdition.description;

  const edition =
    validateEdition(rawEdition, 0);

  assert.equal(edition.description, null);
});

test("validateEdition rejects a non-object record", () => {
  assert.throws(
    () => validateEdition("core", 0),
    {
      name: "TypeError",
      message: "editions[0] must be an object.",
    },
  );
});

test("validateEdition rejects an invalid ID", () => {
  const rawEdition = createValidEdition();

  rawEdition.id = "Core Edition";

  assert.throws(
    () => validateEdition(rawEdition, 0),
    /editions\[0\]\.id has an invalid format/,
  );
});

test("validateEdition rejects an empty name", () => {
  const rawEdition = createValidEdition();

  rawEdition.name = "";

  assert.throws(
    () => validateEdition(rawEdition, 0),
    {
      name: "RangeError",
      message:
        "editions[0].name must contain at least 1 character(s).",
    },
  );
});

test("validateEdition rejects an overlong description", () => {
  const rawEdition = createValidEdition();

  rawEdition.description = "x".repeat(501);

  assert.throws(
    () => validateEdition(rawEdition, 0),
    {
      name: "RangeError",
      message:
        "editions[0].description cannot exceed 500 characters.",
    },
  );
});

test("validateEdition rejects a non-Boolean active value", () => {
  const rawEdition = createValidEdition();

  rawEdition.active = "true";

  assert.throws(
    () => validateEdition(rawEdition, 0),
    {
      name: "TypeError",
      message:
        "editions[0].active must be true or false.",
    },
  );
});
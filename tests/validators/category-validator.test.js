import test from "node:test";
import assert from "node:assert/strict";

import {
  validateCategory,
} from "../../js/validators/category-validator.js";

/*
 * Return a fresh valid category for every test.
 */
function createValidCategory() {
  return {
    id: "gear",
    name: "Gear",
    short_name: "Gear",
    icon: "gear",
    color: "#336699",
    active: true,
  };
}

test("validateCategory accepts and normalizes a valid category", () => {
  const category =
    validateCategory(createValidCategory(), 0);

  assert.equal(category.id, "gear");
  assert.equal(category.name, "Gear");
  assert.equal(category.short_name, "Gear");
  assert.equal(category.icon, "gear");
  assert.equal(category.color, "#336699");
  assert.equal(category.active, true);
});

test("validateCategory allows an omitted short name", () => {
  const rawCategory = createValidCategory();

  delete rawCategory.short_name;

  const category =
    validateCategory(rawCategory, 0);

  assert.equal(category.short_name, null);
});

test("validateCategory rejects a non-object record", () => {
  assert.throws(
    () => validateCategory("gear", 0),
    {
      name: "TypeError",
      message: "categories[0] must be an object.",
    },
  );
});

test("validateCategory rejects an invalid ID", () => {
  const rawCategory = createValidCategory();

  rawCategory.id = "Camping Gear";

  assert.throws(
    () => validateCategory(rawCategory, 0),
    /categories\[0\]\.id has an invalid format/,
  );
});

test("validateCategory rejects an empty name", () => {
  const rawCategory = createValidCategory();

  rawCategory.name = "";

  assert.throws(
    () => validateCategory(rawCategory, 0),
    {
      name: "RangeError",
      message:
        "categories[0].name must contain at least 1 character(s).",
    },
  );
});

test("validateCategory rejects an invalid color", () => {
  const rawCategory = createValidCategory();

  rawCategory.color = "blue";

  assert.throws(
    () => validateCategory(rawCategory, 0),
    /categories\[0\]\.color has an invalid format/,
  );
});

test("validateCategory accepts uppercase hexadecimal color digits", () => {
  const rawCategory = createValidCategory();

  rawCategory.color = "#AABBCC";

  const category =
    validateCategory(rawCategory, 0);

  assert.equal(category.color, "#AABBCC");
});

test("validateCategory rejects a non-Boolean active value", () => {
  const rawCategory = createValidCategory();

  rawCategory.active = 1;

  assert.throws(
    () => validateCategory(rawCategory, 0),
    {
      name: "TypeError",
      message:
        "categories[0].active must be true or false.",
    },
  );
});
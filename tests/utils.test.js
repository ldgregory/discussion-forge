import test from "node:test";
import assert from "node:assert/strict";

import {
  deepFreeze,
} from "../js/utils.js";

test("deepFreeze freezes the root object", () => {
  const value = {
    id: "test",
  };

  deepFreeze(value);

  assert.equal(
    Object.isFrozen(value),
    true,
  );
});

test("deepFreeze recursively freezes nested objects", () => {
  const value = {
    paths: {
      cards: "cards.json",
    },
  };

  deepFreeze(value);

  assert.equal(
    Object.isFrozen(value.paths),
    true,
  );
});

test("deepFreeze recursively freezes nested arrays", () => {
  const value = {
    packs: [
      {
        id: "one",
      },
    ],
  };

  deepFreeze(value);

  assert.equal(
    Object.isFrozen(value.packs),
    true,
  );

  assert.equal(
    Object.isFrozen(value.packs[0]),
    true,
  );
});

test("deepFreeze prevents nested property mutation", () => {
  const value = deepFreeze({
    paths: {
      cards: "cards.json",
    },
  });

  assert.throws(
    () => {
      value.paths.cards = "changed.json";
    },
    TypeError,
  );

  assert.equal(
    value.paths.cards,
    "cards.json",
  );
});

test("deepFreeze prevents array mutation", () => {
  const value = deepFreeze({
    packs: [
      "one",
    ],
  });

  assert.throws(
    () => {
      value.packs.push("two");
    },
    TypeError,
  );

  assert.deepEqual(
    value.packs,
    ["one"],
  );
});
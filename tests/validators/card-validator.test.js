import test from "node:test";
import assert from "node:assert/strict";

import {
  validateCard,
} from "../../js/validators/card-validator.js";

/*
 * Return a fresh valid card for every test so mutations in
 * one test cannot affect another.
 */
function createValidCard() {
  return {
    card_uuid: "12345678-1234-4123-8123-123456789abc",

    type: "question",

    content: {
      prompt: "What is your favorite piece of gear?",
      instruction: "Explain why you chose it.",
    },

    categories: [
      "gear",
    ],

    editions: [
      "core",
    ],

    visual: {
      primary_category: "gear",
    },

    response_style: "discussion",
    answer_length: "medium",

    experience_level: [
      "beginner",
      "experienced",
    ],

    audience: [
      "general",
    ],

    group_familiarity: [
      "new-group",
      "friends",
    ],

    sensitivity: "low",

    credit: {
      name: "Anonymous",
      display: false,
    },

    source: "original",
    status: "approved",
    active: true,

    added_to_catalog_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",

    content_version: 1,
  };
}

test("validateCard accepts and normalizes a valid card", () => {
  const card =
    validateCard(createValidCard(), 0);

  assert.equal(
    card.card_uuid,
    "12345678-1234-4123-8123-123456789abc",
  );

  assert.equal(card.type, "question");
  assert.equal(card.status, "approved");
  assert.equal(card.active, true);

  assert.equal(
    card.content.prompt,
    "What is your favorite piece of gear?",
  );

  assert.deepEqual(
    card.experience_level,
    ["beginner", "experienced"],
  );

  assert.equal(
    card.added_to_catalog_at,
    "2026-08-01T00:00:00.000Z",
  );
});

test("validateCard allows an omitted instruction", () => {
  const rawCard = createValidCard();

  delete rawCard.content.instruction;

  const card = validateCard(rawCard, 0);

  assert.equal(card.content.instruction, null);
});

test("validateCard rejects an invalid UUID", () => {
  const rawCard = createValidCard();

  rawCard.card_uuid = "not-a-uuid";

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.card_uuid has an invalid format/,
  );
});

test("validateCard rejects an unsupported card type", () => {
  const rawCard = createValidCard();

  rawCard.type = "unknown";

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.type contains an unsupported card type/,
  );
});

test("validateCard rejects an unsupported status", () => {
  const rawCard = createValidCard();

  rawCard.status = "archived";

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.status contains an unsupported status/,
  );
});

test("validateCard rejects an unsupported response style", () => {
  const rawCard = createValidCard();

  rawCard.response_style = "essay";

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.response_style contains an unsupported value/,
  );
});

test("validateCard rejects an unsupported answer length", () => {
  const rawCard = createValidCard();

  rawCard.answer_length = "huge";

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.answer_length contains an unsupported value/,
  );
});

test("validateCard rejects an unsupported experience level", () => {
  const rawCard = createValidCard();

  rawCard.experience_level = [
    "expert",
  ];

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.experience_level contains an unsupported value/,
  );
});

test("validateCard rejects an unsupported audience", () => {
  const rawCard = createValidCard();

  rawCard.audience = [
    "children",
  ];

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.audience contains an unsupported value/,
  );
});

test("validateCard rejects an unsupported group familiarity", () => {
  const rawCard = createValidCard();

  rawCard.group_familiarity = [
    "coworkers",
  ];

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.group_familiarity contains an unsupported value/,
  );
});

test("validateCard rejects an unsupported sensitivity level", () => {
  const rawCard = createValidCard();

  rawCard.sensitivity = "extreme";

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.sensitivity contains an unsupported value/,
  );
});

test("validateCard rejects an unsupported source", () => {
  const rawCard = createValidCard();

  rawCard.source = "internet";

  assert.throws(
    () => validateCard(rawCard, 0),
    /cards\[0\]\.source contains an unsupported value/,
  );
});

test("validateCard rejects empty categories", () => {
  const rawCard = createValidCard();

  rawCard.categories = [];

  assert.throws(
    () => validateCard(rawCard, 0),
    {
      name: "RangeError",
      message: "cards[0].categories cannot be empty.",
    },
  );
});

test("validateCard rejects empty editions", () => {
  const rawCard = createValidCard();

  rawCard.editions = [];

  assert.throws(
    () => validateCard(rawCard, 0),
    {
      name: "RangeError",
      message: "cards[0].editions cannot be empty.",
    },
  );
});

test("validateCard rejects a non-Boolean active value", () => {
  const rawCard = createValidCard();

  rawCard.active = "true";

  assert.throws(
    () => validateCard(rawCard, 0),
    {
      name: "TypeError",
      message: "cards[0].active must be true or false.",
    },
  );
});

test("validateCard rejects an invalid added timestamp", () => {
  const rawCard = createValidCard();

  rawCard.added_to_catalog_at = "not-a-date";

  assert.throws(
    () => validateCard(rawCard, 0),
    {
      name: "TypeError",
      message:
        "cards[0].added_to_catalog_at must be a valid ISO timestamp.",
    },
  );
});

test("validateCard rejects an invalid updated timestamp", () => {
  const rawCard = createValidCard();

  rawCard.updated_at = "not-a-date";

  assert.throws(
    () => validateCard(rawCard, 0),
    {
      name: "TypeError",
      message:
        "cards[0].updated_at must be a valid ISO timestamp.",
    },
  );
});

test("validateCard rejects an updated timestamp earlier than creation", () => {
  const rawCard = createValidCard();

  rawCard.added_to_catalog_at =
    "2026-08-02T00:00:00Z";

  rawCard.updated_at =
    "2026-08-01T00:00:00Z";

  assert.throws(
    () => validateCard(rawCard, 0),
    {
      name: "RangeError",
      message:
        "cards[0].updated_at cannot be earlier than added_to_catalog_at.",
    },
  );
});

test("validateCard rejects a non-positive content version", () => {
  const rawCard = createValidCard();

  rawCard.content_version = 0;

  assert.throws(
    () => validateCard(rawCard, 0),
    {
      name: "TypeError",
      message:
        "cards[0].content_version must be a positive integer.",
    },
  );
});
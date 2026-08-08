/*
 * Discussion Forge card validation.
 *
 * This module validates and normalizes untrusted card records
 * before they enter trusted application state.
 */

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LIMITS = Object.freeze({
  maxCategories: 100,
  maxEditions: 100,
  maxIsoTimestampLength: 40,
  maxCardUuidLength: 36,
  maxCardTypeLength: 32,
  maxCardStatusLength: 32,
  maxCardResponseStyleLength: 32,
  maxCardAnswerLength: 32,
  maxCardSensitivityLength: 32,
  maxCardSourceLength: 48,
  maxCardPrimaryCategoryLength: 64,
  maxPromptLength: 140,
  maxInstructionLength: 120,
  maxCreditNameLength: 32,
});

const ALLOWED_CARD_TYPES = new Set([
  "question",
  "story",
  "lightning",
  "wildcard",
]);

const ALLOWED_CARD_STATUSES = new Set([
  "draft",
  "pending",
  "approved",
  "rejected",
  "retired",
]);

const ALLOWED_RESPONSE_STYLES = new Set([
  "discussion",
  "story",
  "quick",
  "challenge",
]);

const ALLOWED_ANSWER_LENGTHS = new Set(["short", "medium", "long"]);

const ALLOWED_EXPERIENCE_LEVELS = new Set(["beginner", "experienced"]);

const ALLOWED_AUDIENCES = new Set(["general"]);

const ALLOWED_GROUP_FAMILIARITY = new Set(["new-group", "friends"]);

const ALLOWED_SENSITIVITY_LEVELS = new Set(["low", "medium", "high"]);

const ALLOWED_SOURCES = new Set(["original", "community"]);

/*
 * Return true only for non-null, non-array objects.
 */
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/*
 * Require a plain object and return it unchanged.
 */
function requireObject(value, fieldName) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${fieldName} must be an object.`);
  }

  return value;
}

/*
 * Require, normalize, constrain, and optionally pattern-check
 * a string.
 */
function requireString(
  value,
  fieldName,
  { minLength = 1, maxLength = 500, pattern = null } = {},
) {
  if (typeof value !== "string") {
    throw new TypeError(`${fieldName} must be a string.`);
  }

  const normalized = value.trim();

  if (normalized.length < minLength) {
    throw new RangeError(
      `${fieldName} must contain at least ${minLength} character(s).`,
    );
  }

  if (normalized.length > maxLength) {
    throw new RangeError(`${fieldName} cannot exceed ${maxLength} characters.`);
  }

  if (pattern && !pattern.test(normalized)) {
    throw new TypeError(`${fieldName} has an invalid format.`);
  }

  return normalized;
}

/*
 * Normalize an absent optional string to null.
 */
function optionalString(value, fieldName, { maxLength = 500 } = {}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return requireString(value, fieldName, {
    minLength: 1,
    maxLength,
  });
}

/*
 * Require an actual Boolean value.
 */
function requireBoolean(value, fieldName) {
  if (typeof value !== "boolean") {
    throw new TypeError(`${fieldName} must be true or false.`);
  }

  return value;
}

/*
 * Require an integer greater than zero.
 */
function requirePositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${fieldName} must be a positive integer.`);
  }

  return value;
}

/*
 * Require a non-empty, size-limited array of validated
 * strings.
 */
function requireStringArray(
  value,
  fieldName,
  { maxItems = 100, itemPattern = null } = {},
) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be an array.`);
  }

  if (value.length === 0) {
    throw new RangeError(`${fieldName} cannot be empty.`);
  }

  if (value.length > maxItems) {
    throw new RangeError(
      `${fieldName} cannot contain more than ${maxItems} items.`,
    );
  }

  return value.map((item, index) =>
    requireString(item, `${fieldName}[${index}]`, {
      minLength: 1,
      maxLength: 100,
      pattern: itemPattern,
    }),
  );
}

/*
 * Require an array whose normalized string values all appear
 * in a trusted allowlist.
 */
function requireAllowedStringArray(value, fieldName, allowedValues) {
  const items = requireStringArray(value, fieldName, {
    maxItems: allowedValues.size,
    itemPattern: ID_PATTERN,
  });

  items.forEach((item) => {
    if (!allowedValues.has(item)) {
      throw new TypeError(
        `${fieldName} contains an unsupported value: "${item}".`,
      );
    }
  });

  return items;
}

/*
 * Require a parseable timestamp and return it as a Date.
 */
function requireIsoTimestamp(value, fieldName) {
  const timestamp = requireString(value, fieldName, {
    maxLength: LIMITS.maxIsoTimestampLength,
  });

  const parsed = new Date(timestamp);

  if (Number.isNaN(parsed.getTime())) {
    throw new TypeError(`${fieldName} must be a valid ISO timestamp.`);
  }

  return parsed;
}

/*
 * Validate and normalize one card catalog record.
 */
export function validateCard(rawCard, index) {
  const card = requireObject(rawCard, `cards[${index}]`);
  const content = requireObject(card.content, `cards[${index}].content`);
  const visual = requireObject(card.visual, `cards[${index}].visual`);
  const credit = requireObject(card.credit, `cards[${index}].credit`);

  const type = requireString(card.type, `cards[${index}].type`, {
    maxLength: LIMITS.maxCardTypeLength,
    pattern: ID_PATTERN,
  });

  if (!ALLOWED_CARD_TYPES.has(type)) {
    throw new TypeError(
      `cards[${index}].type contains an unsupported card type.`,
    );
  }

  const status = requireString(card.status, `cards[${index}].status`, {
    maxLength: LIMITS.maxCardStatusLength,
    pattern: ID_PATTERN,
  });

  if (!ALLOWED_CARD_STATUSES.has(status)) {
    throw new TypeError(
      `cards[${index}].status contains an unsupported status.`,
    );
  }

  const responseStyle = requireString(
    card.response_style,
    `cards[${index}].response_style`,
    {
      maxLength: LIMITS.maxCardResponseStyleLength,
      pattern: ID_PATTERN,
    },
  );

  if (!ALLOWED_RESPONSE_STYLES.has(responseStyle)) {
    throw new TypeError(
      `cards[${index}].response_style contains an unsupported value.`,
    );
  }

  const answerLength = requireString(
    card.answer_length,
    `cards[${index}].answer_length`,
    {
      maxLength: LIMITS.maxCardAnswerLength,
      pattern: ID_PATTERN,
    },
  );

  if (!ALLOWED_ANSWER_LENGTHS.has(answerLength)) {
    throw new TypeError(
      `cards[${index}].answer_length contains an unsupported value.`,
    );
  }

  const sensitivity = requireString(
    card.sensitivity,
    `cards[${index}].sensitivity`,
    {
      maxLength: LIMITS.maxCardSensitivityLength,
      pattern: ID_PATTERN,
    },
  );

  if (!ALLOWED_SENSITIVITY_LEVELS.has(sensitivity)) {
    throw new TypeError(
      `cards[${index}].sensitivity contains an unsupported value.`,
    );
  }

  const source = requireString(card.source, `cards[${index}].source`, {
    maxLength: LIMITS.maxCardSourceLength,
    pattern: ID_PATTERN,
  });

  if (!ALLOWED_SOURCES.has(source)) {
    throw new TypeError(
      `cards[${index}].source contains an unsupported value.`,
    );
  }

  const experienceLevel = requireAllowedStringArray(
    card.experience_level,
    `cards[${index}].experience_level`,
    ALLOWED_EXPERIENCE_LEVELS,
  );

  const audience = requireAllowedStringArray(
    card.audience,
    `cards[${index}].audience`,
    ALLOWED_AUDIENCES,
  );

  const groupFamiliarity = requireAllowedStringArray(
    card.group_familiarity,
    `cards[${index}].group_familiarity`,
    ALLOWED_GROUP_FAMILIARITY,
  );

  const addedAt = requireIsoTimestamp(
    card.added_to_catalog_at,
    `cards[${index}].added_to_catalog_at`,
  );

  const updatedAt = requireIsoTimestamp(
    card.updated_at,
    `cards[${index}].updated_at`,
  );

  if (updatedAt < addedAt) {
    throw new RangeError(
      `cards[${index}].updated_at cannot be earlier than added_to_catalog_at.`,
    );
  }

  return {
    card_uuid: requireString(card.card_uuid, `cards[${index}].card_uuid`, {
      maxLength: LIMITS.maxCardUuidLength,
      pattern: UUID_PATTERN,
    }),

    type,

    content: {
      prompt: requireString(content.prompt, `cards[${index}].content.prompt`, {
        maxLength: LIMITS.maxPromptLength,
      }),

      instruction: optionalString(
        content.instruction,
        `cards[${index}].content.instruction`,
        {
          maxLength: LIMITS.maxInstructionLength,
        },
      ),
    },

    categories: requireStringArray(
      card.categories,
      `cards[${index}].categories`,
      {
        maxItems: LIMITS.maxCategories,
        itemPattern: ID_PATTERN,
      },
    ),

    editions: requireStringArray(card.editions, `cards[${index}].editions`, {
      maxItems: LIMITS.maxEditions,
      itemPattern: ID_PATTERN,
    }),

    visual: {
      primary_category: requireString(
        visual.primary_category,
        `cards[${index}].visual.primary_category`,
        {
          maxLength: LIMITS.maxCardPrimaryCategoryLength,
          pattern: ID_PATTERN,
        },
      ),
    },

    response_style: responseStyle,
    answer_length: answerLength,
    experience_level: experienceLevel,
    audience,
    group_familiarity: groupFamiliarity,
    sensitivity,

    credit: {
      name: requireString(credit.name, `cards[${index}].credit.name`, {
        maxLength: LIMITS.maxCreditNameLength,
      }),

      display: requireBoolean(credit.display, `cards[${index}].credit.display`),
    },

    source,
    status,

    active: requireBoolean(card.active, `cards[${index}].active`),

    added_to_catalog_at: addedAt.toISOString(),
    updated_at: updatedAt.toISOString(),

    content_version: requirePositiveInteger(
      card.content_version,
      `cards[${index}].content_version`,
    ),
  };
}
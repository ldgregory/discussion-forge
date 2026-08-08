/*
 * Discussion Forge category validation.
 *
 * This module validates and normalizes untrusted category
 * catalog records before they enter trusted application state.
 */

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const LIMITS = Object.freeze({
  maxCategoryIdLength: 64,
  maxCategoryNameLength: 32,
  maxIconNameLength: 16,
  maxColorValueLength: 32,
});

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
 * Validate and normalize one category catalog record.
 */
export function validateCategory(rawCategory, index) {
  const category = requireObject(rawCategory, `categories[${index}]`);

  return {
    id: requireString(category.id, `categories[${index}].id`, {
      maxLength: LIMITS.maxCategoryIdLength,
      pattern: ID_PATTERN,
    }),

    name: requireString(category.name, `categories[${index}].name`, {
      maxLength: LIMITS.maxCategoryNameLength,
    }),

    short_name: optionalString(
      category.short_name,
      `categories[${index}].short_name`,
      {
        maxLength: LIMITS.maxCategoryNameLength,
      },
    ),

    icon: requireString(category.icon, `categories[${index}].icon`, {
      maxLength: LIMITS.maxIconNameLength,
    }),

    color: requireString(category.color, `categories[${index}].color`, {
      maxLength: LIMITS.maxColorValueLength,
      pattern: HEX_COLOR_PATTERN,
    }),

    active: requireBoolean(category.active, `categories[${index}].active`),
  };
}
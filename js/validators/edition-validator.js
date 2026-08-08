/*
 * Discussion Forge edition validation.
 *
 * This module validates and normalizes untrusted edition
 * catalog records before they enter trusted application state.
 */

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LIMITS = Object.freeze({
  maxEditionIdLength: 64,
  maxEditionNameLength: 32,
  maxDescriptionLength: 500,
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
 * Validate and normalize one edition catalog record.
 */
export function validateEdition(rawEdition, index) {
  const edition = requireObject(rawEdition, `editions[${index}]`);

  return {
    id: requireString(edition.id, `editions[${index}].id`, {
      maxLength: LIMITS.maxEditionIdLength,
      pattern: ID_PATTERN,
    }),

    name: requireString(edition.name, `editions[${index}].name`, {
      maxLength: LIMITS.maxEditionNameLength,
    }),

    description: optionalString(
      edition.description,
      `editions[${index}].description`,
      {
        maxLength: LIMITS.maxDescriptionLength,
      },
    ),

    active: requireBoolean(edition.active, `editions[${index}].active`),
  };
}
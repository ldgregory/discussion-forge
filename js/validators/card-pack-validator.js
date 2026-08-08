/*
 * Discussion Forge card-pack validation.
 *
 * This module validates and normalizes untrusted card-pack
 * metadata before it enters trusted application state.
 */

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const LIMITS = Object.freeze({
  maxCardPackIdLength: 64,
  maxCardPackDisplayNameLength: 100,
  maxCardBackTitleLength: 40,
  maxCardBackTaglineLength: 80,
  maxCardBackBrandLength: 64,
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
 * Validate and normalize card-pack metadata consumed by the
 * Discussion Forge runtime.
 */
export function validateCardPackManifest(rawManifest) {
  const manifest = requireObject(rawManifest, "manifest");

  const cardBack = requireObject(manifest.card_back, "manifest.card_back");

  if (!Array.isArray(cardBack.tagline)) {
    throw new TypeError("manifest.card_back.tagline must be an array.");
  }

  if (cardBack.tagline.length > 2) {
    throw new RangeError(
      "manifest.card_back.tagline may contain at most two lines.",
    );
  }

  return {
    id: requireString(manifest.id, "manifest.id", {
      maxLength: LIMITS.maxCardPackIdLength,
      pattern: ID_PATTERN,
    }),

    displayName: requireString(manifest.display_name, "manifest.display_name", {
      maxLength: LIMITS.maxCardPackDisplayNameLength,
    }),

    version: requireString(manifest.version, "manifest.version", {
      maxLength: 32,
      pattern: SEMVER_PATTERN,
    }),

    cardBack: {
      title: requireString(cardBack.title, "manifest.card_back.title", {
        maxLength: LIMITS.maxCardBackTitleLength,
      }),

      tagline: [0, 1].map((index) =>
        requireString(
          cardBack.tagline[index] ?? "",
          `manifest.card_back.tagline[${index}]`,
          {
            minLength: 0,
            maxLength: LIMITS.maxCardBackTaglineLength,
          },
        ),
      ),

      brand: requireString(cardBack.brand, "manifest.card_back.brand", {
        maxLength: LIMITS.maxCardBackBrandLength,
      }),
    },
  };
}
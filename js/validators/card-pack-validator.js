/*
 * Discussion Forge card-pack validation.
 *
 * This module validates and normalizes untrusted card-pack
 * metadata before it enters trusted application state.
 */

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}$/;

const LIMITS = Object.freeze({
  maxCardPackIdLength: 64,
  maxCardPackDisplayNameLength: 100,
  maxAuthorNameLength: 100,
  maxAuthorContactLength: 200,
  maxDescriptionLength: 500,
  maxLicenseLength: 64,
  maxTagLength: 64,
  maxTags: 50,
  maxDeclaredEditions: 100,
  maxDeclaredCategories: 100,
  maxDependencies: 100,
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
 * Normalize an absent optional string to an empty string.
 */
function optionalString(value, fieldName, { maxLength = 500 } = {}) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return requireString(value, fieldName, {
    minLength: 1,
    maxLength,
  });
}

/*
 * Require a positive integer.
 */
function requirePositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${fieldName} must be a positive integer.`);
  }

  return value;
}

/*
 * Require a non-negative integer.
 */
function requireNonNegativeInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${fieldName} must be a non-negative integer.`);
  }

  return value;
}

/*
 * Require an array and enforce its maximum length.
 */
function requireArray(value, fieldName, maxItems) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be an array.`);
  }

  if (value.length > maxItems) {
    throw new RangeError(
      `${fieldName} cannot contain more than ${maxItems} items.`,
    );
  }

  return value;
}

/*
 * Require an array of normalized strings.
 */
function requireStringArray(
  value,
  fieldName,
  {
    maxItems = 100,
    itemMaxLength = 100,
    itemPattern = null,
  } = {},
) {
  return requireArray(value, fieldName, maxItems).map((item, index) =>
    requireString(item, `${fieldName}[${index}]`, {
      maxLength: itemMaxLength,
      pattern: itemPattern,
    }),
  );
}

/*
 * Require an ISO-8601 calendar date in YYYY-MM-DD form.
 */
function requireIsoDate(value, fieldName) {
  const normalized = requireString(value, fieldName, {
    maxLength: 10,
    pattern: ISO_DATE_PATTERN,
  });

  const parsed = new Date(`${normalized}T00:00:00Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== normalized
  ) {
    throw new TypeError(`${fieldName} must be a valid ISO date.`);
  }

  return normalized;
}

/*
 * Validate and normalize card-pack metadata consumed by the
 * Discussion Forge runtime.
 */
export function validateCardPackManifest(rawManifest) {
  const manifest = requireObject(rawManifest, "manifest");

  const author = requireObject(manifest.author, "manifest.author");
  const cardBack = requireObject(manifest.card_back, "manifest.card_back");

  const tagline = requireArray(
    cardBack.tagline,
    "manifest.card_back.tagline",
    2,
  ).map((line, index) =>
    requireString(line, `manifest.card_back.tagline[${index}]`, {
      minLength: 0,
      maxLength: LIMITS.maxCardBackTaglineLength,
    }),
  );

  /*
   * Runtime rendering expects exactly two tagline positions.
   * Missing positions are normalized to empty strings.
   */
  while (tagline.length < 2) {
    tagline.push("");
  }

  return {
    schemaVersion: requirePositiveInteger(
      manifest.schema_version,
      "manifest.schema_version",
    ),

    packType: requireString(manifest.pack_type, "manifest.pack_type", {
      maxLength: 32,
    }),

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

    author: {
      name: requireString(author.name, "manifest.author.name", {
        maxLength: LIMITS.maxAuthorNameLength,
      }),

      email: optionalString(author.email, "manifest.author.email", {
        maxLength: LIMITS.maxAuthorContactLength,
      }),

      website: optionalString(author.website, "manifest.author.website", {
        maxLength: LIMITS.maxAuthorContactLength,
      }),

      github: optionalString(author.github, "manifest.author.github", {
        maxLength: LIMITS.maxAuthorContactLength,
      }),
    },

    releasedAt: requireIsoDate(
      manifest.released_at,
      "manifest.released_at",
    ),

    description: requireString(
      manifest.description,
      "manifest.description",
      {
        maxLength: LIMITS.maxDescriptionLength,
      },
    ),

    cardBack: {
      title: requireString(cardBack.title, "manifest.card_back.title", {
        maxLength: LIMITS.maxCardBackTitleLength,
      }),

      tagline,

      brand: requireString(cardBack.brand, "manifest.card_back.brand", {
        maxLength: LIMITS.maxCardBackBrandLength,
      }),
    },

    license: requireString(manifest.license, "manifest.license", {
      maxLength: LIMITS.maxLicenseLength,
    }),

    minimumApplicationVersion: requireString(
      manifest.minimum_application_version,
      "manifest.minimum_application_version",
      {
        maxLength: 32,
        pattern: SEMVER_PATTERN,
      },
    ),

    dependencies: requireStringArray(
      manifest.dependencies,
      "manifest.dependencies",
      {
        maxItems: LIMITS.maxDependencies,
        itemMaxLength: LIMITS.maxCardPackIdLength,
        itemPattern: ID_PATTERN,
      },
    ),

    tags: requireStringArray(manifest.tags, "manifest.tags", {
      maxItems: LIMITS.maxTags,
      itemMaxLength: LIMITS.maxTagLength,
    }),

    editions: requireStringArray(
      manifest.editions,
      "manifest.editions",
      {
        maxItems: LIMITS.maxDeclaredEditions,
        itemMaxLength: LIMITS.maxCardPackIdLength,
        itemPattern: ID_PATTERN,
      },
    ),

    categories: requireStringArray(
      manifest.categories,
      "manifest.categories",
      {
        maxItems: LIMITS.maxDeclaredCategories,
        itemMaxLength: LIMITS.maxCardPackIdLength,
        itemPattern: ID_PATTERN,
      },
    ),

    cardCount: requireNonNegativeInteger(
      manifest.card_count,
      "manifest.card_count",
    ),
  };
}
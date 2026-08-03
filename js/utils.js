const MAX_ARRAY_LENGTH = 100_000;
const MAX_CHUNK_SIZE = 10_000;
const MAX_SEED_LENGTH = 128;
const MAX_CODE_LENGTH = 64;

const CODE_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/*
 * Divide an array into independent arrays of a fixed maximum size.
 */
export function chunkArray(items, chunkSize) {
  if (!Array.isArray(items)) {
    throw new TypeError(
      "chunkArray items must be an array.",
    );
  }

  if (items.length > MAX_ARRAY_LENGTH) {
    throw new RangeError(
      `chunkArray cannot process more than ${MAX_ARRAY_LENGTH} items.`,
    );
  }

  if (
    !Number.isInteger(chunkSize) ||
    chunkSize < 1 ||
    chunkSize > MAX_CHUNK_SIZE
  ) {
    throw new RangeError(
      `chunkSize must be a whole number between 1 and ${MAX_CHUNK_SIZE}.`,
    );
  }

  const chunks = [];

  for (
    let index = 0;
    index < items.length;
    index += chunkSize
  ) {
    chunks.push(
      items.slice(index, index + chunkSize),
    );
  }

  return chunks;
}

/*
 * Produce a deterministic 32-bit seed from text.
 *
 * This is suitable for repeatable deck generation,
 * not for cryptographic security.
 */
function xmur3(text) {
  let hash = 1779033703 ^ text.length;

  for (
    let index = 0;
    index < text.length;
    index++
  ) {
    hash = Math.imul(
      hash ^ text.charCodeAt(index),
      3432918353,
    );

    hash = (hash << 13) | (hash >>> 19);
  }

  return function nextHash() {
    hash = Math.imul(
      hash ^ (hash >>> 16),
      2246822507,
    );

    hash = Math.imul(
      hash ^ (hash >>> 13),
      3266489909,
    );

    return (hash ^= hash >>> 16) >>> 0;
  };
}

/*
 * Produce deterministic pseudorandom values from a
 * 32-bit seed.
 *
 * This is intentionally not a cryptographic PRNG.
 */
function mulberry32(seed) {
  let currentSeed = seed >>> 0;

  return function nextRandom() {
    currentSeed =
      (currentSeed + 0x6d2b79f5) >>> 0;

    let value = currentSeed;

    value = Math.imul(
      value ^ (value >>> 15),
      value | 1,
    );

    value ^=
      value +
      Math.imul(
        value ^ (value >>> 7),
        value | 61,
      );

    return (
      ((value ^ (value >>> 14)) >>> 0) /
      4294967296
    );
  };
}

/*
 * Return a shuffled copy of an array.
 *
 * Supplying the same items in the same order and the
 * same seed produces the same shuffled result.
 */
export function seededShuffle(
  items,
  seedText,
) {
  if (!Array.isArray(items)) {
    throw new TypeError(
      "seededShuffle items must be an array.",
    );
  }

  if (items.length > MAX_ARRAY_LENGTH) {
    throw new RangeError(
      `seededShuffle cannot process more than ${MAX_ARRAY_LENGTH} items.`,
    );
  }

  if (typeof seedText !== "string") {
    throw new TypeError(
      "seededShuffle seedText must be a string.",
    );
  }

  if (seedText.length > MAX_SEED_LENGTH) {
    throw new RangeError(
      `seedText cannot exceed ${MAX_SEED_LENGTH} characters.`,
    );
  }

  const seedFactory = xmur3(seedText);
  const random = mulberry32(seedFactory());
  const copy = [...items];

  for (
    let index = copy.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex = Math.floor(
      random() * (index + 1),
    );

    [
      copy[index],
      copy[randomIndex],
    ] = [
      copy[randomIndex],
      copy[index],
    ];
  }

  return copy;
}

/*
 * Generate a human-readable random code using the
 * browser's cryptographically secure random source.
 *
 * The alphabet contains exactly 32 characters, so
 * mapping a 32-bit value with modulo 32 introduces no
 * modulo bias.
 */
export function randomCode(length = 6) {
  if (
    !Number.isInteger(length) ||
    length < 1 ||
    length > MAX_CODE_LENGTH
  ) {
    throw new RangeError(
      `Code length must be a whole number between 1 and ${MAX_CODE_LENGTH}.`,
    );
  }

  if (
    !globalThis.crypto ||
    typeof globalThis.crypto.getRandomValues !==
      "function"
  ) {
    throw new Error(
      "A secure random-number generator is not available.",
    );
  }

  const randomValues =
    new Uint32Array(length);

  globalThis.crypto.getRandomValues(
    randomValues,
  );

  let result = "";

  randomValues.forEach((value) => {
    result +=
      CODE_ALPHABET[
        value % CODE_ALPHABET.length
      ];
  });

  return result;
}
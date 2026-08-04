/*
 * General utility limits
 */

const MAX_ARRAY_LENGTH = 100_000;
const MAX_CHUNK_SIZE = 10_000;
const MAX_SEED_LENGTH = 128;
const MAX_CODE_LENGTH = 64;

/*
 * Human-readable Base32 alphabet.
 *
 * Ambiguous characters such as I, O, 0, and 1 are
 * intentionally omitted.
 */
const BASE32_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


/* =========================================================
 * Array utilities
 * ========================================================= */

/*
 * Divide an array into independent arrays of a fixed
 * maximum size.
 *
 * The original array is not modified.
 */
export function chunkArray(
  items,
  chunkSize,
) {
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
      items.slice(
        index,
        index + chunkSize,
      ),
    );
  }

  return chunks;
}


/* =========================================================
 * Deterministic deck generation
 * ========================================================= */

/*
 * Produce a deterministic 32-bit seed from text.
 *
 * This is suitable for repeatable deck generation,
 * not for cryptographic security.
 */
function xmur3(text) {
  let hash =
    1779033703 ^ text.length;

  for (
    let index = 0;
    index < text.length;
    index++
  ) {
    hash = Math.imul(
      hash ^ text.charCodeAt(index),
      3432918353,
    );

    hash =
      (hash << 13) |
      (hash >>> 19);
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

    return (
      (hash ^= hash >>> 16) >>> 0
    );
  };
}

/*
 * Produce deterministic pseudorandom values from a
 * 32-bit seed.
 *
 * This is intentionally not a cryptographic PRNG.
 */
function mulberry32(seed) {
  let currentSeed =
    seed >>> 0;

  return function nextRandom() {
    currentSeed =
      (
        currentSeed +
        0x6d2b79f5
      ) >>> 0;

    let value =
      currentSeed;

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
      (
        value ^
        (value >>> 14)
      ) >>> 0
    ) / 4294967296;
  };
}

/*
 * Return a deterministically shuffled copy of an array.
 *
 * Supplying the same items in the same order and the
 * same seed produces the same shuffled result.
 *
 * The original array is not modified.
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

  const seedFactory =
    xmur3(seedText);

  const random =
    mulberry32(seedFactory());

  const copy =
    [...items];

  for (
    let index = copy.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      Math.floor(
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


/* =========================================================
 * Cryptographic hashing and encoding
 * ========================================================= */

/*
 * Return the SHA-256 digest of a string as raw bytes.
 */
export async function sha256Bytes(value) {
  if (typeof value !== "string") {
    throw new TypeError(
      "sha256Bytes value must be a string.",
    );
  }

  if (
    !globalThis.crypto?.subtle ||
    typeof globalThis.crypto.subtle.digest !==
      "function"
  ) {
    throw new Error(
      "SHA-256 is not available in this browser context.",
    );
  }

  const encoded =
    new TextEncoder().encode(value);

  const digest =
    await globalThis.crypto.subtle.digest(
      "SHA-256",
      encoded,
    );

  return new Uint8Array(digest);
}

/*
 * Convert bytes into lowercase hexadecimal text.
 *
 * Each byte produces exactly two hexadecimal
 * characters.
 */
export function bytesToHex(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError(
      "bytesToHex requires a Uint8Array.",
    );
  }

  return Array.from(
    bytes,
    (byte) =>
      byte
        .toString(16)
        .padStart(2, "0"),
  ).join("");
}

/*
 * Encode bytes using Trail Talk's human-readable
 * 32-character alphabet.
 *
 * This encoding does not include padding characters.
 */
export function encodeBase32(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError(
      "encodeBase32 requires a Uint8Array.",
    );
  }

  let buffer = 0;
  let bitCount = 0;
  let result = "";

  for (const byte of bytes) {
    buffer =
      (buffer << 8) | byte;

    bitCount += 8;

    while (bitCount >= 5) {
      bitCount -= 5;

      result +=
        BASE32_ALPHABET[
          (buffer >>> bitCount) &
            0x1f
        ];
    }

    /*
     * Retain only the unconsumed bits so the
     * bit buffer remains bounded.
     */
    buffer &=
      (1 << bitCount) - 1;
  }

  if (bitCount > 0) {
    result +=
      BASE32_ALPHABET[
        (
          buffer <<
          (5 - bitCount)
        ) & 0x1f
      ];
  }

  return result;
}


/* =========================================================
 * Secure random identifiers
 * ========================================================= */

/*
 * Generate a human-readable random code using the
 * browser's cryptographically secure random source.
 *
 * The alphabet contains exactly 32 characters. Because
 * 32 divides evenly into the range of a 32-bit unsigned
 * integer, modulo selection introduces no bias.
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

  for (const value of randomValues) {
    result +=
      BASE32_ALPHABET[
        value %
          BASE32_ALPHABET.length
      ];
  }

  return result;
}
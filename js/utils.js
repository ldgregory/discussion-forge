export function chunkArray(items, chunkSize) {
  const chunks = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function xmur3(text) {
  let hash = 1779033703 ^ text.length;

  for (let index = 0; index < text.length; index++) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return function () {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

export function mulberry32(seed) {
  return function () {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(items, seedText) {
  const random = mulberry32(xmur3(seedText)());
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[randomIndex]] = [
      copy[randomIndex],
      copy[index],
    ];
  }

  return copy;
}

export function randomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomValues = new Uint32Array(length);
  let result = "";

  crypto.getRandomValues(randomValues);

  randomValues.forEach((value) => {
    result += alphabet[value % alphabet.length];
  });

  return result;
}
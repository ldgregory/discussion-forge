import assert from "node:assert/strict";
import {access, readFile,} from "node:fs/promises";
import test from "node:test";

import { validateCardPackManifest } from "../js/validators/card-pack-validator.js";
import { validateCard } from "../js/validators/card-validator.js";
import { validateCatalogIntegrity } from "../js/validators/catalog-integrity-validator.js";
import { validateCategory } from "../js/validators/category-validator.js";
import { validateEdition } from "../js/validators/edition-validator.js";
import { validateThemeDefinition } from "../js/validators/theme-validator.js";
import { theme as trailBlueTheme } from "../themes/trail-blue/index.js";
import { theme as trailCharcoalTheme } from "../themes/trail-charcoal/index.js";

/*
 * Load and parse one JSON file relative to the repository root.
 */
async function loadJson(path) {
  const contents = await readFile(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

  return JSON.parse(contents);
}

/*
 * Load a bundled card pack from the same four JSON files
 * consumed by the Discussion Forge runtime.
 */
async function loadBundledCardPack(packId) {
  const root = `data/${packId}`;

  const [
    rawManifest,
    rawCards,
    rawCategories,
    rawEditions,
  ] = await Promise.all([
    loadJson(`${root}/manifest.json`),
    loadJson(`${root}/cards.json`),
    loadJson(`${root}/categories.json`),
    loadJson(`${root}/editions.json`),
  ]);

  return {
    manifest: validateCardPackManifest(rawManifest),
    cards: rawCards.map((card) => validateCard(card)),
    categories: rawCategories.map((category) =>
      validateCategory(category),
    ),
    editions: rawEditions.map((edition) =>
      validateEdition(edition),
    ),
  };
}

/*
 * Validate one complete bundled card pack exactly as a
 * coordinated shipping artifact rather than as isolated
 * validator fixtures.
 */
async function validateBundledCardPack(packId) {
  const {
    manifest,
    cards,
    categories,
    editions,
  } = await loadBundledCardPack(packId);

  validateCatalogIntegrity(
    cards,
    categories,
    editions,
    manifest,
  );

  return {
    manifest,
    cards,
    categories,
    editions,
  };
}

/*
 * Verify that one validated bundled theme references resources
 * that actually exist in the repository being tested.
 */
async function validateBundledTheme(theme) {
  assert.equal(
    validateThemeDefinition(theme),
    true,
    `Bundled theme "${theme.id}" must have a valid definition.`,
  );

  await access(
    new URL(`../${theme.stylesheet}`, import.meta.url),
  );

  await access(
    new URL(`../${theme.assetRoot}/`, import.meta.url),
  );

  return theme;
}

test("bundled Trail Talk card pack is valid", async () => {
  const pack = await validateBundledCardPack("trail-talk");

  assert.equal(pack.manifest.id, "trail-talk");
  assert.equal(pack.cards.length, pack.manifest.cardCount);
});

test("bundled Sample Trivia card pack is valid", async () => {
  const pack = await validateBundledCardPack("sample-trivia");

  assert.equal(pack.manifest.id, "sample-trivia");
  assert.equal(pack.cards.length, pack.manifest.cardCount);
});

test("bundled Trail Blue theme is valid", async () => {
  const theme = await validateBundledTheme(trailBlueTheme);

  assert.equal(theme.id, "trail-blue");
});

test("bundled Trail Charcoal theme is valid", async () => {
  const theme = await validateBundledTheme(trailCharcoalTheme);

  assert.equal(theme.id, "trail-charcoal");
});
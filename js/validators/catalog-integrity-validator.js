/*
 * Discussion Forge catalog integrity validation.
 *
 * This module validates relationships and uniqueness across
 * already-validated card, category, and edition catalogs.
 */

/*
 * Require a unique value for the selected identity property
 * across an entire validated catalog.
 */
function assertUniqueIds(records, collectionName, keyName) {
  const seen = new Set();

  records.forEach((record, index) => {
    const value = record[keyName];

    if (seen.has(value)) {
      throw new Error(
        `${collectionName}[${index}].${keyName} duplicates "${value}".`,
      );
    }

    seen.add(value);
  });
}

/*
 * Validate references between cards, categories, and
 * editions after all individual records are trusted.
 *
 * This prevents cards from referencing missing catalog
 * records or using an undeclared primary category.
 */
function validateCatalogRelationships(cards, categories, editions) {
  const categoryIds = new Set(categories.map((category) => category.id));
  const editionIds = new Set(editions.map((edition) => edition.id));

  cards.forEach((card, index) => {
    card.categories.forEach((categoryId) => {
      if (!categoryIds.has(categoryId)) {
        throw new Error(
          `cards[${index}] references unknown category "${categoryId}".`,
        );
      }
    });

    card.editions.forEach((editionId) => {
      if (!editionIds.has(editionId)) {
        throw new Error(
          `cards[${index}] references unknown edition "${editionId}".`,
        );
      }
    });

    if (!card.categories.includes(card.visual.primary_category)) {
      throw new Error(
        `cards[${index}].visual.primary_category must also appear in the card's categories array.`,
      );
    }
  });
}

/*
 * Validate catalog-wide integrity after all individual
 * records have been validated and normalized.
 */
export function validateCatalogIntegrity(
  cards,
  categories,
  editions,
  cardPack,
) {
  assertUniqueIds(categories, "categories", "id");
  assertUniqueIds(editions, "editions", "id");
  assertUniqueIds(cards, "cards", "card_uuid");

  validateCatalogRelationships(cards, categories, editions);

  if (cardPack.cardCount !== cards.length) {
    throw new Error(
      `manifest.card_count declares ${cardPack.cardCount} cards, ` +
        `but ${cards.length} cards were loaded.`,
    );
  }

  const actualEditionIds = new Set(
    editions.map((edition) => edition.id),
  );

  cardPack.editions.forEach((editionId) => {
    if (!actualEditionIds.has(editionId)) {
      throw new Error(
        `manifest.editions references missing edition "${editionId}".`,
      );
    }
  });

  if (actualEditionIds.size !== cardPack.editions.length) {
    throw new Error(
      "manifest.editions does not match the loaded edition catalog.",
    );
  }

  const actualCategoryIds = new Set(
    categories.map((category) => category.id),
  );

  cardPack.categories.forEach((categoryId) => {
    if (!actualCategoryIds.has(categoryId)) {
      throw new Error(
        `manifest.categories references missing category "${categoryId}".`,
      );
    }
  });

  if (actualCategoryIds.size !== cardPack.categories.length) {
    throw new Error(
      "manifest.categories does not match the loaded category catalog.",
    );
  }
}
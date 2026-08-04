import {
  bytesToHex,
  chunkArray,
  encodeBase32,
  randomCode,
  seededShuffle,
  sha256Bytes,
} from "./utils.js";

import { getTheme, themes } from "../themes/index.js";

const DECK_IDENTITY_VERSION = 1;
const GENERATOR_VERSION = "0.2.0-alpha3";
const CATALOG_VERSION = "2026.08.01";
const HUMAN_DECK_ID_LENGTH = 10;

const DEFAULT_THEME_ID = "trail-blue";
const THEME_STYLESHEET_ID = "active-theme-stylesheet";

const LIMITS = Object.freeze({
  maxCards: 5000,
  maxCategories: 100,
  maxEditions: 100,
  maxDeckSize: 250,
  maxSeedLength: 128,
  maxPromptLength: 500,
  maxInstructionLength: 1000,
  maxDisplayNameLength: 100,
  maxIconLength: 16,
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

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const state = {
  cards: [],
  categories: [],
  editions: [],
  generated: [],
  manifest: null,
  themeId: "trail-blue",
};

function byId(id) {
  return document.getElementById(id);
}

function requireElement(id) {
  const element = byId(id);

  if (!element) {
    throw new Error(`Required page element not found: #${id}`);
  }

  return element;
}

function setStatus(message) {
  requireElement("status").textContent = message;
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireObject(value, fieldName) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${fieldName} must be an object.`);
  }

  return value;
}

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

function optionalString(value, fieldName, { maxLength = 500 } = {}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return requireString(value, fieldName, {
    minLength: 1,
    maxLength,
  });
}

function requireBoolean(value, fieldName) {
  if (typeof value !== "boolean") {
    throw new TypeError(`${fieldName} must be true or false.`);
  }

  return value;
}

function requirePositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${fieldName} must be a positive integer.`);
  }

  return value;
}

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

function requireIsoTimestamp(value, fieldName) {
  const timestamp = requireString(value, fieldName, {
    maxLength: 40,
  });

  const parsed = new Date(timestamp);

  if (Number.isNaN(parsed.getTime())) {
    throw new TypeError(`${fieldName} must be a valid ISO timestamp.`);
  }

  return parsed;
}

function requireCatalogArray(value, catalogName, maxItems) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${catalogName} must be an array.`);
  }

  if (value.length > maxItems) {
    throw new RangeError(
      `${catalogName} cannot contain more than ${maxItems} records.`,
    );
  }

  return value;
}

function validateCategory(rawCategory, index) {
  const category = requireObject(rawCategory, `categories[${index}]`);

  return {
    id: requireString(category.id, `categories[${index}].id`, {
      maxLength: 64,
      pattern: ID_PATTERN,
    }),

    name: requireString(category.name, `categories[${index}].name`, {
      maxLength: LIMITS.maxDisplayNameLength,
    }),

    short_name: optionalString(
      category.short_name,
      `categories[${index}].short_name`,
      {
        maxLength: LIMITS.maxDisplayNameLength,
      },
    ),

    icon: requireString(category.icon, `categories[${index}].icon`, {
      maxLength: LIMITS.maxIconLength,
    }),

    color: requireString(category.color, `categories[${index}].color`, {
      maxLength: 7,
      pattern: HEX_COLOR_PATTERN,
    }),

    active: requireBoolean(category.active, `categories[${index}].active`),
  };
}

function validateEdition(rawEdition, index) {
  const edition = requireObject(rawEdition, `editions[${index}]`);

  return {
    id: requireString(edition.id, `editions[${index}].id`, {
      maxLength: 64,
      pattern: ID_PATTERN,
    }),

    name: requireString(edition.name, `editions[${index}].name`, {
      maxLength: LIMITS.maxDisplayNameLength,
    }),

    description: optionalString(
      edition.description,
      `editions[${index}].description`,
      {
        maxLength: 500,
      },
    ),

    active: requireBoolean(edition.active, `editions[${index}].active`),
  };
}

function validateCard(rawCard, index) {
  const card = requireObject(rawCard, `cards[${index}]`);

  const content = requireObject(card.content, `cards[${index}].content`);

  const visual = requireObject(card.visual, `cards[${index}].visual`);

  const credit = requireObject(card.credit, `cards[${index}].credit`);

  const type = requireString(card.type, `cards[${index}].type`, {
    maxLength: 32,
    pattern: ID_PATTERN,
  });

  if (!ALLOWED_CARD_TYPES.has(type)) {
    throw new TypeError(
      `cards[${index}].type contains an unsupported card type.`,
    );
  }

  const status = requireString(card.status, `cards[${index}].status`, {
    maxLength: 32,
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
      maxLength: 32,
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
      maxLength: 32,
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
      maxLength: 32,
      pattern: ID_PATTERN,
    },
  );

  if (!ALLOWED_SENSITIVITY_LEVELS.has(sensitivity)) {
    throw new TypeError(
      `cards[${index}].sensitivity contains an unsupported value.`,
    );
  }

  const source = requireString(card.source, `cards[${index}].source`, {
    maxLength: 32,
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
      maxLength: 36,
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
          maxLength: 64,
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
        maxLength: LIMITS.maxDisplayNameLength,
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

async function fetchJson(path) {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load ${path}: HTTP ${response.status}.`);
  }

  return response.json();
}

async function loadData() {
  const [rawCards, rawCategories, rawEditions] = await Promise.all([
    fetchJson("data/cards.json"),
    fetchJson("data/categories.json"),
    fetchJson("data/editions.json"),
  ]);

  const categories = requireCatalogArray(
    rawCategories,
    "categories",
    LIMITS.maxCategories,
  ).map(validateCategory);

  const editions = requireCatalogArray(
    rawEditions,
    "editions",
    LIMITS.maxEditions,
  ).map(validateEdition);

  const cards = requireCatalogArray(rawCards, "cards", LIMITS.maxCards).map(
    validateCard,
  );

  assertUniqueIds(categories, "categories", "id");
  assertUniqueIds(editions, "editions", "id");
  assertUniqueIds(cards, "cards", "card_uuid");

  validateCatalogRelationships(cards, categories, editions);

  state.cards = cards;
  state.categories = categories;
  state.editions = editions;

  loadThemeStylesheet(state.themeId);
  renderOptions();
  renderThemeOptions();
}

function createCheckboxOption({ name, value, labelText, checked }) {
  const label = document.createElement("label");
  label.className = "option";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = name;
  input.value = value;
  input.checked = checked;

  const text = document.createElement("span");
  text.textContent = labelText;

  label.append(input, text);

  return label;
}

function renderOptions() {
  const editionContainer = requireElement("edition-options");

  const categoryContainer = requireElement("category-options");

  editionContainer.replaceChildren();
  categoryContainer.replaceChildren();

  state.editions
    .filter((edition) => edition.active)
    .forEach((edition, index) => {
      editionContainer.appendChild(
        createCheckboxOption({
          name: "edition",
          value: edition.id,
          labelText: edition.name,
          checked: index === 0,
        }),
      );
    });

  state.categories
    .filter((category) => category.active)
    .forEach((category) => {
      categoryContainer.appendChild(
        createCheckboxOption({
          name: "category",
          value: category.id,
          labelText: `${category.icon} ${category.name}`,
          checked: true,
        }),
      );
    });
}

function requireTheme(themeId) {
  const theme = getTheme(themeId);

  if (!validateThemeDefinition(theme)) {
    throw new Error(`Unknown or invalid theme: ${themeId}`);
  }

  return theme;
}

// function buildApplicationIconPath(category) {
//   return `assets/icons/${category.id}.svg`;
// }

function buildThemeIconPath(theme, category) {
  return `${theme.assetRoot}/icons/${category.id}.svg`;
}

function buildDefaultThemeIconPath(category) {
  const defaultTheme = requireTheme(DEFAULT_THEME_ID);

  return buildThemeIconPath(defaultTheme, category);
}

function loadThemeStylesheet(themeId) {
  const theme = requireTheme(themeId);

  let stylesheet = document.getElementById(THEME_STYLESHEET_ID);

  if (!stylesheet) {
    stylesheet = document.createElement("link");

    stylesheet.id = THEME_STYLESHEET_ID;
    stylesheet.rel = "stylesheet";

    document.head.appendChild(stylesheet);
  }

  if (stylesheet.getAttribute("href") === theme.stylesheet) {
    return;
  }

  stylesheet.href = theme.stylesheet;
}

function validateThemeDefinition(theme) {
  if (!isPlainObject(theme)) {
    return false;
  }

  return (
    typeof theme.id === "string" &&
    ID_PATTERN.test(theme.id) &&
    typeof theme.name === "string" &&
    theme.name.length > 0 &&
    theme.name.length <= LIMITS.maxDisplayNameLength &&
    typeof theme.className === "string" &&
    ID_PATTERN.test(theme.className) &&
    typeof theme.stylesheet === "string" &&
    theme.stylesheet.length > 0 &&
    theme.stylesheet.length <= 200 &&
    theme.stylesheet.startsWith("themes/") &&
    theme.stylesheet.endsWith("/theme.css") &&
    !theme.stylesheet.includes("..") &&
    !theme.stylesheet.includes("\\") &&
    !theme.stylesheet.includes(":") &&
    !theme.stylesheet.startsWith("/") &&
    typeof theme.assetRoot === "string" &&
    theme.assetRoot.startsWith("themes/") &&
    theme.assetRoot.endsWith("/assets") &&
    !theme.assetRoot.includes("..") &&
    !theme.assetRoot.includes("\\") &&
    !theme.assetRoot.includes(":") &&
    !theme.assetRoot.startsWith("/")
  );
}

function renderThemeOptions() {
  const selector = requireElement("theme");

  selector.replaceChildren();

  themes.forEach((theme) => {
    if (!validateThemeDefinition(theme)) {
      throw new Error(
        "The trusted theme registry contains an invalid theme definition.",
      );
    }

    const option = document.createElement("option");
    option.value = theme.id;
    option.textContent = theme.name;

    selector.appendChild(option);
  });

  const selectedTheme = getTheme(state.themeId);

  if (!validateThemeDefinition(selectedTheme)) {
    throw new Error(`Unknown or invalid initial theme: ${state.themeId}`);
  }

  selector.value = selectedTheme.id;
}

function selectedValues(name) {
  if (name !== "edition" && name !== "category") {
    throw new Error(`Unsupported option group requested: ${name}`);
  }

  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (input) => input.value,
  );
}

function validateDeckSize(rawValue) {
  const size = Number(rawValue);

  if (!Number.isInteger(size)) {
    throw new TypeError("Deck size must be a whole number.");
  }

  if (size < 1 || size > LIMITS.maxDeckSize) {
    throw new RangeError(
      `Deck size must be between 1 and ${LIMITS.maxDeckSize}.`,
    );
  }

  return size;
}

function validateSeed(rawSeed) {
  const normalized = typeof rawSeed === "string" ? rawSeed.trim() : "";

  const seed = normalized || "trailtalk-demo";

  if (seed.length > LIMITS.maxSeedLength) {
    throw new RangeError(
      `Seed cannot exceed ${LIMITS.maxSeedLength} characters.`,
    );
  }

  return seed;
}

function clearGeneratedOutput() {
  state.generated = [];
  state.manifest = null;

  requireElement("preview-output").replaceChildren();
  requireElement("print-output").replaceChildren();
}

async function createDeckIdentity({
  seed,
  editions,
  categories,
  requestedCardCount,
  cards,
}) {
  const identityPayload = {
    identity_version: DECK_IDENTITY_VERSION,
    generator_version: GENERATOR_VERSION,
    catalog_version: CATALOG_VERSION,
    seed,
    editions: [...editions].sort(),
    categories: [...categories].sort(),
    requested_card_count: requestedCardCount,

    /*
     * Ordered card identities make the fingerprint
     * describe the actual playable deck.
     */
    cards: cards.map((card) => ({
      card_uuid: card.card_uuid,
      content_version: card.content_version,
    })),
  };

  /*
   * Property order is intentionally fixed above, and
   * set-like arrays are sorted before serialization.
   */
  const canonicalPayload = JSON.stringify(identityPayload);

  const digest = await sha256Bytes(canonicalPayload);

  const fingerprint = bytesToHex(digest);

  const deckId = encodeBase32(digest).slice(0, HUMAN_DECK_ID_LENGTH);

  return {
    deckId,
    fingerprint,
    identityPayload,
  };
}

async function generateDeck() {
  try {
    const editions = selectedValues("edition");
    const categories = selectedValues("category");

    const requested = validateDeckSize(requireElement("deck-size").value);

    const seed = validateSeed(requireElement("seed").value);

    if (editions.length === 0 || categories.length === 0) {
      setStatus("Select at least one edition and one category.");

      return;
    }

    const eligible = state.cards.filter(
      (card) =>
        card.active &&
        card.status === "approved" &&
        card.editions.some((editionId) => editions.includes(editionId)) &&
        card.categories.some((categoryId) => categories.includes(categoryId)),
    );

    if (eligible.length === 0) {
      clearGeneratedOutput();

      setStatus("No cards match the selected editions and categories.");

      return;
    }

    const chosen = seededShuffle(eligible, seed).slice(
      0,
      Math.min(requested, eligible.length),
    );

    const deckUuid = crypto.randomUUID();

    const { deckId, fingerprint } = await createDeckIdentity({
      seed,
      editions,
      categories,
      requestedCardCount: requested,
      cards: chosen,
    });

    state.generated = chosen.map((card, index) => ({
      deck_position: index + 1,
      ...card,
    }));

    state.manifest = {
      deck_uuid: deckUuid,
      deck_id: deckId,
      deck_fingerprint: fingerprint,
      deck_identity_version: DECK_IDENTITY_VERSION,

      generated_at: new Date().toISOString(),
      seed,

      generator_version: GENERATOR_VERSION,
      catalog_version: CATALOG_VERSION,

      configuration: {
        editions: [...editions],
        categories: [...categories],
        theme: state.themeId,
        requested_card_count: requested,
        playable_card_count: state.generated.length,
      },

      cards: state.generated.map((card) => ({
        deck_position: card.deck_position,
        card_uuid: card.card_uuid,
        content_version: card.content_version,

        content_snapshot: {
          prompt: card.content.prompt,
          instruction: card.content.instruction,
        },
      })),
    };

    setStatus(
      chosen.length < requested
        ? `Only ${chosen.length} eligible cards were available.`
        : `Generated ${chosen.length} playable cards.`,
    );

    renderOutput();
  } catch (error) {
    console.error(error);

    setStatus(
      error instanceof Error
        ? error.message
        : "The deck could not be generated.",
    );
  }
}

function categoryFor(card) {
  const category = state.categories.find(
    (candidate) => candidate.id === card.visual.primary_category,
  );

  if (!category) {
    throw new Error(
      `Card ${card.card_uuid} references a missing primary category.`,
    );
  }

  return category;
}

function createCategoryIcon(
  category,
  { className = "", decorative = true, themeId = state.themeId } = {},
) {
  const theme = requireTheme(themeId);

  const wrapper = document.createElement("span");

  if (className) {
    wrapper.className = className;
  }

  if (decorative) {
    wrapper.setAttribute("aria-hidden", "true");
  } else {
    wrapper.setAttribute("aria-label", category.name);
  }

  const image = document.createElement("img");

  image.src = buildThemeIconPath(theme, category);

  image.alt = "";

  image.width = 32;
  image.height = 32;

  image.className = "category-svg-icon";

  image.onerror = () => {
    if (theme.id === DEFAULT_THEME_ID) {
      wrapper.textContent = category.icon;
      return;
    }

    image.onerror = () => {
      wrapper.textContent = category.icon;
    };

    image.src = buildDefaultThemeIconPath(category);
  };

  wrapper.appendChild(image);

  return wrapper;
}

function renderFrontCard(card, { themeId = state.themeId } = {}) {
  const category = categoryFor(card);
  const theme = requireTheme(themeId);

  const article = document.createElement("article");

  article.classList.add("play-card", "card-front", theme.className);

  const band = document.createElement("div");

  band.classList.add("card-band", `category-${category.id}`);

  const bandIcon = createCategoryIcon(category, {
    className: "category-icon",
  });

  const bandName = document.createElement("span");

  bandName.className = "category-name";
  bandName.textContent = category.name;

  band.append(bandIcon, bandName);

  const body = document.createElement("div");
  body.className = "card-body";

  const bodyContent = document.createElement("div");

  const cardIcon = createCategoryIcon(category, {
    className: "card-icon",
  });

  const prompt = document.createElement("p");
  prompt.className = "card-prompt";
  prompt.textContent = card.content.prompt;

  bodyContent.append(cardIcon, prompt);

  if (card.content.instruction) {
    const instruction = document.createElement("p");

    instruction.className = "card-instruction";

    instruction.textContent = card.content.instruction;

    bodyContent.appendChild(instruction);
  }

  body.appendChild(bodyContent);

  const footer = document.createElement("div");

  footer.className = "card-footer";

  const footerText = document.createElement("span");

  footerText.textContent =
    `${state.manifest.deck_id} · ` +
    `${card.deck_position}/` +
    `${state.generated.length}`;

  footer.appendChild(footerText);

  article.append(band, body, footer);

  return article;
}

function renderBackCard({
  showPunchGuide = true,
  themeId = state.themeId,
} = {}) {
  const theme = requireTheme(themeId);

  const article = document.createElement("article");

  article.classList.add("play-card", "card-back", theme.className);

  if (showPunchGuide) {
    const punchGuide = document.createElement("div");

    punchGuide.className = "punch-safe punch-safe-back";

    punchGuide.title = "Optional hole-punch safe area";

    article.appendChild(punchGuide);
  }

  const content = document.createElement("div");

  content.className = "card-back-content";

  const compass = document.createElement("div");

  compass.className = "trail-talk-compass";
  compass.setAttribute("aria-hidden", "true");
  compass.textContent = "✥";

  const heading = document.createElement("h3");

  heading.textContent = "TRAIL TALK";

  const tagline = document.createElement("p");

  tagline.className = "card-back-tagline";

  const taglineLineOne = document.createElement("span");

  taglineLineOne.textContent = "Real Questions.";

  const taglineLineTwo = document.createElement("span");

  taglineLineTwo.textContent = "Real Connections.";

  tagline.append(taglineLineOne, taglineLineTwo);

  const trailLine = document.createElement("div");

  trailLine.className = "trail-line";
  trailLine.setAttribute("aria-hidden", "true");

  trailLine.textContent = "- - - - - - - - - - 🚩";

  const brand = document.createElement("p");

  brand.className = "card-back-brand";
  brand.textContent = "Overlanding Atlas";

  content.append(compass, heading, tagline, trailLine, brand);

  article.appendChild(content);

  return article;
}

function renderPreviewCard(card) {
  const wrapper = document.createElement("div");

  wrapper.className = "preview-card";
  wrapper.setAttribute("role", "button");
  wrapper.tabIndex = 0;

  wrapper.setAttribute("aria-pressed", "false");

  wrapper.setAttribute(
    "aria-label",
    `Flip card ${card.deck_position} to view the back`,
  );

  const inner = document.createElement("div");

  inner.className = "preview-card-inner";

  const frontSide = document.createElement("div");

  frontSide.className = "preview-card-side preview-card-front";

  frontSide.appendChild(renderFrontCard(card));

  const backSide = document.createElement("div");

  backSide.className = "preview-card-side preview-card-back";

  backSide.appendChild(
    renderBackCard({
      showPunchGuide: false,
    }),
  );

  inner.append(frontSide, backSide);
  wrapper.appendChild(inner);

  return wrapper;
}

function renderOutput() {
  renderPreview();
  renderPrintOutput();
}

function renderPreviewStatus() {
  if (!state.manifest) {
    return null;
  }

  const configuration = state.manifest.configuration;

  const theme = getTheme(state.themeId);

  if (!validateThemeDefinition(theme)) {
    throw new Error(`Unknown or invalid theme: ${state.themeId}`);
  }

  const editionNames = configuration.editions
    .map((editionId) =>
      state.editions.find((edition) => edition.id === editionId),
    )
    .filter(Boolean)
    .map((edition) => edition.name);

  const categoryNames = configuration.categories
    .map((categoryId) =>
      state.categories.find((category) => category.id === categoryId),
    )
    .filter(Boolean)
    .map((category) => category.name);

  const header = document.createElement("header");

  header.className = "preview-status";

  const headingRow = document.createElement("div");

  headingRow.className = "preview-status-heading";

  const headingText = document.createElement("div");

  const eyebrow = document.createElement("p");

  eyebrow.className = "preview-status-eyebrow";

  eyebrow.textContent = "Deck Preview";

  const heading = document.createElement("h2");

  heading.textContent = `Deck ${state.manifest.deck_id}`;

  headingText.append(eyebrow, heading);

  const count = document.createElement("span");

  count.className = "preview-status-count";

  count.textContent = `${state.generated.length} cards`;

  headingRow.append(headingText, count);

  const details = document.createElement("dl");

  details.className = "preview-status-details";

  details.append(
    createStatusDetail("Theme", theme.name),

    createStatusDetail("Editions", editionNames.join(", ")),

    createStatusDetail("Categories", categoryNames.join(", ")),

    createStatusDetail("Seed", state.manifest.seed, {
      useCode: true,
    }),
  );

  header.append(headingRow, details);

  return header;
}

function createStatusDetail(label, value, { useCode = false } = {}) {
  const wrapper = document.createElement("div");

  const term = document.createElement("dt");

  term.textContent = label;

  const description = document.createElement("dd");

  if (useCode) {
    const code = document.createElement("code");

    code.textContent = value;
    description.appendChild(code);
  } else {
    description.textContent = value;
  }

  wrapper.append(term, description);

  return wrapper;
}

function renderPreview() {
  const mode = requireElement("output-mode").value;

  const output = requireElement("preview-output");

  output.replaceChildren();

  const status = renderPreviewStatus();

  if (status) {
    output.appendChild(status);
  }

  if (mode === "list") {
    renderQuickList(output);

    return;
  }

  const previewGrid = document.createElement("div");

  previewGrid.className = "card-grid preview-card-grid";

  state.generated.forEach((card) => {
    previewGrid.appendChild(renderPreviewCard(card));
  });

  output.appendChild(previewGrid);

  previewGrid.querySelectorAll(".preview-card").forEach((cardElement) => {
    cardElement.addEventListener("click", () => {
      togglePreviewCard(cardElement);
    });

    cardElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        togglePreviewCard(cardElement);
      }
    });
  });
}

function togglePreviewCard(cardElement) {
  const isFlipped = cardElement.classList.toggle("is-flipped");

  cardElement.setAttribute("aria-pressed", String(isFlipped));

  cardElement.setAttribute(
    "aria-label",
    isFlipped ? "Flip card to view the front" : "Flip card to view the back",
  );
}

function renderQuickList(container) {
  const list = document.createElement("div");

  list.className = "quick-list";

  state.generated.forEach((card) => {
    const category = categoryFor(card);

    const article = document.createElement("article");

    article.className = "list-item";

    const metadata = document.createElement("div");

    metadata.className = "list-meta";

    metadata.append(
      document.createTextNode(
        `${state.manifest.deck_id} · ` +
          `${card.deck_position}/` +
          `${state.generated.length}`,
      ),
      document.createElement("br"),
      createCategoryIcon(category, {
        className: "list-category-icon",
      }),
      document.createTextNode(` ${category.name}`),
    );

    const prompt = document.createElement("p");

    prompt.className = "list-prompt";

    const strong = document.createElement("strong");

    strong.textContent = card.content.prompt;

    prompt.appendChild(strong);

    if (card.content.instruction) {
      prompt.append(
        document.createElement("br"),
        document.createTextNode(card.content.instruction),
      );
    }

    article.append(metadata, prompt);
    list.appendChild(article);
  });

  container.appendChild(list);
}

function renderPrintOutput() {
  const mode = requireElement("output-mode").value;

  const output = requireElement("print-output");

  output.replaceChildren();

  if (mode === "list") {
    renderQuickList(output);

    return;
  }

  const cardsPerPage = 6;

  const cardGroups = chunkArray(state.generated, cardsPerPage);

  cardGroups.forEach((cards) => {
    const firstPosition = cards[0].deck_position;

    const lastPosition = cards[cards.length - 1].deck_position;

    const frontPage = document.createElement("section");

    frontPage.className = "print-page front-page";

    frontPage.dataset.pageType = "front";

    frontPage.dataset.cardRange = `${firstPosition}-${lastPosition}`;

    const frontGrid = document.createElement("div");

    frontGrid.className = "card-grid";

    cards.forEach((card) => {
      frontGrid.appendChild(renderFrontCard(card));
    });

    frontPage.appendChild(frontGrid);
    output.appendChild(frontPage);

    const backPage = document.createElement("section");

    backPage.className = "print-page back-page";

    backPage.dataset.pageType = "back";

    backPage.dataset.cardRange = `${firstPosition}-${lastPosition}`;

    const backGrid = document.createElement("div");

    backGrid.className = "card-grid";

    cards.forEach(() => {
      backGrid.appendChild(renderBackCard());
    });

    backPage.appendChild(backGrid);
    output.appendChild(backPage);
  });
}

function downloadManifest() {
  if (!state.manifest) {
    setStatus("Generate a deck first.");

    return;
  }

  const blob = new Blob([JSON.stringify(state.manifest, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;

  anchor.download = `trailtalk-${state.manifest.deck_id}` + "-manifest.json";

  anchor.hidden = true;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

requireElement("generate").addEventListener("click", generateDeck);

requireElement("random-seed").addEventListener("click", () => {
  requireElement("seed").value = randomCode(10);
});

requireElement("print").addEventListener("click", () => {
  window.print();
});

requireElement("download-manifest").addEventListener("click", downloadManifest);

requireElement("output-mode").addEventListener("change", () => {
  if (state.generated.length > 0) {
    renderOutput();
  }
});

requireElement("theme").addEventListener("change", (event) => {
  const requestedThemeId = event.target.value;

  try {
    const selectedTheme = requireTheme(requestedThemeId);

    state.themeId = selectedTheme.id;

    loadThemeStylesheet(state.themeId);

    if (state.manifest) {
      state.manifest.configuration.theme = state.themeId;
    }

    if (state.generated.length > 0) {
      renderOutput();
    }
  } catch (error) {
    console.error(error);

    setStatus("The selected theme is not available.");

    event.target.value = state.themeId;
  }
});

loadData().catch((error) => {
  console.error(error);

  clearGeneratedOutput();

  setStatus(
    "The card catalog could not be loaded safely. " +
      "Check the browser console for details.",
  );
});

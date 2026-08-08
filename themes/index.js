import {
  theme as trailBlue,
} from "./trail-blue/index.js";

import {
  theme as trailCharcoal,
} from "./trail-charcoal/index.js";

/*
 * Trusted theme packages bundled with Discussion Forge.
 *
 * New trusted themes must be imported and added here.
 * Theme IDs must remain unique.
 */
const registeredThemes = Object.freeze([
  trailBlue,
  trailCharcoal,
]);

const themeRegistry = new Map();

for (const theme of registeredThemes) {
  if (themeRegistry.has(theme.id)) {
    throw new Error(
      `Duplicate theme ID: ${theme.id}`,
    );
  }

  themeRegistry.set(
    theme.id,
    theme,
  );
}

/*
 * Ordered theme list used by the theme picker.
 *
 * The array is frozen so application code cannot
 * add, remove, or reorder registered themes.
 */
export const themes = Object.freeze([
  ...registeredThemes,
]);

export function getTheme(themeId) {
  if (typeof themeId !== "string") {
    throw new TypeError(
      "Theme ID must be a string.",
    );
  }

  const theme =
    themeRegistry.get(themeId);

  if (!theme) {
    throw new Error(
      `Unknown theme: ${themeId}`,
    );
  }

  return theme;
}

export function hasTheme(themeId) {
  return (
    typeof themeId === "string" &&
    themeRegistry.has(themeId)
  );
}
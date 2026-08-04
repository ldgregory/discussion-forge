import {
  theme as trailBlue,
} from "./trail-blue/index.js";

import {
  theme as trailCharcoal,
} from "./trail-charcoal/index.js";

const themeRegistry = new Map([
  [trailBlue.id, trailBlue],
  [trailCharcoal.id, trailCharcoal],
]);

export const themes = Object.freeze(
  Array.from(themeRegistry.values()),
);

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
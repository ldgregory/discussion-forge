import { trailBlueTheme } from "./trail-blue/index.js";
import { charcoalTrailTheme } from "./charcoal-trail/index.js";

const themeRegistry = new Map([
  [trailBlueTheme.id, trailBlueTheme],
  [charcoalTrailTheme.id, charcoalTrailTheme],
]);

export const themes = Object.freeze(
  Array.from(themeRegistry.values()),
);

export function getTheme(themeId) {
  if (typeof themeId !== "string") {
    throw new TypeError("Theme ID must be a string.");
  }

  const theme = themeRegistry.get(themeId);

  if (!theme) {
    throw new Error(`Unknown theme: ${themeId}`);
  }

  return theme;
}

export function hasTheme(themeId) {
  return (
    typeof themeId === "string" &&
    themeRegistry.has(themeId)
  );
}
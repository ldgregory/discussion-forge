import { trailBlueTheme } from "./trail-blue.js";
import { charcoalTrailTheme } from "./charcoal-trail.js";

export const themes = [
  trailBlueTheme,
  charcoalTrailTheme,
];

export function getTheme(themeId) {
  return themes.find((theme) => theme.id === themeId) ?? themes[0];
}
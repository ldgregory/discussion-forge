/*
 * Trail Charcoal
 *
 * A darker alternative to the canonical Trail Talk theme.
 *
 * This package defines the visual appearance of the application,
 * including its colors, typography, artwork, and icons.
 */

export const theme = Object.freeze({

  /*
   * Theme identity
   */
  id: "trail-charcoal",
  name: "Trail Charcoal",

  /*
   * Package metadata
   */
  version: "1.0.0",
  author: "Overlanding Atlas",
  description:
    "A darker Trail Talk theme with charcoal styling " +
    "and high-contrast card artwork.",
  license: "Apache-2.0",

  /*
   * Theme resources
   */
  className: "theme-trail-charcoal",
  stylesheet: "themes/trail-charcoal/theme.css",
  assetRoot: "themes/trail-charcoal/assets",

});
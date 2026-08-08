/*
 * Discussion Forge theme validation.
 *
 * This module validates trusted theme-package definitions
 * before they are used by the application.
 */

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const LIMITS = Object.freeze({
  maxThemeNameLength: 32,
  maxDescriptionLength: 240,
  maxLicenseLength: 64,
  maxPathLength: 200,
});

/*
 * Return true only for non-null, non-array objects.
 */
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/*
 * Return true when a theme-owned path is safely confined to
 * the expected relative application namespace.
 */
function isSafeThemePath(path) {
  return (
    typeof path === "string" &&
    path.length > 0 &&
    path.length <= LIMITS.maxPathLength &&
    path.startsWith("themes/") &&
    !path.includes("..") &&
    !path.includes("\\") &&
    !path.includes(":") &&
    !path.startsWith("/")
  );
}

/*
 * Validate one trusted theme definition exported by the
 * theme registry.
 */
export function validateThemeDefinition(theme) {
  if (!isPlainObject(theme)) {
    return false;
  }

  return (
    typeof theme.id === "string" &&
    ID_PATTERN.test(theme.id) &&

    typeof theme.name === "string" &&
    theme.name.length > 0 &&
    theme.name.length <= LIMITS.maxThemeNameLength &&

    typeof theme.version === "string" &&
    SEMVER_PATTERN.test(theme.version) &&

    typeof theme.author === "string" &&
    theme.author.length > 0 &&
    theme.author.length <= LIMITS.maxThemeNameLength &&

    typeof theme.description === "string" &&
    theme.description.length > 0 &&
    theme.description.length <= LIMITS.maxDescriptionLength &&

    typeof theme.license === "string" &&
    theme.license.length > 0 &&
    theme.license.length <= LIMITS.maxLicenseLength &&

    typeof theme.className === "string" &&
    ID_PATTERN.test(theme.className) &&
    theme.className === `theme-${theme.id}` &&

    isSafeThemePath(theme.stylesheet) &&
    theme.stylesheet === `themes/${theme.id}/theme.css` &&
    theme.stylesheet.endsWith("/theme.css") &&

    isSafeThemePath(theme.assetRoot) &&
    theme.assetRoot === `themes/${theme.id}/assets` &&
    theme.assetRoot.endsWith("/assets")
  );
}
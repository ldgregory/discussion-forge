import test from "node:test";
import assert from "node:assert/strict";

import {
  validateThemeDefinition,
} from "../../js/validators/theme-validator.js";

/*
 * Return a fresh valid theme for every test.
 */
function createValidTheme() {
  return {
    id: "test-theme",
    name: "Test Theme",
    version: "1.0.0",
    author: "Discussion Forge",
    description:
      "A valid theme used by the automated validator tests.",
    license: "Apache-2.0",

    className: "theme-test-theme",

    stylesheet:
      "themes/test-theme/theme.css",

    assetRoot:
      "themes/test-theme/assets",
  };
}

test("validateThemeDefinition accepts a valid theme", () => {
  assert.equal(
    validateThemeDefinition(createValidTheme()),
    true,
  );
});

test("validateThemeDefinition rejects a non-object value", () => {
  assert.equal(
    validateThemeDefinition("test-theme"),
    false,
  );
});

test("validateThemeDefinition rejects an invalid theme ID", () => {
  const theme = createValidTheme();

  theme.id = "Test Theme";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects an invalid semantic version", () => {
  const theme = createValidTheme();

  theme.version = "1.0";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects an empty theme name", () => {
  const theme = createValidTheme();

  theme.name = "";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects an empty author", () => {
  const theme = createValidTheme();

  theme.author = "";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects an empty description", () => {
  const theme = createValidTheme();

  theme.description = "";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects an empty license", () => {
  const theme = createValidTheme();

  theme.license = "";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects a class name that does not match the theme ID", () => {
  const theme = createValidTheme();

  theme.className = "theme-other";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects a stylesheet outside the theme namespace", () => {
  const theme = createValidTheme();

  theme.stylesheet =
    "css/test-theme.css";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects stylesheet path traversal", () => {
  const theme = createValidTheme();

  theme.stylesheet =
    "themes/test-theme/../evil.css";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects a stylesheet belonging to another theme", () => {
  const theme = createValidTheme();

  theme.stylesheet =
    "themes/other-theme/theme.css";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects an asset root outside the theme namespace", () => {
  const theme = createValidTheme();

  theme.assetRoot =
    "assets/test-theme";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects asset-root path traversal", () => {
  const theme = createValidTheme();

  theme.assetRoot =
    "themes/test-theme/../assets";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects an asset root belonging to another theme", () => {
  const theme = createValidTheme();

  theme.assetRoot =
    "themes/other-theme/assets";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects Windows-style path separators", () => {
  const theme = createValidTheme();

  theme.assetRoot =
    "themes\\test-theme\\assets";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});

test("validateThemeDefinition rejects colon-containing paths", () => {
  const theme = createValidTheme();

  theme.stylesheet =
    "themes/test-theme/http:theme.css";

  assert.equal(
    validateThemeDefinition(theme),
    false,
  );
});
import assert from "node:assert/strict";
import test from "node:test";

import {
  updateBuilderStatus,
} from "../js/builder-status.js";

/*
 * Provide the minimal DOM-like surface used by the status
 * helper without requiring a browser or DOM test dependency.
 */
function createStatusElement() {
  const classes = new Set();

  return {
    textContent: "",

    classList: {
      contains(className) {
        return classes.has(className);
      },

      toggle(className, force) {
        if (force) {
          classes.add(className);
        } else {
          classes.delete(className);
        }
      },
    },
  };
}

test("builder status defaults to success", () => {
  const element = createStatusElement();

  updateBuilderStatus(element, "Generated 24 playable cards.");

  assert.equal(
    element.textContent,
    "Generated 24 playable cards.",
  );

  assert.equal(
    element.classList.contains("builder-status-warning"),
    false,
  );

  assert.equal(
    element.classList.contains("builder-status-error"),
    false,
  );
});

test("builder status applies warning treatment", () => {
  const element = createStatusElement();

  updateBuilderStatus(
    element,
    "Deck size must be between 1 and 250.",
    "warning",
  );

  assert.equal(
    element.classList.contains("builder-status-warning"),
    true,
  );

  assert.equal(
    element.classList.contains("builder-status-error"),
    false,
  );
});

test("builder status applies error treatment", () => {
  const element = createStatusElement();

  updateBuilderStatus(
    element,
    "The selected theme is not available.",
    "error",
  );

  assert.equal(
    element.classList.contains("builder-status-warning"),
    false,
  );

  assert.equal(
    element.classList.contains("builder-status-error"),
    true,
  );
});

test("builder status clears stale semantic classes", () => {
  const element = createStatusElement();

  updateBuilderStatus(element, "Failure.", "error");

  updateBuilderStatus(element, "Warning.", "warning");

  assert.equal(
    element.classList.contains("builder-status-warning"),
    true,
  );

  assert.equal(
    element.classList.contains("builder-status-error"),
    false,
  );

  updateBuilderStatus(element, "Success.");

  assert.equal(
    element.classList.contains("builder-status-warning"),
    false,
  );

  assert.equal(
    element.classList.contains("builder-status-error"),
    false,
  );
});

test("builder status rejects an unsupported type", () => {
  const element = createStatusElement();

  assert.throws(
    () => {
      updateBuilderStatus(
        element,
        "Invalid.",
        "warnng",
      );
    },
    /Unsupported builder status type/,
  );
});
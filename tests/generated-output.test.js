import test from "node:test";
import assert from "node:assert/strict";

import {
  clearGeneratedOutput,
} from "../js/generated-output.js";

function createOutputFixture() {
  const state = {
    generated: [
      {
        card_uuid: "12345678-1234-4123-8123-123456789abc",
      },
    ],

    manifest: {
      deck_id: "TEST-DECK",
    },
  };

  const previewOutput = {
    cleared: false,

    replaceChildren() {
      this.cleared = true;
    },
  };

  const printOutput = {
    cleared: false,

    replaceChildren() {
      this.cleared = true;
    },
  };

  return {
    state,
    previewOutput,
    printOutput,
  };
}

test("clearGeneratedOutput clears generated deck state", () => {
  const fixture = createOutputFixture();

  clearGeneratedOutput(fixture);

  assert.deepEqual(
    fixture.state.generated,
    [],
  );

  assert.equal(
    fixture.state.manifest,
    null,
  );
});

test("clearGeneratedOutput clears preview output", () => {
  const fixture = createOutputFixture();

  clearGeneratedOutput(fixture);

  assert.equal(
    fixture.previewOutput.cleared,
    true,
  );
});

test("clearGeneratedOutput clears print output", () => {
  const fixture = createOutputFixture();

  clearGeneratedOutput(fixture);

  assert.equal(
    fixture.printOutput.cleared,
    true,
  );
});

test("clearGeneratedOutput is safe when output is already empty", () => {
  const fixture = createOutputFixture();

  fixture.state.generated = [];
  fixture.state.manifest = null;

  assert.doesNotThrow(() => {
    clearGeneratedOutput(fixture);
  });

  assert.deepEqual(
    fixture.state.generated,
    [],
  );

  assert.equal(
    fixture.state.manifest,
    null,
  );

  assert.equal(
    fixture.previewOutput.cleared,
    true,
  );

  assert.equal(
    fixture.printOutput.cleared,
    true,
  );
});
/*
 * Clear all generated deck state and rendered output.
 *
 * Generated output is derived state. Once a generation attempt
 * fails or the current builder configuration becomes invalid,
 * previously generated output must not remain visible as though
 * it still represents the current configuration.
 */
export function clearGeneratedOutput({
  state,
  previewOutput,
  printOutput,
}) {
  state.generated = [];
  state.manifest = null;

  previewOutput.replaceChildren();
  printOutput.replaceChildren();
}
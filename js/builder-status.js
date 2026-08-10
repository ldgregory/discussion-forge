/*
 * Discussion Forge builder-status feedback.
 *
 * Applies one semantic status treatment to the live builder
 * message without allowing stale warning/error classes to
 * survive a later status update.
 */

const STATUS_TYPES = Object.freeze([
  "success",
  "warning",
  "error",
]);

export function updateBuilderStatus(
  statusElement,
  message,
  type = "success",
) {
  if (!STATUS_TYPES.includes(type)) {
    throw new TypeError(`Unsupported builder status type: "${type}".`);
  }

  statusElement.textContent = message;

  statusElement.classList.toggle(
    "builder-status-warning",
    type === "warning",
  );

  statusElement.classList.toggle(
    "builder-status-error",
    type === "error",
  );
}
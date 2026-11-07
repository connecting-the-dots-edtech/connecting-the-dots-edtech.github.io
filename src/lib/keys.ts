/** True when keyboard focus is in a text-entry control, so global shortcuts (like "/") must not fire. */
export function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  return el.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') !== null;
}

/** True when keyboard focus is in a text-entry control, so global shortcuts (like "/") must not fire. */
export function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  return el.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') !== null;
}

/**
 * True for a bare ArrowLeft / ArrowRight with no modifier held, so page-level
 * arrow handlers never swallow browser shortcuts like Alt+← / Cmd+← (Back).
 */
export function isPlainArrow(e: KeyboardEvent): boolean {
  return (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
}

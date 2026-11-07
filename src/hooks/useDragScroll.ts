import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Click-and-drag horizontal scrolling for the timeline track, mouse only
 * (touch keeps native scrolling). Suppresses the click that follows a drag of
 * more than 4px so the card under the pointer doesn't open when the user was
 * just panning. Takes an external ref so the same DOM node can also be
 * targeted by scrollToEra().
 *
 * The cursor and `scroll-behavior` are set imperatively on the ref: while
 * dragging, the scroller's CSS `scroll-smooth` must be off or every
 * `scrollLeft` write would animate and lag the pointer.
 */
export function useDragScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerDown = (e: PointerEvent) => {
      // reset first: a drag released outside the scroller must not swallow the next touch / pen click
      moved = false;
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.scrollBehavior = 'auto';
      el.style.cursor = 'grabbing';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      el.style.scrollBehavior = '';
      el.style.cursor = 'grab';
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('click', onClickCapture, true);
      el.style.scrollBehavior = '';
      el.style.cursor = '';
    };
  }, [ref]);
}

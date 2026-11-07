import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useTimelineApp } from '../../state/TimelineAppContext';
import type { ViewMode } from '../../data/types';

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'list', label: 'List' },
];

const BUTTON =
  'rounded-[7px] px-3.5 py-1.5 font-ui text-[14px] font-medium text-text-2 aria-pressed:bg-raised aria-pressed:text-text aria-pressed:shadow-[inset_0_0_0_1px_var(--line-strong)]';

interface ViewSwitchProps {
  /**
   * Set when a focused switch button changes the view. The parent mounts the
   * switch in a different place per view, so the new instance reads this on
   * mount and takes focus back onto its pressed button.
   */
  refocus: RefObject<boolean>;
}

/** Timeline / List segmented control; reads and writes `view` from the app context. */
export function ViewSwitch({ refocus }: ViewSwitchProps) {
  const { view, setView } = useTimelineApp();
  const pressedRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    pressedRef.current?.focus({ preventScroll: true });
  }, [view, refocus]);

  return (
    <div
      role="group"
      aria-label="View"
      lang="en"
      className="inline-flex flex-none rounded-[10px] border border-line-strong bg-surface p-[3px]"
    >
      {VIEWS.map((v) => (
        <button
          key={v.id}
          ref={view === v.id ? pressedRef : undefined}
          type="button"
          aria-pressed={view === v.id}
          onClick={(e) => {
            if (v.id === view) return;
            if (e.currentTarget === document.activeElement) refocus.current = true;
            setView(v.id);
          }}
          className={BUTTON}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

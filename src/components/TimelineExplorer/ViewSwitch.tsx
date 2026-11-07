import { useTimelineApp } from '../../state/TimelineAppContext';
import type { ViewMode } from '../../data/types';

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'list', label: 'List' },
];

const BUTTON =
  'rounded-[7px] px-3.5 py-1.5 font-ui text-[14px] font-medium text-text-2 aria-pressed:bg-raised aria-pressed:text-text aria-pressed:shadow-[inset_0_0_0_1px_var(--line-strong)]';

/** Timeline / List segmented control; reads and writes `view` from the app context. */
export function ViewSwitch() {
  const { view, setView } = useTimelineApp();

  return (
    <div
      role="group"
      aria-label="View"
      lang="en"
      className="inline-flex flex-none rounded-[10px] border border-line-strong bg-surface p-[3px]"
    >
      {VIEWS.map((v) => (
        <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => setView(v.id)} className={BUTTON}>
          {v.label}
        </button>
      ))}
    </div>
  );
}

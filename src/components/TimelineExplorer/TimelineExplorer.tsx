import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTimelineApp } from '../../state/TimelineAppContext';
import { TimelineView } from './TimelineView';
import { ListView } from './ListView';
import { ScrubberMinimap } from './ScrubberMinimap';
import { ViewSwitch } from './ViewSwitch';

const GUTTER = 'pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]';

export function TimelineExplorer() {
  const { view } = useTimelineApp();
  const timeline = view === 'timeline';
  const phone = useMediaQuery('(max-width: 760px)');
  // Exactly one ViewSwitch is mounted at a time: above the track on phones and in
  // list view, beside the minimap otherwise.
  const topSwitch = !timeline || phone;

  return (
    <section id="timeline" className="relative pb-10">
      {topSwitch && (
        <div className={'flex justify-center pt-6 ' + GUTTER}>
          <ViewSwitch />
        </div>
      )}

      {timeline ? (
        <>
          <TimelineView />
          <div className={GUTTER}>
            <div className="mx-auto max-w-[1120px]">
              <div className="mt-[14px] flex items-center gap-4 phone:hidden">
                <ScrubberMinimap />
                {!topSwitch && <ViewSwitch />}
              </div>
              <div
                id="tl-hints"
                lang="en"
                className="mt-2 flex justify-between font-ui text-[13px] text-muted phone:hidden"
              >
                <span>← Before time</span>
                <span>Drag or use the arrows</span>
                <span>Present →</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ListView />
      )}
    </section>
  );
}

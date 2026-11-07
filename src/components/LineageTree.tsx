import { events } from '../data/timeline';
import { useTimelineApp } from '../state/TimelineAppContext';
import { PageHeader } from './ui/PageHeader';

/** Main-line grid column: the middle of three on desktop, the first of two on phones. */
const MAIN_COL = 'col-start-2 phone:col-start-1';
/** Two-column span for the Ibrahim split and the Ismail / Ishaq pair. */
const PAIR_COL = 'col-span-2 col-start-2 phone:col-start-1';

type NodeProps = {
  bn: string;
  /** main-line node (default), the pair's Ismail, or Ishaq's side branch */
  kind?: 'main' | 'pair' | 'branch';
  major?: boolean;
  first?: boolean;
  note?: string;
  onRead?: () => void;
};

const NODE_BASE =
  'relative z-2 grid min-w-[190px] justify-items-center gap-0.5 justify-self-center rounded-[14px] border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--gold)_8%,var(--surface)),var(--surface))] px-6 py-3 text-center phone:max-w-[168px] phone:min-w-0 phone:px-3.5 phone:py-2.5';
const DIAMOND =
  "before:absolute before:-top-1.5 before:left-1/2 before:-ml-[5px] before:size-2.5 before:rotate-45 before:content-['']";

function Node({ bn, kind = 'main', major, first, note, onRead }: NodeProps) {
  const branch = kind === 'branch';
  const border = branch ? 'border-[color-mix(in_srgb,var(--e-later)_60%,transparent)]' : major ? 'border-gold' : 'border-line-strong';
  const shadow = major ? 'shadow-[var(--shadow),0_0_26px_var(--glow)]' : 'shadow-[var(--shadow)]';
  const diamond = first
    ? ''
    : branch
      ? DIAMOND + ' before:bg-[var(--e-later)] before:shadow-[0_0_10px_var(--e-later)]'
      : DIAMOND + ' before:bg-gold before:shadow-[0_0_10px_var(--gold)]';
  const col = kind === 'main' ? MAIN_COL : branch ? 'col-start-2 row-start-1' : 'row-start-1';
  return (
    <div
      data-lineage={branch ? 'branch' : 'main'}
      className={[NODE_BASE, border, shadow, diamond, col].join(' ')}
    >
      <span
        className={
          'font-bn-display leading-[1.3] text-text ' +
          (major ? 'text-[25px] phone:text-[21px]' : 'text-[22px] phone:text-[19px]')
        }
      >
        {bn}
      </span>
      {note && <span className="mt-1 max-w-[200px] font-bn text-[13.5px] text-muted">{note}</span>}
      {onRead && (
        <button
          type="button"
          lang="en"
          onClick={onRead}
          className="mt-1.5 cursor-pointer font-ui text-[13px] font-semibold text-gold"
        >
          Read →
        </button>
      )}
    </div>
  );
}

/** A direct parent-to-child link: solid gold line with an optional side label. */
function Link({ label }: { label?: string }) {
  return (
    <div className={'relative h-[34px] w-0.5 justify-self-center bg-gold ' + MAIN_COL}>
      {label && (
        <span className="absolute left-4 mt-1.5 font-bn text-[13px] whitespace-nowrap text-muted phone:text-[12.5px]">{label}</span>
      )}
    </div>
  );
}

/** Many generations in between: dotted gold line labelled "বহু প্রজন্ম". */
function Gap() {
  return (
    <div
      className={
        'relative h-16 w-0.5 justify-self-center bg-[repeating-linear-gradient(180deg,var(--gold)_0_3px,transparent_3px_8px)] ' +
        MAIN_COL
      }
    >
      <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bn text-[13.5px] whitespace-nowrap text-muted phone:text-[12.5px]">
        বহু প্রজন্ম
      </span>
    </div>
  );
}

export function LineageTree() {
  const { openQuickLook } = useTimelineApp();
  const adam = events.find((e) => e.id === 7);

  return (
    <>
      <PageHeader title="নবীগণের বংশধারা" />
      <div className="pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
        <section aria-label="নবীগণের বংশধারা" className="mx-auto max-w-280 pb-14">
          <div className="mt-[22px] flex flex-wrap justify-center gap-[18px] font-bn text-[13.5px] text-muted">
            <span className="inline-flex items-center gap-2">
              <i className="inline-block h-0 w-7 border-t-2 border-gold" />
              সরাসরি সন্তান
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="inline-block h-0 w-7 border-t-2 border-dotted border-gold" />
              মাঝে বহু প্রজন্ম
            </span>
          </div>

          <div
            id="lineage-tree"
            className="grid [--col:260px] grid-cols-[repeat(3,var(--col))] justify-center py-7 pb-10 phone:[--col:172px] phone:grid-cols-[repeat(2,var(--col))]"
          >
            <Node bn="আদম (আঃ)" major first onRead={adam ? () => openQuickLook(adam) : undefined} />
            <Link label="পুত্র" />
            <Node bn="শীষ (আঃ)" />
            <Gap />
            <Node bn="নূহ (আঃ)" />
            <Gap />
            <Node bn="ইব্রাহিম (আঃ)" major />
            <div className={'relative h-[34px] ' + PAIR_COL}>
              <span className="absolute top-0 left-[calc(var(--col)_/_2_-_1px)] h-full w-0.5 bg-gold" />
              <span className="absolute top-1/2 left-[calc(var(--col)_/_2)] h-0.5 w-(--col) bg-gold" />
              <span className="absolute top-1/2 bottom-0 left-[calc(var(--col)_*_1.5_-_1px)] w-0.5 bg-gold" />
            </div>
            <div className={'grid grid-cols-[var(--col)_var(--col)] items-start ' + PAIR_COL}>
              <Node bn="ইসমাইল (আঃ)" kind="pair" />
              <Node bn="ইসহাক (আঃ)" kind="branch" note="বনী ইসরাঈলের নবীগণের ধারা" />
            </div>
            <Gap />
            <Node bn="আদনান" />
            <Gap />
            <Node bn="আব্দুল্লাহ" />
            <Link label="পুত্র" />
            <Node bn="মুহাম্মদ ﷺ" major />
          </div>
        </section>
      </div>
    </>
  );
}

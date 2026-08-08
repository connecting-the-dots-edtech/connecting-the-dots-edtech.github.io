import { parseEventMarkdown } from '../parseEvent';
import type { TimelineEvent } from '../../data/types';

import theBeginningOfCreation from './001-the-throne-and-the-pen.md?raw';
import theThroneAndTheFootstool from './002-the-throne-and-the-footstool.md?raw';
import theSevenEarths from './003-the-seven-earths.md?raw';
import seasAndRivers from './004-seas-and-rivers.md?raw';
import typesAndDutiesOfAngels from './005-types-and-duties-of-angels.md?raw';
import creationOfJinnAndShaitan from './006-creation-of-jinn-and-shaitan.md?raw';
import creationOfAdam from './007-creation-of-adam.md?raw';
import habilAndQabil from './008-habil-and-qabil.md?raw';
import storyOfIdris from './009-story-of-idris.md?raw';

/**
 * The content map. To add a new event to the timeline:
 *   1. Create a new `NNN-slug.md` file in this folder (frontmatter fields:
 *      id, era, year, title, titleEn, up, thumb, and optionally arabic/source
 *      — see any existing file for the exact shape; the Markdown body below
 *      the `---` fence is the event's narrative text).
 *   2. Import it above and add one line to this map, keyed by id.
 * Nothing else in the app needs to change — eraById lookups, search, the
 * event detail page, and prev/next navigation all read from this map.
 */
const rawEventFiles: Record<number, string> = {
  1: theBeginningOfCreation,
  2: theThroneAndTheFootstool,
  3: theSevenEarths,
  4: seasAndRivers,
  5: typesAndDutiesOfAngels,
  6: creationOfJinnAndShaitan,
  7: creationOfAdam,
  8: habilAndQabil,
  9: storyOfIdris,
};

export const events: TimelineEvent[] = Object.values(rawEventFiles)
  .map(parseEventMarkdown)
  .sort((a, b) => a.id - b.id);

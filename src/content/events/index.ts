import { parseEventMarkdown } from '../parseEvent';
import type { TimelineEvent } from '../../data/types';

import creationOfTheUniverse from './001-creation-of-the-universe.md?raw';
import creationOfAdam from './002-creation-of-adam.md?raw';
import nuhAndTheFlood from './003-nuh-and-the-flood.md?raw';
import ibrahimBuildsTheKaaba from './004-ibrahim-builds-the-kaaba.md?raw';
import birthOfTheProphet from './005-birth-of-the-prophet.md?raw';
import theFirstRevelation from './006-the-first-revelation.md?raw';
import theHijraToMedina from './007-the-hijra-to-medina.md?raw';
import battleOfBadr from './008-battle-of-badr.md?raw';
import conquestOfMecca from './009-conquest-of-mecca.md?raw';
import caliphateOfAbuBakr from './010-caliphate-of-abu-bakr.md?raw';
import umarAndExpansion from './011-umar-and-expansion.md?raw';
import umayyadCaliphate from './012-umayyad-caliphate.md?raw';
import baghdadAndTheHouseOfWisdom from './013-baghdad-and-the-house-of-wisdom.md?raw';
import alAndalus from './014-al-andalus.md?raw';
import ottomanCaliphate from './015-ottoman-caliphate.md?raw';

/**
 * The content map. To add a new event to the timeline:
 *   1. Create a new `NNN-slug.md` file in this folder (frontmatter fields:
 *      id, era, year, title, titleEn, up, thumb, and optionally arabic —
 *      see any existing file for the exact shape; the Markdown body below
 *      the `---` fence is the event's narrative text).
 *   2. Import it above and add one line to this map, keyed by id.
 * Nothing else in the app needs to change — eraById lookups, search, the
 * event detail page, and prev/next navigation all read from this map.
 */
const rawEventFiles: Record<number, string> = {
  1: creationOfTheUniverse,
  2: creationOfAdam,
  3: nuhAndTheFlood,
  4: ibrahimBuildsTheKaaba,
  5: birthOfTheProphet,
  6: theFirstRevelation,
  7: theHijraToMedina,
  8: battleOfBadr,
  9: conquestOfMecca,
  10: caliphateOfAbuBakr,
  11: umarAndExpansion,
  12: umayyadCaliphate,
  13: baghdadAndTheHouseOfWisdom,
  14: alAndalus,
  15: ottomanCaliphate,
};

export const events: TimelineEvent[] = Object.values(rawEventFiles)
  .map(parseEventMarkdown)
  .sort((a, b) => a.id - b.id);

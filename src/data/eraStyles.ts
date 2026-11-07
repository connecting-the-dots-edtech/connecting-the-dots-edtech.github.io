import type { EraId } from './types';

/**
 * Sets the `--e` custom property to the era's colour token. Put on an element
 * (or ancestor), then use `text-e`, `bg-e`, `border-(--e)`, `stroke-e`, `fill-e`
 * (not `border-e`: in Tailwind v4 that is the inline-end border width utility).
 * Spelled out literally so Tailwind's scanner sees every class.
 */
export const eraVar: Record<EraId, string> = {
  cosmos: '[--e:var(--e-cosmos)]',
  prophets: '[--e:var(--e-prophets)]',
  jahiliyya: '[--e:var(--e-jahiliyya)]',
  seerah: '[--e:var(--e-seerah)]',
  rashidun: '[--e:var(--e-rashidun)]',
  umayyad: '[--e:var(--e-umayyad)]',
  abbasid: '[--e:var(--e-abbasid)]',
  later: '[--e:var(--e-later)]',
};

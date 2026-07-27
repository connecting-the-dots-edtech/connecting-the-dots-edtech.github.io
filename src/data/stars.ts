/**
 * Fixed decorative starfield for the hero. Baked in ahead of time (rather
 * than Math.random() at runtime) so every position/size/timing is a literal
 * Tailwind class Tailwind can pick up statically — no inline `style` needed.
 */
export interface Star {
  left: string;
  top: string;
  size: string;
  timing: string;
}

export const stars: Star[] = [
  { left: 'left-[64%]', top: 'top-[2%]', size: 'w-[1.6px] h-[1.6px]', timing: '[animation-duration:2.7s] [animation-delay:2.9s]' },
  { left: 'left-[68%]', top: 'top-[71%]', size: 'w-[1.2px] h-[1.2px]', timing: '[animation-duration:3.3s] [animation-delay:0.1s]' },
  { left: 'left-[22%]', top: 'top-[40%]', size: 'w-[1.1px] h-[1.1px]', timing: '[animation-duration:2.6s] [animation-delay:2.6s]' },
  { left: 'left-[54%]', top: 'top-[18%]', size: 'w-[2.2px] h-[2.2px]', timing: '[animation-duration:4.4s] [animation-delay:0.0s]' },
  { left: 'left-[81%]', top: 'top-[56%]', size: 'w-[1.7px] h-[1.7px]', timing: '[animation-duration:2.5s] [animation-delay:3.8s]' },
  { left: 'left-[34%]', top: 'top-[7%]', size: 'w-[1.2px] h-[1.2px]', timing: '[animation-duration:4.5s] [animation-delay:2.4s]' },
  { left: 'left-[81%]', top: 'top-[58%]', size: 'w-[2.1px] h-[2.1px]', timing: '[animation-duration:4.9s] [animation-delay:1.5s]' },
  { left: 'left-[55%]', top: 'top-[66%]', size: 'w-[2.2px] h-[2.2px]', timing: '[animation-duration:4.6s] [animation-delay:2.3s]' },
  { left: 'left-[70%]', top: 'top-[4%]', size: 'w-[1.5px] h-[1.5px]', timing: '[animation-duration:2.9s] [animation-delay:0.3s]' },
  { left: 'left-[23%]', top: 'top-[8%]', size: 'w-[1.6px] h-[1.6px]', timing: '[animation-duration:3.9s] [animation-delay:1.5s]' },
  { left: 'left-[37%]', top: 'top-[17%]', size: 'w-[1.5px] h-[1.5px]', timing: '[animation-duration:4.8s] [animation-delay:2.6s]' },
  { left: 'left-[61%]', top: 'top-[14%]', size: 'w-[2.5px] h-[2.5px]', timing: '[animation-duration:2.5s] [animation-delay:1.5s]' },
  { left: 'left-[99%]', top: 'top-[51%]', size: 'w-[2.1px] h-[2.1px]', timing: '[animation-duration:4.1s] [animation-delay:3.4s]' },
  { left: 'left-[78%]', top: 'top-[18%]', size: 'w-[1.1px] h-[1.1px]', timing: '[animation-duration:2.9s] [animation-delay:1.1s]' },
  { left: 'left-[21%]', top: 'top-[75%]', size: 'w-[2.8px] h-[2.8px]', timing: '[animation-duration:2.9s] [animation-delay:2.6s]' },
  { left: 'left-[40%]', top: 'top-[73%]', size: 'w-[1.9px] h-[1.9px]', timing: '[animation-duration:2.8s] [animation-delay:1.0s]' },
  { left: 'left-[56%]', top: 'top-[21%]', size: 'w-[2.2px] h-[2.2px]', timing: '[animation-duration:4.7s] [animation-delay:1.6s]' },
  { left: 'left-[22%]', top: 'top-[80%]', size: 'w-[2.0px] h-[2.0px]', timing: '[animation-duration:2.3s] [animation-delay:0.2s]' },
  { left: 'left-[11%]', top: 'top-[50%]', size: 'w-[2.6px] h-[2.6px]', timing: '[animation-duration:3.3s] [animation-delay:0.3s]' },
  { left: 'left-[38%]', top: 'top-[80%]', size: 'w-[2.1px] h-[2.1px]', timing: '[animation-duration:4.9s] [animation-delay:3.4s]' },
  { left: 'left-[1%]', top: 'top-[58%]', size: 'w-[2.4px] h-[2.4px]', timing: '[animation-duration:3.6s] [animation-delay:1.1s]' },
  { left: 'left-[64%]', top: 'top-[9%]', size: 'w-[1.9px] h-[1.9px]', timing: '[animation-duration:3.4s] [animation-delay:3.8s]' },
  { left: 'left-[88%]', top: 'top-[21%]', size: 'w-[2.0px] h-[2.0px]', timing: '[animation-duration:2.5s] [animation-delay:3.7s]' },
  { left: 'left-[87%]', top: 'top-[24%]', size: 'w-[2.3px] h-[2.3px]', timing: '[animation-duration:3.8s] [animation-delay:0.6s]' },
  { left: 'left-[76%]', top: 'top-[43%]', size: 'w-[2.6px] h-[2.6px]', timing: '[animation-duration:3.6s] [animation-delay:0.0s]' },
  { left: 'left-[32%]', top: 'top-[2%]', size: 'w-[2.9px] h-[2.9px]', timing: '[animation-duration:4.6s] [animation-delay:3.3s]' },
  { left: 'left-[31%]', top: 'top-[5%]', size: 'w-[2.8px] h-[2.8px]', timing: '[animation-duration:4.8s] [animation-delay:0.3s]' },
  { left: 'left-[49%]', top: 'top-[6%]', size: 'w-[2.5px] h-[2.5px]', timing: '[animation-duration:4.3s] [animation-delay:0.5s]' },
  { left: 'left-[48%]', top: 'top-[44%]', size: 'w-[1.5px] h-[1.5px]', timing: '[animation-duration:4.6s] [animation-delay:1.7s]' },
  { left: 'left-[21%]', top: 'top-[43%]', size: 'w-[2.5px] h-[2.5px]', timing: '[animation-duration:2.6s] [animation-delay:1.2s]' },
  { left: 'left-[100%]', top: 'top-[52%]', size: 'w-[1.9px] h-[1.9px]', timing: '[animation-duration:3.6s] [animation-delay:0.5s]' },
  { left: 'left-[22%]', top: 'top-[27%]', size: 'w-[2.2px] h-[2.2px]', timing: '[animation-duration:2.7s] [animation-delay:0.9s]' },
  { left: 'left-[7%]', top: 'top-[50%]', size: 'w-[1.5px] h-[1.5px]', timing: '[animation-duration:4.7s] [animation-delay:3.4s]' },
  { left: 'left-[7%]', top: 'top-[19%]', size: 'w-[2.3px] h-[2.3px]', timing: '[animation-duration:2.6s] [animation-delay:0.5s]' },
  { left: 'left-[94%]', top: 'top-[46%]', size: 'w-[1.9px] h-[1.9px]', timing: '[animation-duration:4.4s] [animation-delay:3.2s]' },
  { left: 'left-[19%]', top: 'top-[8%]', size: 'w-[1.9px] h-[1.9px]', timing: '[animation-duration:3.3s] [animation-delay:1.9s]' },
  { left: 'left-[73%]', top: 'top-[54%]', size: 'w-[3.0px] h-[3.0px]', timing: '[animation-duration:2.3s] [animation-delay:1.6s]' },
  { left: 'left-[34%]', top: 'top-[69%]', size: 'w-[1.5px] h-[1.5px]', timing: '[animation-duration:2.6s] [animation-delay:1.8s]' },
  { left: 'left-[42%]', top: 'top-[22%]', size: 'w-[1.5px] h-[1.5px]', timing: '[animation-duration:4.8s] [animation-delay:1.8s]' },
  { left: 'left-[86%]', top: 'top-[44%]', size: 'w-[1.1px] h-[1.1px]', timing: '[animation-duration:5.0s] [animation-delay:3.3s]' },
];

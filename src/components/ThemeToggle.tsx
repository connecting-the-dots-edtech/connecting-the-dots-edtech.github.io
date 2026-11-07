import { useTheme } from '../state/ThemeContext';
import { MoonIcon } from './ui/icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-line-strong text-text-2 hover:border-gold hover:text-gold"
    >
      <MoonIcon className="size-4" />
    </button>
  );
}

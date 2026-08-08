import { useTheme } from '../state/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={!isDark}
      className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-border-gold bg-(--surface-2) text-gold hover:border-gold"
    >
      <span aria-hidden="true">{isDark ? '☾' : '☀'}</span>
    </button>
  );
}

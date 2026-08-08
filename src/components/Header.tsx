import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';

interface HeaderProps {
  onOpenSearch: () => void;
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/eras', label: 'Eras' },
  { to: '/lineage', label: 'Lineage' },
];

export function Header({ onOpenSearch }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-90 flex items-center justify-between gap-4 px-6 py-4 backdrop-blur-md bg-linear-to-b from-ink/92 via-ink/65 to-transparent sm:px-10">
      <NavLink to="/" className="flex items-center gap-3">
        <span className="flex h-[30px] w-[30px] rotate-45 items-center justify-center border border-border-gold">
          <span className="h-2.5 w-2.5 bg-gold" />
        </span>
        <span className="font-serif text-[19px] tracking-[0.06em] text-cream-text">
          Connecting the <span className="text-gold">Dots</span>
        </span>
      </NavLink>

      <nav className="hidden items-center gap-7 sm:flex">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `text-[13px] tracking-[0.14em] uppercase hover:text-gold-light ${isActive ? 'text-gold-light' : 'text-dim'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-gold bg-(--surface-2) px-3.5 py-2 text-[13px] text-dim hover:border-gold hover:text-cream-text"
        >
          <span className="inline-block h-3 w-3 rounded-full border-[1.5px] border-gold" />
          Search
        </button>
        <ThemeToggle />
      </nav>

      <div className="flex items-center gap-3 sm:hidden">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex h-9.5 w-9.5 flex-none flex-col items-center justify-center gap-1.25 rounded-full border border-border-gold bg-(--surface-2)"
        >
          <span className={`h-px w-4 bg-cream-text transition-transform ${menuOpen ? 'translate-y-1.25 rotate-45' : ''}`} />
          <span className={`h-px w-4 bg-cream-text transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`h-px w-4 bg-cream-text transition-transform ${menuOpen ? '-translate-y-1.25 -rotate-45' : ''}`} />
        </button>
      </div>

      <MobileNav links={NAV_LINKS} isOpen={menuOpen} onClose={() => setMenuOpen(false)} onOpenSearch={onOpenSearch} />
    </header>
  );
}

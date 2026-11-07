import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { LogoMark, SearchIcon } from './ui/icons';
import { isTypingTarget } from '../lib/keys';
import { NAV_LINKS } from './navLinks';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(document.activeElement)) return;
      e.preventDefault();
      onOpenSearch();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpenSearch]);

  return (
    <header lang="en" className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))] backdrop-blur-[10px]">
      <div className="mx-auto flex h-16 max-w-280 items-center gap-5">
        <NavLink to="/" aria-label="Connecting the Dots, home" className="mr-auto flex items-center gap-2.5 whitespace-nowrap">
          <LogoMark className="size-7 flex-none" />
          <span className="font-lat text-[19px] tracking-[0.02em] text-text phone:text-[17px]">
            Connecting the <em className="text-gold not-italic">Dots</em>
          </span>
        </NavLink>

        <nav aria-label="Site" lang="en" className="flex gap-1 whitespace-nowrap phone:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-2 font-ui text-[14.5px] font-medium hover:bg-raised hover:text-text ${
                  isActive
                    ? "text-text after:absolute after:bottom-[-3px] after:left-1/2 after:-ml-[3px] after:size-1.5 after:rotate-45 after:bg-gold after:content-['']"
                    : 'text-text-2'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search events"
          title="Search (/)"
          className="inline-grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-line-strong text-text-2 hover:border-gold hover:text-gold"
        >
          <SearchIcon className="size-4" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}

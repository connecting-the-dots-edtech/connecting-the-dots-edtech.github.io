import { NavLink } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
}

interface MobileNavProps {
  links: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileNav({ links, isOpen, onClose, onOpenSearch }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className="absolute inset-x-0 top-full z-89 flex flex-col gap-1 border-b border-border-gold bg-ink px-6 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.5)] sm:hidden"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          onClick={onClose}
          className={({ isActive }) =>
            `rounded-lg px-3.5 py-3 text-[13px] tracking-[0.14em] uppercase ${
              isActive ? 'bg-(--surface-2) text-gold-light' : 'text-dim'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenSearch();
        }}
        className="mt-1 inline-flex items-center gap-2 rounded-lg px-3.5 py-3 text-[13px] tracking-[0.14em] text-dim uppercase"
      >
        <span className="inline-block h-3 w-3 rounded-full border-[1.5px] border-gold" />
        Search
      </button>
    </div>
  );
}

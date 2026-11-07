import { NavLink } from 'react-router-dom';
import { HomeTabIcon, TimelineTabIcon, ErasTabIcon, LineageTabIcon } from './ui/icons';
import { NAV_LINKS } from './navLinks';

const TAB_ICONS: Record<string, typeof HomeTabIcon> = {
  '/': HomeTabIcon,
  '/timeline': TimelineTabIcon,
  '/eras': ErasTabIcon,
  '/lineage': LineageTabIcon,
};

export function TabBar() {
  return (
    <nav
      aria-label="Site"
      lang="en"
      className="fixed inset-x-0 bottom-0 z-45 hidden grid-cols-4 border-t border-line-strong bg-surface pt-1.5 pr-[max(8px,env(safe-area-inset-right,0px))] pb-[calc(6px+env(safe-area-inset-bottom,0px))] pl-[max(8px,env(safe-area-inset-left,0px))] phone:grid"
    >
      {NAV_LINKS.map((link) => {
        const Icon = TAB_ICONS[link.to];
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `grid justify-items-center gap-0.5 py-1.5 font-ui text-xs font-semibold ${isActive ? 'text-gold' : 'text-muted'}`
            }
          >
            <Icon className="size-5" />
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

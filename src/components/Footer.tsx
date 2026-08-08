import { Link } from 'react-router-dom';

interface IconProps {
  className?: string;
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function EmailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 6 10 7 10-7" />
    </svg>
  );
}

function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

const SITE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Eras', to: '/eras' },
  { label: 'Lineage', to: '/lineage' },
];

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/connecting.the.dots.en', Icon: FacebookIcon },
  { label: 'Email', href: 'mailto:connecting.the.dots.edtech@gmail.com', Icon: EmailIcon },
  { label: 'GitHub', href: 'https://github.com/connecting-the-dots-edtech', Icon: GitHubIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-gold bg-ink px-6 pt-10 pb-6 text-center sm:px-10">
      <div className="mx-auto max-w-310">
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {SITE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[13px] tracking-[0.14em] text-dim uppercase hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mx-auto mt-8 h-px w-full max-w-200 bg-border" />

        <div className="mt-8 flex flex-col items-center gap-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-6.5 w-6.5 rotate-45 items-center justify-center border border-border-gold">
              <span className="h-2 w-2 bg-gold" />
            </span>
            <span className="font-serif text-[17px] tracking-[0.06em] text-cream-text">
              Connecting the <span className="text-gold">Dots</span>
            </span>
          </div>
          <p className="max-w-140 text-[13px] leading-[1.7] text-dim">
            An interactive documentary tracing Islamic history from Creation to the Caliphates — built to make
            that sweep of time explorable, one event at a time.
          </p>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
              aria-label={label}
              className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-border-strong text-dim hover:border-gold hover:text-gold-light"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-310 border-t border-border pt-6">
        <div className="text-sm tracking-widest text-ghost">© {year} Connecting the Dots</div>
      </div>
    </footer>
  );
}

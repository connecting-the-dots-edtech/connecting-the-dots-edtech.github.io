import { EmailIcon, FacebookIcon, GitHubIcon, LogoMarkPlain } from './ui/icons';

const EMAIL = 'connecting.the.dots.edtech@gmail.com';

const SOCIALS = [
  { label: 'Facebook', title: 'Facebook', href: 'https://www.facebook.com/connecting.the.dots.en', Icon: FacebookIcon },
  { label: 'GitHub', title: 'GitHub', href: 'https://github.com/connecting-the-dots-edtech', Icon: GitHubIcon },
  { label: `Email: ${EMAIL}`, title: EMAIL, href: `mailto:${EMAIL}`, Icon: EmailIcon },
];

export function Footer() {
  return (
    <footer
      lang="en"
      className="mt-6 border-t border-line pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]"
    >
      <div className="mx-auto flex max-w-280 flex-wrap items-center gap-x-4 gap-y-2 py-3 font-ui text-[12.5px] text-muted">
        <span className="flex items-center gap-2 whitespace-nowrap">
          <LogoMarkPlain className="size-5 flex-none" />
          <span className="font-lat text-[14.5px] tracking-[0.02em] text-text">
            Connecting the <em className="text-gold not-italic">Dots</em>
          </span>
        </span>
        <span className="tabular-nums">© {new Date().getFullYear()}</span>
        <nav aria-label="Contact" className="ml-auto flex gap-1.5">
          {SOCIALS.map(({ label, title, href, Icon }) => {
            const external = href.startsWith('http');
            return (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                aria-label={label}
                title={title}
                className="inline-grid size-7.5 place-items-center rounded-full border border-line-strong text-text-2 hover:border-gold hover:text-gold"
              >
                <Icon className="size-3.5" />
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}

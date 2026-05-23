import { cn } from '../../lib/cn';

interface SocialLink {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface SocialIconsProps {
  links?: SocialLink[];
  className?: string;
}

const iconClass = 'h-[18px] w-[18px]';

function FacebookIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function LinkedInIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function YouTubeIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

const DEFAULT_LINKS: SocialLink[] = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: FacebookIcon },
  { href: 'https://instagram.com', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: LinkedInIcon },
  { href: 'https://youtube.com', label: 'YouTube', Icon: YouTubeIcon },
];

/**
 * Combines two Uiverse patterns:
 *  - Sage fill rises from the bottom on hover (our remix)
 *  - Tooltip floats above on hover — structural trick from "chilly-eagle-55"
 * Styles live in global.css (.ce-filled .ce-tooltip).
 *
 * Original tooltip pattern: https://uiverse.io/PriyanshuGupta28/chilly-eagle-55
 */
export default function SocialIcons({ links = DEFAULT_LINKS, className }: SocialIconsProps) {
  return (
    <ul className={cn('flex items-center gap-3', className)} role="list">
      {links.map(({ href, label, Icon }) => (
        <li key={label} className="ce-item relative">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="ce-link group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] transition-colors duration-300 ease-[var(--ease-out-quart)] hover:text-[var(--color-ink-inverse)] hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <span aria-hidden="true" className="ce-filled absolute inset-0 bg-[var(--color-accent)]" />
            <span className="relative z-10 flex">
              <Icon />
            </span>
          </a>
          <span className="ce-tooltip" aria-hidden="true">{label}</span>
        </li>
      ))}
    </ul>
  );
}

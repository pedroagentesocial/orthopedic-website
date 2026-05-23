import type { CSSProperties } from 'react';
import { cn } from '../../lib/cn';

interface SendButtonProps {
  children: React.ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
  /** Use the brighter --color-accent-loud for high-impact CTAs */
  loud?: boolean;
  /** Recalibrates animation timings/sizes for ~250px-wide buttons (hero, CTAStrip). */
  large?: boolean;
}

/**
 * Faithful adaptation of Uiverse's "loud-chicken-53" (by gharsh11032000).
 * Styles live in global.css (.send-btn .sb-arr .sb-circle .sb-text).
 *
 * Original: https://uiverse.io/gharsh11032000/loud-chicken-53
 */
export default function SendButton({
  children,
  href,
  type = 'button',
  onClick,
  className,
  loud,
  large,
}: SendButtonProps) {
  const styleVar = {
    '--sb-accent': loud ? 'var(--color-accent-loud)' : 'var(--color-accent)',
  } as CSSProperties;

  const inner = (
    <>
      <svg viewBox="0 0 24 24" className="sb-arr sb-arr-2" aria-hidden="true">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="sb-text">{children}</span>
      <span className="sb-circle" aria-hidden="true" />
      <svg viewBox="0 0 24 24" className="sb-arr sb-arr-1" aria-hidden="true">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </>
  );

  const baseClass = cn('send-btn', large && 'send-btn-large', className);

  if (href) {
    return (
      <a href={href} className={baseClass} style={styleVar}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={baseClass} style={styleVar}>
      {inner}
    </button>
  );
}

import type { CSSProperties } from 'react';
import { cn } from '../../lib/cn';

interface SplashButtonProps {
  children: React.ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
  /** Use brighter --color-accent-loud for the splash circles */
  loud?: boolean;
}

/**
 * Adaptation of Uiverse's "purple-kangaroo-17" (by KINGFRESS).
 * Styles live in global.css (.splash-btn .splash-c .splash-text).
 *
 * Original: https://uiverse.io/KINGFRESS/purple-kangaroo-17
 */
export default function SplashButton({
  children,
  href,
  type = 'button',
  onClick,
  className,
  loud,
}: SplashButtonProps) {
  const styleVar = {
    '--spl-accent': loud ? 'var(--color-accent-loud)' : 'var(--color-accent)',
  } as CSSProperties;

  const inner = (
    <>
      <span className="splash-c splash-c1" aria-hidden="true" />
      <span className="splash-c splash-c2" aria-hidden="true" />
      <span className="splash-c splash-c3" aria-hidden="true" />
      <span className="splash-c splash-c4" aria-hidden="true" />
      <span className="splash-c splash-c5" aria-hidden="true" />
      <span className="splash-text">{children}</span>
    </>
  );

  const baseClass = cn('splash-btn', className);

  if (href) {
    return <a href={href} className={baseClass} style={styleVar}>{inner}</a>;
  }
  return (
    <button type={type} onClick={onClick} className={baseClass} style={styleVar}>{inner}</button>
  );
}

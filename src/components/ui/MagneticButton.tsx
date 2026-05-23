import { useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Pull strength in pixels at edge of element (default 12) */
  strength?: number;
  ariaLabel?: string;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 12,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const tx = (x / rect.width) * strength * 2;
    const ty = (y / rect.height) * strength * 2;
    setTransform(`translate3d(${tx}px, ${ty}px, 0)`);
  }

  function handleMouseLeave() {
    setTransform('translate3d(0, 0, 0)');
  }

  const sharedProps = {
    ref: ref as React.RefObject<HTMLAnchorElement & HTMLButtonElement>,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: cn(
      'inline-flex items-center justify-center h-14 px-8 rounded-[var(--radius-full)] bg-[var(--color-ink)] text-[var(--color-ink-inverse)] font-medium tracking-tight transition-colors duration-300 ease-[var(--ease-out-quart)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)] will-change-transform',
      className,
    ),
    style: {
      transform,
      transition: transform === 'translate3d(0, 0, 0)' ? 'transform 600ms var(--ease-out-expo), background-color 300ms' : 'transform 200ms var(--ease-out-quart), background-color 300ms',
    } as CSSProperties,
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <a {...sharedProps} href={href}>
        <span className="pointer-events-none">{children}</span>
      </a>
    );
  }

  return (
    <button {...sharedProps} onClick={onClick} type="button">
      <span className="pointer-events-none">{children}</span>
    </button>
  );
}

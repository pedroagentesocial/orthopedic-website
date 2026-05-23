import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';

interface NumberTickerProps {
  value: number;
  /** ms */
  duration?: number;
  /** locale for number formatting (e.g. 'en-US', 'es-MX') */
  locale?: string;
  /** Intl.NumberFormat options */
  format?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts from 0 to `value` once it enters the viewport.
 * Uses requestAnimationFrame with ease-out-expo for natural deceleration.
 */
export default function NumberTicker({
  value,
  duration = 1800,
  locale = 'en-US',
  format,
  prefix = '',
  suffix = '',
  className,
}: NumberTickerProps) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });
  const [display, setDisplay] = useState(shouldReduceMotion ? value : 0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView || shouldReduceMotion) {
      if (shouldReduceMotion) setDisplay(value);
      return;
    }

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // ease-out-expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = Math.round(value * eased);
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [inView, value, duration, shouldReduceMotion]);

  const formatter = new Intl.NumberFormat(locale, format);
  const formatted = formatter.format(display);

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={cn('tabular-nums tracking-tight', className)}
      aria-label={`${prefix}${formatter.format(value)}${suffix}`}
    >
      <span aria-hidden="true">{prefix}{formatted}{suffix}</span>
    </span>
  );
}

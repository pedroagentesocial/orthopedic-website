import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  learnMoreLabel: string;
  className?: string;
}

/**
 * Service card inspired by ElSombrero2's "tricky-robin".
 * On hover: icon scales subtly, title shifts up, "learn more" reveal slides in,
 * card lifts with shadow.
 */
export default function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  learnMoreLabel,
  className,
}: ServiceCardProps) {
  return (
    <a
      href={href}
      className={cn(
        'group relative flex flex-col h-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-[var(--color-border-accent)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]',
        className,
      )}
    >
      {/* Top: icon */}
      <div className="relative flex items-center justify-center h-14 w-14 rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105">
        <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Middle: title + description */}
      <div className="mt-8 flex-1">
        <h3
          className="font-display text-2xl tracking-tight text-[var(--color-ink)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1"
          style={{ fontVariationSettings: '"opsz" 36' }}
        >
          {title}
        </h3>
        <p className="mt-3 text-[var(--color-ink-muted)] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom reveal: "learn more" slides in from below */}
      <div className="mt-6 overflow-hidden">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] translate-y-full opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100">
          <span>{learnMoreLabel}</span>
          <ArrowUpRight size={16} strokeWidth={1.75} />
        </div>
      </div>

      {/* Corner accent line — grows on hover */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-0 bg-[var(--color-accent)] transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:w-full"
      />
    </a>
  );
}

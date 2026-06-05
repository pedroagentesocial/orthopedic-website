import { useId, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';

interface AnimatedTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

/**
 * Textarea sibling of AnimatedInput, sharing the alexruix "jolly-emu-80" style.
 * Label above, faint ink-tinted bg, ink border on focus.
 */
const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
  function AnimatedTextarea(
    { label, hint, error, id: idProp, className, required, rows = 5, ...rest },
    ref,
  ) {
    const reactId = useId();
    const id = idProp ?? reactId;
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className={cn('w-full', className)}>
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-semibold text-[var(--color-ink-muted)]"
        >
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-[var(--color-accent)]">*</span>}
        </label>
        <textarea
          {...rest}
          ref={ref}
          id={id}
          required={required}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'jolly-emu-input',
            'block w-full px-4 py-3 rounded-[var(--radius-md)]',
            'text-base text-[var(--color-ink)] leading-relaxed',
            'bg-[rgb(6_32_86/0.04)]',
            'border-2 border-transparent outline-none resize-y min-h-[140px]',
            'placeholder:text-[var(--color-ink-subtle)]',
            error && '!border-[var(--color-danger)]',
          )}
        />
        {hint && !error && (
          <p id={hintId} className="mt-2 text-xs text-[var(--color-ink-subtle)]">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="mt-2 text-xs text-[var(--color-danger)]">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default AnimatedTextarea;

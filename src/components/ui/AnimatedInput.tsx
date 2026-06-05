import { useId, type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/**
 * Adapted from Uiverse's "jolly-emu-80" (by alexruix).
 * .jolly-emu-input styling lives in global.css.
 *
 * Original: https://uiverse.io/alexruix/jolly-emu-80
 */
const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  function AnimatedInput(
    { label, hint, error, id: idProp, className, required, ...rest },
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
        <input
          {...rest}
          ref={ref}
          id={id}
          required={required}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'jolly-emu-input',
            'block w-full h-12 px-4 rounded-[var(--radius-md)]',
            'text-base text-[var(--color-ink)]',
            'bg-[rgb(6_32_86/0.04)]',
            'border-2 border-transparent outline-none',
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

export default AnimatedInput;

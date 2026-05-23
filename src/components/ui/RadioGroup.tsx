import * as RadixRadio from '@radix-ui/react-radio-group';
import { useId } from 'react';
import { cn } from '../../lib/cn';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

/**
 * Sage-themed radio group. Used for "reason for contact" on the lead form.
 * Built on Radix RadioGroup for full keyboard/screen-reader accessibility.
 */
export default function RadioGroup({
  label,
  options,
  name,
  value,
  defaultValue,
  onValueChange,
  required,
  error,
  className,
}: RadioGroupProps) {
  const reactId = useId();
  const errorId = error ? `${reactId}-error` : undefined;

  return (
    <div className={cn('w-full', className)}>
      <p className="block text-xs uppercase tracking-wider text-[var(--color-ink-subtle)] mb-4">
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-[var(--color-accent)]">*</span>}
      </p>

      <RadixRadio.Root
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {options.map((option) => {
          const itemId = `${reactId}-${option.value}`;
          return (
            <RadixRadio.Item
              key={option.value}
              value={option.value}
              id={itemId}
              className="group flex items-center gap-3 px-5 py-4 rounded-(--radius-md) border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] text-left text-[var(--color-ink)] cursor-pointer transition-all duration-200 ease-[var(--ease-out-quart)] hover:border-[var(--color-accent)] data-[state=checked]:border-[var(--color-accent)] data-[state=checked]:bg-[var(--color-accent-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] transition-all duration-200 group-data-[state=checked]:border-[var(--color-accent)]">
                <RadixRadio.Indicator className="block h-2 w-2 rounded-full bg-[var(--color-accent)] transition-transform duration-200 ease-[var(--ease-out-expo)] data-[state=checked]:scale-100 data-[state=unchecked]:scale-0" />
              </span>
              <label htmlFor={itemId} className="cursor-pointer flex-1 text-sm leading-snug">
                {option.label}
              </label>
            </RadixRadio.Item>
          );
        })}
      </RadixRadio.Root>

      {error && (
        <p id={errorId} className="mt-3 text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}

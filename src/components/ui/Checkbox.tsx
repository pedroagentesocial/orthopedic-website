import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { useId } from 'react';
import { cn } from '../../lib/cn';

interface CheckboxProps {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

/**
 * Adapted from Uiverse's "green-donkey-82" (by WhiteNervosa).
 * Styles live in global.css (.gd-check .gd-shape .gd-tick).
 *
 * Original: https://uiverse.io/WhiteNervosa/green-donkey-82
 */
export default function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  name,
  required,
  id: idProp,
  className,
}: CheckboxProps) {
  const reactId = useId();
  const id = idProp ?? reactId;

  return (
    <div className={cn('flex gap-3 items-start', className)}>
      <RadixCheckbox.Root
        id={id}
        name={name}
        required={required}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(c) => onCheckedChange?.(c === true)}
        className="gd-check group relative inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center mt-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)] rounded-[2px]"
      >
        <RadixCheckbox.Indicator forceMount asChild>
          <svg width="22" height="22" viewBox="0 0 18 18" aria-hidden="true">
            <path
              className="gd-shape"
              d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"
            />
            <polyline className="gd-tick" points="1 9 7 14 15 4" />
          </svg>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-base text-[var(--color-ink)] leading-snug">
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-[var(--color-accent)]">*</span>}
        </span>
        {description && (
          <span className="block mt-1 text-sm text-[var(--color-ink-muted)] leading-relaxed">
            {description}
          </span>
        )}
      </label>
    </div>
  );
}

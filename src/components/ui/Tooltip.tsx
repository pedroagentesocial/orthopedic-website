import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../lib/cn';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

/**
 * Hover-for-info tooltip. Animation keyframes (tooltip-in/out) live in global.css.
 */
export default function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={100}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={8}
            className={cn(
              'z-50 max-w-xs px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-ink)] text-[var(--color-ink-inverse)] text-sm leading-relaxed shadow-[var(--shadow-md)]',
              'data-[state=delayed-open]:animate-tooltip-in',
              'data-[state=closed]:animate-tooltip-out',
              className,
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-[var(--color-ink)]" width={10} height={5} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

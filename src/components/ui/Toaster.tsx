import { Toaster as SonnerToaster } from 'sonner';

/**
 * Global toast provider. Mount once near the root.
 * Sage-themed, bottom-right on desktop, bottom-center on mobile.
 */
export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors={false}
      closeButton
      gap={12}
      offset={24}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            '!bg-[var(--color-ink)] !text-[var(--color-ink-inverse)] !border !border-[var(--color-ink)] !rounded-[var(--radius-md)] !shadow-[var(--shadow-md)] !font-sans',
          title: '!text-[var(--color-ink-inverse)] !font-medium',
          description: '!text-[var(--color-ink-inverse)]/70',
          actionButton: '!bg-[var(--color-accent)] !text-[var(--color-ink-inverse)]',
          cancelButton: '!bg-transparent !text-[var(--color-ink-inverse)]/70',
          success: '!border-l-2 !border-l-[var(--color-accent)]',
          error: '!border-l-2 !border-l-[var(--color-danger)]',
        },
        style: {
          fontSize: '0.9375rem',
        },
      }}
    />
  );
}

import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, XCircle, Phone } from 'lucide-react';

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export interface SubmitDialogStrings {
  successTitle: string;
  successDescription: string;
  successClose: string;
  errorTitle: string;
  errorDescription: string;
  errorDetailLabel: string;
  errorRetry: string;
  errorCall: string;
}

interface SubmitDialogProps {
  state: SubmitState;
  errorDetail?: string;
  strings: SubmitDialogStrings;
  onClose: () => void;
  onRetry: () => void;
}

/**
 * Modal that confirms the result of a form submission. Built on Radix Dialog
 * (focus trap, esc-to-close, scroll lock, accessible). Two states:
 *   - success: green check + "Close" button
 *   - error:   red X + technical detail + "Try again" + "Call instead"
 */
export default function SubmitDialog({
  state,
  errorDetail,
  strings,
  onClose,
  onRetry,
}: SubmitDialogProps) {
  const open = state === 'success' || state === 'error';

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sd-overlay" />
        <Dialog.Content className="sd-content" onEscapeKeyDown={onClose}>
          {state === 'success' && (
            <>
              <div className="sd-icon sd-icon--success">
                <CheckCircle2 size={32} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <Dialog.Title className="sd-title">{strings.successTitle}</Dialog.Title>
              <Dialog.Description className="sd-description">
                {strings.successDescription}
              </Dialog.Description>
              <div className="sd-actions">
                <button type="button" onClick={onClose} className="sd-btn sd-btn--primary">
                  {strings.successClose}
                </button>
              </div>
            </>
          )}

          {state === 'error' && (
            <>
              <div className="sd-icon sd-icon--error">
                <XCircle size={32} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <Dialog.Title className="sd-title">{strings.errorTitle}</Dialog.Title>
              <Dialog.Description className="sd-description">
                {strings.errorDescription}
              </Dialog.Description>
              {errorDetail && (
                <p className="sd-detail">
                  <span className="sd-detail-label">{strings.errorDetailLabel}:</span> {errorDetail}
                </p>
              )}
              <div className="sd-actions">
                <button type="button" onClick={onRetry} className="sd-btn sd-btn--primary">
                  {strings.errorRetry}
                </button>
                <a href="tel:+18015550100" className="sd-btn sd-btn--secondary">
                  <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                  {strings.errorCall}
                </a>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

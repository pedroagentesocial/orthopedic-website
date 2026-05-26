import { Send } from 'lucide-react';
import { cn } from '../../lib/cn';

interface FlySendButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Form submit button — adapted from Uiverse "Fly send" by adamgiebl.
 * On hover: paper plane icon flies up-right (translate + rotate + scale)
 * while text slides off to the right. Bobbing fly-y keyframe runs while
 * hovered. Recolored to our sage accent.
 *
 * Styles live in global.css (.fly-send, .fly-send__wrap).
 */
export default function FlySendButton({
  children,
  type = 'submit',
  disabled,
  onClick,
  className,
}: FlySendButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn('fly-send focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]', className)}
    >
      <div className="fly-send__wrap">
        <Send size={20} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <span>{children}</span>
    </button>
  );
}

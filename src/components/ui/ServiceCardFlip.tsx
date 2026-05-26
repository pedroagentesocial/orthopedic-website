import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ServiceCardFlipProps {
  image: string;
  title: string;
  description: string;
  href: string;
  learnMoreLabel: string;
  className?: string;
}

/**
 * Service flip card.
 *  - Desktop (pointer: fine): :hover flips the card via CSS only.
 *  - Touch (pointer: coarse): first tap flips, second tap navigates.
 *
 * Pointer-type is queried on the first click so we don't run any matchMedia
 * during SSR. The `tr-card--flipped` class drives the flip equivalently to
 * the :hover state.
 */
export default function ServiceCardFlip({
  image,
  title,
  description,
  href,
  learnMoreLabel,
  className,
}: ServiceCardFlipProps) {
  const [flipped, setFlipped] = useState(false);
  const isTouchRef = useRef<boolean | null>(null);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isTouchRef.current === null) {
      isTouchRef.current = window.matchMedia('(pointer: coarse)').matches;
    }
    // On touch: first tap flips, second tap (already flipped) navigates.
    if (isTouchRef.current && !flipped) {
      e.preventDefault();
      setFlipped(true);
    }
  }

  return (
    <a
      href={href}
      className={cn('tr-card group', flipped && 'tr-card--flipped', className)}
      aria-label={title}
      onClick={handleClick}
    >
      <div className="tr-content">
        {/* DEFAULT VISIBLE: image + title overlay */}
        <div className="tr-back">
          <img src={image} alt="" className="tr-image" loading="lazy" />
          <div className="tr-image-overlay">
            <h3
              className="tr-image-title"
              style={{ fontVariationSettings: '"opsz" 36' }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* ON HOVER / FLIPPED: description + CTA */}
        <div className="tr-front">
          <div className="tr-front-inner">
            <h3
              className="tr-back-title"
              style={{ fontVariationSettings: '"opsz" 36' }}
            >
              {title}
            </h3>
            <p className="tr-back-desc">{description}</p>
            <span className="tr-cta">
              {learnMoreLabel}
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

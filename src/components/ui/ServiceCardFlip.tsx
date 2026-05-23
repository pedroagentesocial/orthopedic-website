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
 * Front (default): full-bleed image with title overlay strip at bottom.
 * Back (on hover/focus): description + "Learn more" CTA on a sage panel.
 *
 * Pure CSS 3D flip — no client-side JS, no Astro hydration directive needed.
 * The image prop is a serializable string, so safe to render statically.
 *
 * Inspired by Uiverse's "tricky-robin-67" flip mechanic, adapted here for
 * the editorial cálido system (no gradients, sage accent, image-led front).
 */
export default function ServiceCardFlip({
  image,
  title,
  description,
  href,
  learnMoreLabel,
  className,
}: ServiceCardFlipProps) {
  return (
    <a href={href} className={cn('tr-card group', className)} aria-label={title}>
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

        {/* ON HOVER: description + CTA */}
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

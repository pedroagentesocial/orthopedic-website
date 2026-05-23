import { motion, useReducedMotion } from 'motion/react';
import { Phone } from 'lucide-react';
import SendButton from '../ui/SendButton';

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  scrollHint: string;
  /** Full-screen background image (also used as poster while video loads) */
  posterImage: string;
  /** Optional looping background video (mp4/webm). Falls back to poster if empty. */
  videoUrl?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({
  eyebrow,
  title,
  subtitle,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  scrollHint,
  posterImage,
  videoUrl,
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layer: video with poster image fallback */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterImage}
            aria-hidden="true"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={posterImage}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            aria-hidden="true"
          />
        )}
        {/* Dark overlay for text legibility — solid color, no gradient */}
        <div className="absolute inset-0 bg-[var(--color-ink)]/55" />
      </div>

      {/* Centered content */}
      <div className="relative z-10 container-page text-center text-[var(--color-ink-inverse)] py-24">
        <motion.p
          {...fadeUp(0)}
          className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-ink-inverse)]/80"
        >
          <span className="inline-block w-8 h-px bg-[var(--color-accent)]" aria-hidden />
          {eyebrow}
          <span className="inline-block w-8 h-px bg-[var(--color-accent)]" aria-hidden />
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className="mt-8 text-[var(--color-ink-inverse)] max-w-4xl mx-auto text-balance"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
        >
          {title}
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-8 text-xl md:text-2xl text-[var(--color-ink-inverse)]/85 max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <SendButton href={ctaPrimaryHref} loud large>
            {ctaPrimaryLabel}
          </SendButton>
          <a
            href={ctaSecondaryHref}
            className="inline-flex items-center gap-2 h-14 px-8 rounded-[var(--radius-md)] border border-[var(--color-ink-inverse)]/40 text-[var(--color-ink-inverse)] font-medium transition-colors duration-200 hover:bg-[var(--color-ink-inverse)]/10"
          >
            <Phone size={18} strokeWidth={1.75} />
            {ctaSecondaryLabel}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-[var(--color-ink-inverse)]/60"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-[0.25em]">{scrollHint}</span>
        <span className="relative block w-px h-12 bg-[var(--color-ink-inverse)]/30 overflow-hidden">
          <span className="hero-scroll-line absolute top-0 left-0 w-full h-1/3 bg-[var(--color-ink-inverse)]" />
        </span>
      </motion.div>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import SendButton from '../ui/SendButton';

export interface HeroSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  /** Background image (also used as poster while the video loads) */
  posterImage: string;
  /** Optional looping background video. Falls back to poster if empty. */
  videoUrl?: string;
}

interface HeroProps {
  slides: HeroSlide[];
  scrollHint: string;
  prevLabel: string;
  nextLabel: string;
  goToLabel: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 9000;

export default function Hero({ slides, scrollHint, prevLabel, nextLabel, goToLabel }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovering, setHovering] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  const goTo = useCallback(
    (next: number, dir?: number) => {
      const target = (next + count) % count;
      setDirection(dir ?? (target > index ? 1 : -1));
      setIndex(target);
    },
    [count, index],
  );

  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);

  // Play only the active slide's video; pause the rest to save battery/CPU.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) video.play().catch(() => {});
      else video.pause();
    });
  }, [index]);

  // Gentle auto-advance. Pauses on hover and is disabled for reduced motion.
  useEffect(() => {
    if (shouldReduceMotion || hovering || count < 2) return;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [goNext, hovering, shouldReduceMotion, count]);

  // Basic swipe support on touch devices.
  const onTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const fadeUp = (delay: number) => ({
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  });

  const slide = slides[index];
  const secondaryIsCall = slide.ctaSecondaryHref.startsWith('tel:');

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background layer: stacked videos cross-fading between slides */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            {s.videoUrl ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="w-full h-full object-cover"
                autoPlay={i === 0}
                muted
                loop
                playsInline
                preload={i === 0 ? 'metadata' : 'none'}
                poster={s.posterImage}
                aria-hidden="true"
              >
                <source src={s.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={s.posterImage}
                alt=""
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
        {/* Dark overlay for text legibility — solid color, no gradient */}
        <div className="absolute inset-0 bg-[var(--color-ink)]/55" />
      </div>

      {/* Centered content — re-mounts per slide with a direction-aware motion */}
      {/* pb-48 reserves room for the dots (bottom-32) + scroll hint, so long
          slides (e.g. Hand & Wrist) never overlap the controls */}
      <div className="relative z-10 container-page text-center text-[var(--color-ink-inverse)] pt-28 pb-48 px-14 sm:px-[var(--container-padding)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 64 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -64 }
            }
            transition={{ duration: 0.55, ease: EASE }}
          >
            <motion.p
              {...fadeUp(0)}
              className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-ink-inverse)]/80"
            >
              <span className="inline-block w-8 h-px bg-[var(--color-accent)]" aria-hidden />
              {slide.eyebrow}
              <span className="inline-block w-8 h-px bg-[var(--color-accent)]" aria-hidden />
            </motion.p>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-8 text-[var(--color-ink-inverse)] max-w-4xl mx-auto text-balance"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-8 text-xl md:text-2xl text-[var(--color-ink-inverse)]/85 max-w-2xl mx-auto leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              {...fadeUp(0.3)}
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <SendButton href={slide.ctaPrimaryHref} loud large>
                {slide.ctaPrimaryLabel}
              </SendButton>
              <a
                href={slide.ctaSecondaryHref}
                className="ghost-burst inline-flex items-center gap-2 h-14 px-8 rounded-[var(--radius-md)] border border-[var(--color-ink-inverse)]/40 text-[var(--color-ink-inverse)] font-medium"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {secondaryIsCall ? (
                    <Phone size={18} strokeWidth={1.75} />
                  ) : (
                    <ArrowUpRight size={18} strokeWidth={1.75} />
                  )}
                  {slide.ctaSecondaryLabel}
                </span>
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={goPrev}
        aria-label={prevLabel}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-full border border-[var(--color-ink-inverse)]/35 text-[var(--color-ink-inverse)]/80 backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-ink-inverse)]/80 hover:text-[var(--color-ink-inverse)] hover:bg-[rgb(252_253_253/0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink-inverse)] active:scale-95"
      >
        <ChevronLeft size={22} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label={nextLabel}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-full border border-[var(--color-ink-inverse)]/35 text-[var(--color-ink-inverse)]/80 backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-ink-inverse)]/80 hover:text-[var(--color-ink-inverse)] hover:bg-[rgb(252_253_253/0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink-inverse)] active:scale-95"
      >
        <ChevronRight size={22} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${goToLabel} ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink-inverse)] ${
              i === index
                ? 'w-8 bg-[var(--color-ink-inverse)]'
                : 'w-2.5 bg-[var(--color-ink-inverse)]/40 hover:bg-[var(--color-ink-inverse)]/70'
            }`}
          />
        ))}
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

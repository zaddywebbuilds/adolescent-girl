import { useEffect, useRef, useState, type ReactNode } from 'react';

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

export function Section({
  id,
  tone = 'cream',
  className,
  children,
}: {
  id?: string;
  tone?: 'cream' | 'white' | 'plum' | 'sage' | 'deep';
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    cream: 'bg-cream text-charcoal',
    white: 'bg-white text-charcoal',
    deep: 'bg-cream-deep text-charcoal',
    sage: 'bg-sage-soft text-charcoal',
    plum: 'bg-plum text-cream',
  } as const;
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-8 md:py-10', tones[tone], className)}
    >
      {children}
    </section>
  );
}

export function Shell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('shell', className)}>{children}</div>;
}

export function Eyebrow({
  children,
  tone = 'dark',
  className,
}: {
  children: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <p
      className={cn(
        'eyebrow',
        tone === 'dark' ? 'text-cta' : 'text-rose',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = 'dark',
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: 'dark' | 'light';
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : '',
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow tone={tone} className="mb-3">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          'text-[1.75rem] leading-tight sm:text-4xl md:text-[2.75rem]',
          tone === 'light' && 'text-cream',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-4 text-[1.0625rem] md:text-lg',
            tone === 'light' ? 'text-cream/80' : 'text-charcoal/75',
          )}
        >
          {intro}
        </p>
      )}
      <div
        className={cn('rule mt-5 h-px w-28', align === 'center' && 'mx-auto')}
        aria-hidden="true"
      />
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'onplum';
  full?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
};

export function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  full,
  className,
  type = 'button',
  disabled,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'btn',
    variant === 'primary' && 'btn-primary',
    variant === 'secondary' && 'btn-secondary',
    variant === 'onplum' && 'btn-onplum',
    full && 'w-full',
    disabled && 'pointer-events-none opacity-60',
    className,
  );

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

/**
 * Fades content in the first time it scrolls into view.
 * Server rendered markup starts visible, so the content is always present
 * for crawlers and for anyone with JavaScript disabled.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('transition-[opacity,transform] duration-700 ease-out', className)}
      style={
        enabled && !shown
          ? { opacity: 0, transform: 'translateY(18px)', transitionDelay: `${delay}ms` }
          : { opacity: 1, transform: 'none', transitionDelay: `${delay}ms` }
      }
    >
      {children}
    </div>
  );
}

/** Small decorative botanical sprig used as a section ornament. */
export function Sprig({
  className,
  tone = 'currentColor',
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke={tone}
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M32 60V12" />
      <path d="M32 24c0-6 5-11 11-11 0 6-5 11-11 11Z" />
      <path d="M32 24c0-6-5-11-11-11 0 6 5 11 11 11Z" />
      <path d="M32 38c0-6 5-11 11-11 0 6-5 11-11 11Z" />
      <path d="M32 38c0-6-5-11-11-11 0 6 5 11 11 11Z" />
      <path d="M32 12a6 6 0 0 1 6-6 6 6 0 0 1-6 6Z" />
    </svg>
  );
}

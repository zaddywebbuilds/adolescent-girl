/**
 * One consistent icon family for the "What she will learn" grid.
 * All icons share a 24 unit box, 1.5 stroke, round caps and no fills,
 * so they read as a set rather than a mixed icon library.
 */
import type { ReactElement } from 'react';
import type { LearnItem } from '../config/content';

type Props = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BodyIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21v-7" />
      <path d="M12 14c0-2.5 2-4.5 4.5-4.5C16.5 12 14.5 14 12 14Z" />
      <path d="M12 14c0-2.5-2-4.5-4.5-4.5C7.5 12 9.5 14 12 14Z" />
      <circle cx="12" cy="6" r="2.75" />
    </svg>
  );
}

function ConfidenceIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 13.9 8l4.6.4-3.5 3.1 1 4.5L12 13.6 8 16l1-4.5L5.5 8.4 10.1 8 12 3.5Z" />
      <path d="M7 20h10" />
    </svg>
  );
}

function SafetyIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3 5 5.8v5.4c0 4 2.9 7.6 7 8.8 4.1-1.2 7-4.8 7-8.8V5.8L12 3Z" />
      <path d="m9.2 11.8 2 2 3.6-3.8" />
    </svg>
  );
}

function FriendshipIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="8" cy="8.5" r="2.4" />
      <circle cx="16" cy="8.5" r="2.4" />
      <path d="M3.5 18.5c0-2.5 2-4.2 4.5-4.2s4.5 1.7 4.5 4.2" />
      <path d="M13.2 14.6c.8-.2 1.8-.3 2.8-.3 2.5 0 4.5 1.7 4.5 4.2" />
    </svg>
  );
}

function HygieneIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5c2.7 3.2 4.3 5.6 4.3 7.8A4.3 4.3 0 0 1 12 15.6a4.3 4.3 0 0 1-4.3-4.3c0-2.2 1.6-4.6 4.3-7.8Z" />
      <path d="M12 20.5v-2.6" />
      <path d="M12 17.9c1.8 0 3.2-1.3 3.4-3-1.9-.2-3.2 1.1-3.4 3Z" />
    </svg>
  );
}

function FutureIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4 3 8l9 4 9-4-9-4Z" />
      <path d="M6.5 10.2v4.3c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.3" />
      <path d="M21 8v5" />
    </svg>
  );
}

const map: Record<LearnItem['icon'], (p: Props) => ReactElement> = {
  body: BodyIcon,
  confidence: ConfidenceIcon,
  safety: SafetyIcon,
  friendship: FriendshipIcon,
  hygiene: HygieneIcon,
  future: FutureIcon,
};

export function LearnIcon({
  name,
  className,
}: {
  name: LearnItem['icon'];
  className?: string;
}) {
  const Cmp = map[name];
  return <Cmp className={className} />;
}

/** Brand wordmark: a small sprig beside the name. */
export function Wordmark({ className }: Props) {
  return (
    <span className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden="true"
        className="inline-block h-5 w-5 align-[-3px] text-gold"
      >
        <path d="M12 21V7" />
        <path d="M12 13c0-3 2.4-5.4 5.4-5.4C17.4 10.6 15 13 12 13Z" />
        <path d="M12 16c0-3-2.4-5.4-5.4-5.4C6.6 13.6 9 16 12 16Z" />
        <circle cx="12" cy="4.6" r="1.6" />
      </svg>
    </span>
  );
}

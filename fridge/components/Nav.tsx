'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  {
    href: '/home',
    label: 'Home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'History',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    href: '/leaderboard',
    label: 'Ranks',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <rect x="2" y="14" width="5" height="7" rx="1" />
        <rect x="9.5" y="9" width="5" height="12" rx="1" />
        <rect x="17" y="4" width="5" height="17" rx="1" />
      </svg>
    ),
  },
  {
    href: '/rewards',
    label: 'Rewards',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/96 backdrop-blur-xl border-t border-divider flex lg:hidden z-50">
      {LINKS.map(({ href, label, icon }) => {
        const active = path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center pt-2.5 pb-5 gap-1 relative"
          >
            {/* Active indicator dot at top */}
            <span
              className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-200 ${
                active ? 'w-5 h-[3px] bg-primary' : 'w-0 h-[3px]'
              }`}
            />
            <span className={`transition-colors duration-150 ${active ? 'text-primary' : 'text-text-faint'}`}>
              {icon(active)}
            </span>
            <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-150 ${active ? 'text-primary' : 'text-text-faint'}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden lg:flex flex-col items-center w-16 bg-surface border-r border-border min-h-screen py-5 gap-1 fixed left-0 top-0 z-50">
      {/* Logo mark */}
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-5 shrink-0"
        style={{ background: 'linear-gradient(135deg, #1B6B45 0%, #2E9060 100%)' }}
      >
        <span
          className="text-white font-extrabold text-sm"
          style={{ fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: '-0.01em' }}
        >
          FW
        </span>
      </div>

      {LINKS.map(({ href, label, icon }) => {
        const active = path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={`group relative flex items-center justify-center w-10 h-10 rounded-[10px] transition-all duration-150 ${
              active
                ? 'bg-primary-light text-primary'
                : 'text-text-muted hover:bg-bg hover:text-text'
            }`}
          >
            {/* Left edge indicator */}
            {active && (
              <span className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
            )}
            {icon(active)}
            {/* Tooltip */}
            <span className="absolute left-14 bg-text text-white text-xs font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-card-md">
              {label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}

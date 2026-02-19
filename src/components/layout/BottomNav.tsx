'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/app',
    label: 'Accueil',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
    iconFilled: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    href: '/app/resources',
    label: 'Actualités',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    iconFilled: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: '/app/club',
    label: 'Le Club',
    icon: <img src="/bdl_logo_short.png" alt="Le Club" width={20} height={20} style={{ display: 'block', filter: 'brightness(0)', opacity: 0.36 }} />,
    iconFilled: <img src="/bdl_logo_short.png" alt="Le Club" width={20} height={20} style={{ display: 'block', filter: 'brightness(0)' }} />,
  },
  {
    href: '/app/profile',
    label: 'Mon compte',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    iconFilled: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app'
    return pathname.startsWith(href)
  }

  const activeIndex = navItems.findIndex((item) => isActive(item.href))

  return (
    <div
      className="fixed left-0 right-0 z-50 flex justify-center px-6"
      style={{ bottom: 'max(28px, env(safe-area-inset-bottom, 28px))' }}
    >
      <nav
        className="relative flex items-center w-full max-w-sm rounded-full overflow-hidden"
        style={{
          height: 64,
          background: 'rgba(255, 255, 255, 0.22)',
          backdropFilter: 'blur(56px) saturate(210%) brightness(1.08)',
          WebkitBackdropFilter: 'blur(56px) saturate(210%) brightness(1.08)',
          boxShadow: [
            '0 0 0 1px rgba(255,255,255,0.6)',
            '0 0 0 1.5px rgba(7,2,49,0.06)',
            'inset 0 1.5px 0 rgba(255,255,255,0.95)',
            'inset 0 -1px 0 rgba(255,255,255,0.25)',
            '0 20px 52px rgba(7,2,49,0.18)',
            '0 4px 14px rgba(7,2,49,0.09)',
          ].join(', '),
        }}
      >
        {/* Top specular sheen */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: '45%',
            borderRadius: '999px 999px 0 0',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* Sliding glass bubble — single element that translates */}
        {activeIndex >= 0 && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              width: `${100 / navItems.length}%`,
              transform: `translateX(${activeIndex * 100}%)`,
              transition: 'transform 600ms cubic-bezier(0.25, 1.4, 0.5, 1)',
              padding: '7px 8px',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: [
                  'inset 0 1.5px 0 rgba(255,255,255,1)',
                  'inset 0 -1px 0 rgba(255,255,255,0.5)',
                  'inset 1px 0 0 rgba(255,255,255,0.4)',
                  'inset -1px 0 0 rgba(255,255,255,0.4)',
                  '0 3px 10px rgba(7,2,49,0.1)',
                ].join(', '),
              }}
            />
          </div>
        )}

        {/* Nav items */}
        {navItems.map((item, i) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative z-10 flex flex-col items-center justify-center flex-1 h-full"
              style={{ gap: 2 }}
            >
              <span
                style={{
                  color: active ? '#0B034D' : 'rgba(11,3,77,0.36)',
                  transition: 'color 300ms ease, transform 300ms cubic-bezier(0.25,1.4,0.5,1)',
                  transform: active ? 'translateY(-1px) scale(1.06)' : 'scale(1)',
                  display: 'block',
                }}
              >
                {active ? item.iconFilled : item.icon}
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: active ? '#0B034D' : 'rgba(11,3,77,0.3)',
                  transition: 'color 300ms ease, transform 300ms cubic-bezier(0.25,1.4,0.5,1)',
                  transform: active ? 'translateY(-1px)' : 'none',
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

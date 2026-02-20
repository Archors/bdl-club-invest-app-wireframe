'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/app',
    label: 'Accueil',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M10 18H14M16.1804 22H7.81965C5.5109 22 3.6393 20.214 3.6393 18.0108V13.133C3.6393 12.4248 3.34447 11.7456 2.81969 11.2448C1.60381 10.0845 1.76187 8.16205 3.15251 7.19692L9.54124 2.763C11.0071 1.74567 12.9929 1.74567 14.4588 2.763L20.8475 7.19691C22.2381 8.16205 22.3962 10.0845 21.1803 11.2448C20.6555 11.7456 20.3607 12.4248 20.3607 13.133V18.0108C20.3607 20.214 18.4891 22 16.1804 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    iconFilled: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.1804 22H7.81965C5.5109 22 3.6393 20.214 3.6393 18.0108V13.133C3.6393 12.4248 3.34447 11.7456 2.81969 11.2448C1.60381 10.0845 1.76187 8.16205 3.15251 7.19692L9.54124 2.763C11.0071 1.74567 12.9929 1.74567 14.4588 2.763L20.8475 7.19691C22.2381 8.16205 22.3962 10.0845 21.1803 11.2448C20.6555 11.7456 20.3607 12.4248 20.3607 13.133V18.0108C20.3607 20.214 18.4891 22 16.1804 22ZM10 17.25C9.58579 17.25 9.25 17.5858 9.25 18C9.25 18.4142 9.58579 18.75 10 18.75H14C14.4142 18.75 14.75 18.4142 14.75 18C14.75 17.5858 14.4142 17.25 14 17.25H10Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: '/app/resources',
    label: 'Actualités',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M8 7H12M8 11H16M8 15H16M5 2H19C20.1046 2 21 2.89543 21 4V19.1543C21 20.5396 19.6259 21.5053 18.3226 21.0361L16.7608 20.4739C16.2728 20.2982 15.7356 20.319 15.2626 20.5318L12.8207 21.6307C12.2988 21.8655 11.7012 21.8655 11.1793 21.6307L8.73737 20.5318C8.26439 20.319 7.72721 20.2982 7.2392 20.4739L5.67744 21.0361C4.37412 21.5053 3 20.5396 3 19.1543V4C3 2.89543 3.89543 2 5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    iconFilled: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 2H19C20.1046 2 21 2.89543 21 4V19.1543C21 20.5396 19.6259 21.5053 18.3226 21.0361L16.7608 20.4739C16.2728 20.2982 15.7356 20.319 15.2626 20.5318L12.8207 21.6307C12.2988 21.8655 11.7012 21.8655 11.1793 21.6307L8.73737 20.5318C8.26439 20.319 7.72721 20.2982 7.2392 20.4739L5.67744 21.0361C4.37412 21.5053 3 20.5396 3 19.1543V4C3 2.89543 3.89543 2 5 2ZM8 6.25C7.58579 6.25 7.25 6.58579 7.25 7C7.25 7.41421 7.58579 7.75 8 7.75H12C12.4142 7.75 12.75 7.41421 12.75 7C12.75 6.58579 12.4142 6.25 12 6.25H8ZM8 10.25C7.58579 10.25 7.25 10.5858 7.25 11C7.25 11.4142 7.58579 11.75 8 11.75H16C16.4142 11.75 16.75 11.4142 16.75 11C16.75 10.5858 16.4142 10.25 16 10.25H8ZM8 14.25C7.58579 14.25 7.25 14.5858 7.25 15C7.25 15.4142 7.58579 15.75 8 15.75H16C16.4142 15.75 16.75 15.4142 16.75 15C16.75 14.5858 16.4142 14.25 16 14.25H8Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: '/app/profile',
    label: 'Mon compte',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M18.9989 21.8743C20.7247 21.4306 22 19.8642 22 18V6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 19.8642 3.27532 21.4306 5.00111 21.8743M18.9989 21.8743C18.6796 21.9563 18.3449 22 18 22H6C5.6551 22 5.32039 21.9563 5.00111 21.8743M18.9989 21.8743C18.9318 18.0663 15.824 15 12 15C8.17601 15 5.06818 18.0663 5.00111 21.8743M15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9Z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    iconFilled: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 2H6C3.79086 2 2 3.79086 2 6V18C2 19.8642 3.27532 21.4306 5.00111 21.8743C5.32039 21.9563 5.6551 22 6 22H18C18.3449 22 18.6796 21.9563 18.9989 21.8743C20.7247 21.4306 22 19.8642 22 18V6C22 3.79086 20.2091 2 18 2ZM12 13C14.4617 13 16.5783 14.6062 17.5115 16.9071C17.9491 17.986 17.0067 19 15.8425 19H8.15752C6.99332 19 6.05092 17.986 6.48849 16.9071C7.42174 14.6062 9.53834 13 12 13ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5Z" fill="currentColor"/>
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
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

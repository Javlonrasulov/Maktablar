import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  LayoutDashboard,
  Map,
  MoreHorizontal,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileItems = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard },
  { to: '/schools', key: 'schools', icon: Building2 },
  { to: '/teachers', key: 'teachers', icon: Users },
  { to: '/map', key: 'map', icon: Map },
] as const

interface BottomNavProps {
  onMore: () => void
}

export function BottomNav({ onMore }: BottomNavProps) {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <nav className="glass-strong fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-[22px] px-2 py-2 safe-bottom lg:hidden">
      {mobileItems.map((item) => {
        const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-[16px] px-2 text-[10px] transition',
              active ? 'bg-accent/15 text-accent active-glow' : 'text-text-muted',
            )}
          >
            <Icon size={20} strokeWidth={1.6} />
            <span>{t(`nav.${item.key}`)}</span>
          </NavLink>
        )
      })}
      <button
        type="button"
        onClick={onMore}
        className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-[16px] px-2 text-[10px] text-text-muted"
      >
        <MoreHorizontal size={20} strokeWidth={1.6} />
        <span>{t('nav.menu')}</span>
      </button>
    </nav>
  )
}

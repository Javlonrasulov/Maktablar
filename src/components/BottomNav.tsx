import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  LayoutDashboard,
  Map,
  MoreHorizontal,
  School,
  Users,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const adminMobile = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard },
  { to: '/schools', key: 'schools', icon: Building2 },
  { to: '/teachers', key: 'teachers', icon: Users },
  { to: '/map', key: 'map', icon: Map },
] as const

const schoolMobile = [
  { to: '/my-school', key: 'mySchool', icon: School },
] as const

interface BottomNavProps {
  onMore: () => void
}

export function BottomNav({ onMore }: BottomNavProps) {
  const { t } = useTranslation()
  const { isSchool } = useAuth()
  const location = useLocation()
  const mobileItems = isSchool ? schoolMobile : adminMobile

  return (
    <nav className="glass-strong fixed inset-x-3 bottom-3 z-40 flex items-center justify-around gap-0.5 rounded-[22px] px-1.5 py-2 safe-bottom lg:hidden">
      {mobileItems.map((item) => {
        const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[16px] px-1 text-[9px] leading-tight transition sm:text-[10px]',
              active ? 'bg-accent/15 text-accent active-glow' : 'text-text-muted',
            )}
          >
            <Icon size={20} strokeWidth={1.6} className="shrink-0" />
            <span className="max-w-full truncate text-center">{t(`nav.${item.key}`)}</span>
          </NavLink>
        )
      })}
      <button
        type="button"
        onClick={onMore}
        className="flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[16px] px-1 text-[9px] leading-tight text-text-muted sm:text-[10px]"
      >
        <MoreHorizontal size={20} strokeWidth={1.6} className="shrink-0" />
        <span className="max-w-full truncate text-center">{t('nav.menu')}</span>
      </button>
    </nav>
  )
}

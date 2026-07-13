import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BarChart3,
  BookOpen,
  Building2,
  FileSpreadsheet,
  LayoutDashboard,
  Map,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const mainNav = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard },
  { to: '/schools', key: 'schools', icon: Building2 },
  { to: '/teachers', key: 'teachers', icon: Users },
  { to: '/subjects', key: 'subjects', icon: BookOpen },
  { to: '/workload', key: 'workload', icon: BarChart3 },
  { to: '/map', key: 'map', icon: Map },
  { to: '/reports', key: 'reports', icon: FileSpreadsheet },
  { to: '/settings', key: 'settings', icon: Settings },
] as const

export function useNavItems() {
  const { t } = useTranslation()
  return mainNav.map((item) => ({
    ...item,
    label: t(`nav.${item.key}`),
  }))
}

export function NavItemLink({
  to,
  label,
  icon: Icon,
  collapsed,
  onNavigate,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const location = useLocation()
  const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={cn(
        'group relative flex min-h-11 items-center gap-3 rounded-[18px] px-3 py-2.5 text-sm transition-all duration-300',
        active
          ? 'active-glow bg-accent/15 text-accent'
          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon
        size={20}
        strokeWidth={1.6}
        className={cn('shrink-0 transition-transform duration-300 group-hover:scale-110', active && 'drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]')}
      />
      {!collapsed ? <span className="truncate font-medium">{label}</span> : null}
    </NavLink>
  )
}

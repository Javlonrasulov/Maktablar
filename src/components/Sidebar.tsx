import { motion } from 'framer-motion'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GlassButton } from '@/design-system'
import { cn } from '@/lib/utils'
import { NavItemLink, useNavItems } from './navConfig'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const items = useNavItems()

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 260 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="glass-strong sticky top-[88px] hidden h-[calc(100svh-104px)] shrink-0 flex-col rounded-[22px] p-3 lg:flex"
    >
      <div className={cn('mb-3 flex items-center', collapsed ? 'justify-center' : 'justify-between px-2')}>
        {!collapsed ? (
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            {t('nav.menu')}
          </p>
        ) : null}
        <GlassButton
          variant="ghost"
          size="sm"
          icon={collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          onClick={onToggle}
          aria-label="Toggle sidebar"
        />
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-auto">
        {items.map((item) => (
          <NavItemLink
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </motion.aside>
  )
}

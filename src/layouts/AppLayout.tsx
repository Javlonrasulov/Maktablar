import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { GlassDrawer } from '@/design-system'
import { notifications as seedNotifications } from '@/services/mockApi'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { BottomNav } from '@/components/BottomNav'
import { GlobalSearch } from '@/components/GlobalSearch'
import { NotificationCenter } from '@/components/NotificationCenter'
import { NavItemLink, useNavItems } from '@/components/navConfig'

export function AppLayout() {
  const location = useLocation()
  const { t } = useTranslation()
  const navItems = useNavItems()
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { data: notifications = seedNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => seedNotifications,
  })

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="app-atmosphere min-h-svh pb-24 lg:pb-6">
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNotifications={() => setNotifOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
        unread={unread}
      />

      <div className="mx-auto flex max-w-[1800px] gap-4 px-3 pt-4 md:px-5">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav onMore={() => setMenuOpen(true)} />

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationCenter
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        items={notifications}
      />

      <GlassDrawer open={menuOpen} onClose={() => setMenuOpen(false)} title={t('nav.menu')} side="left">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItemLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onNavigate={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      </GlassDrawer>
    </div>
  )
}

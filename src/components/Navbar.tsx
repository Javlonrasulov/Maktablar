import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassButton } from '@/design-system'
import { languages, setAppLanguage, type AppLanguage } from '@/i18n'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { useNavItems, NavItemLink } from './navConfig'

interface NavbarProps {
  onOpenSearch: () => void
  onOpenNotifications: () => void
  onOpenMenu: () => void
  unread: number
}

export function Navbar({
  onOpenSearch,
  onOpenNotifications,
  onOpenMenu,
  unread,
}: NavbarProps) {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const items = useNavItems().slice(0, 5)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenSearch])

  return (
    <div className="sticky top-0 z-40 w-full px-3 pt-3 md:px-5 md:pt-4 xl:px-6">
      <motion.header
        animate={{
          scale: scrolled ? 0.995 : 1,
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ duration: 0.25 }}
        className={cn(
          'glass-strong flex w-full items-center gap-3 rounded-[22px] px-3 md:px-5',
          scrolled && 'shadow-[0_16px_40px_rgba(0,0,0,0.25)]',
        )}
      >
        <GlassButton
          variant="ghost"
          size="sm"
          className="lg:hidden"
          icon={<Menu size={20} />}
          onClick={onOpenMenu}
          aria-label={t('nav.menu')}
        />

        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 ring-1 ring-accent/30">
            <span className="font-display text-sm font-bold text-accent">NE</span>
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate font-display text-sm font-semibold text-text-primary text-glow md:text-base">
              {t('brand.name')}
            </p>
            <p className="truncate text-xs text-text-muted">{t('brand.subtitle')}</p>
          </div>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 xl:flex">
          {items.map((item) => (
            <NavItemLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <GlassButton
            variant="glass"
            size="sm"
            className="hidden sm:inline-flex"
            icon={<Search size={16} />}
            onClick={onOpenSearch}
          >
            <span className="hidden md:inline">{t('nav.search')}</span>
            <kbd className="ml-1 hidden rounded-md bg-fill-strong px-1.5 py-0.5 text-[10px] text-text-muted lg:inline">
              ⌘K
            </kbd>
          </GlassButton>
          <GlassButton
            variant="ghost"
            size="sm"
            className="sm:hidden"
            icon={<Search size={18} />}
            onClick={onOpenSearch}
            aria-label={t('nav.search')}
          />

          <GlassButton
            variant="ghost"
            size="sm"
            icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            onClick={toggleTheme}
            aria-label={t('common.theme')}
            title={theme === 'dark' ? t('common.themeLight') : t('common.themeDark')}
          />

          <div className="relative">
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<Bell size={18} />}
              onClick={onOpenNotifications}
              aria-label={t('nav.notifications')}
            />
            {unread > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            ) : null}
          </div>

          <select
            aria-label={t('common.language')}
            className="h-9 max-w-[120px] rounded-[16px] border border-line bg-fill px-2 text-xs text-text-secondary outline-none md:max-w-none"
            value={i18n.language}
            onChange={(e) => setAppLanguage(e.target.value as AppLanguage)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-bg-base text-text-primary">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </motion.header>
    </div>
  )
}

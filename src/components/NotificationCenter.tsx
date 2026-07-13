import { useTranslation } from 'react-i18next'
import { GlassDrawer } from '@/design-system'
import type { NotificationItem } from '@/services/types'

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
  items: NotificationItem[]
}

export function NotificationCenter({ open, onClose, items }: NotificationCenterProps) {
  const { t } = useTranslation()

  return (
    <GlassDrawer open={open} onClose={onClose} title={t('notifications.title')} side="right">
      {items.length === 0 ? (
        <p className="text-sm text-text-muted">{t('notifications.empty')}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-[18px] border border-white/10 bg-white/5 p-3 ${item.read ? 'opacity-70' : ''}`}
            >
              <p className="text-sm text-text-primary">
                {t(item.messageKey, { school: item.schoolNumber })}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </GlassDrawer>
  )
}

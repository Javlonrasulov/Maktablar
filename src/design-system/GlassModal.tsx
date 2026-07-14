import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { GlassButton } from './GlassButton'

interface GlassModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function GlassModal({ open, onClose, title, children, footer, className }: GlassModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-3 pb-[5.5rem] sm:items-center sm:p-6 sm:pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className={cn(
              'glass-strong relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-[22px]',
              'max-h-[min(85vh,calc(100svh-7rem))] sm:max-h-[85vh]',
              className,
            )}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
              {title ? <h2 className="font-display text-lg text-text-primary">{title}</h2> : <span />}
              <GlassButton variant="ghost" size="sm" icon={<X size={18} />} onClick={onClose} aria-label="Close" />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">{children}</div>
            {footer ? (
              <div className="shrink-0 border-t border-line bg-fill/40 px-5 py-3 sm:px-6 sm:py-4">
                {footer}
              </div>
            ) : (
              <div className="shrink-0 pb-5 sm:pb-6" />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

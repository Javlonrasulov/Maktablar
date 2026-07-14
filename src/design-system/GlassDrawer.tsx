import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { GlassButton } from './GlassButton'

interface GlassDrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'left' | 'right' | 'bottom'
}

export function GlassDrawer({
  open,
  onClose,
  title,
  children,
  side = 'bottom',
}: GlassDrawerProps) {
  const isBottom = side === 'bottom'
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
          <motion.aside
            initial={
              isBottom
                ? { y: '100%' }
                : side === 'left'
                  ? { x: '-100%' }
                  : { x: '100%' }
            }
            animate={isBottom ? { y: 0 } : { x: 0 }}
            exit={
              isBottom
                ? { y: '100%' }
                : side === 'left'
                  ? { x: '-100%' }
                  : { x: '100%' }
            }
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={cn(
              'glass-strong absolute flex flex-col safe-bottom',
              isBottom && 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-[22px] p-5',
              side === 'left' &&
                'inset-y-0 left-0 h-svh max-h-svh w-[min(88vw,320px)] rounded-r-[22px] p-5',
              side === 'right' &&
                'inset-y-0 right-0 h-svh max-h-svh w-[min(88vw,360px)] rounded-l-[22px] p-5',
            )}
          >
            <div className="mb-4 flex shrink-0 items-center justify-between">
              {title ? <h2 className="font-display text-lg">{title}</h2> : <span />}
              <GlassButton variant="ghost" size="sm" icon={<X size={18} />} onClick={onClose} />
            </div>
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-1">{children}</div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

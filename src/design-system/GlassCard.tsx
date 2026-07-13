import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  className?: string
  asMotion?: boolean
}

export function GlassCard({
  children,
  hover = true,
  className,
  asMotion = true,
  ...props
}: GlassCardProps) {
  const classes = cn(
    'glass rounded-[22px] p-5 md:p-6',
    hover && 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)]',
    className,
  )

  if (asMotion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={classes}
        {...(props as object)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

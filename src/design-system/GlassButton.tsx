import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'glass' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type GlassButtonProps = HTMLMotionProps<'button'> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent/90 text-bg-deep hover:bg-accent shadow-[0_0_24px_rgba(56,189,248,0.35)] border-transparent',
  ghost: 'bg-transparent hover:bg-white/5 border-transparent text-text-secondary hover:text-text-primary',
  glass: 'glass text-text-primary hover:bg-white/10',
  danger: 'bg-danger/20 text-danger border-danger/30 hover:bg-danger/30',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2 min-w-[44px]',
  lg: 'h-12 px-5 text-base gap-2',
}

export function GlassButton({
  variant = 'glass',
  size = 'md',
  icon,
  children,
  className,
  type = 'button',
  ...props
}: GlassButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-[22px] border font-medium transition-colors disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  )
}

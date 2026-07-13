import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, locale = 'uz-Cyrl-UZ') {
  return new Intl.NumberFormat(locale).format(value)
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

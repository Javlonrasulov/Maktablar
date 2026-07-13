import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, locale = 'uz-Cyrl-UZ') {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatHours(value: number, hoursLabel: string) {
  return `${formatNumber(value)} ${hoursLabel}`
}

/** Maps workload intensity 0..1 across a multi-stop cool→hot palette (many hues). */
export function hoursHeatColor(t: number): string {
  const stops = [
    [13, 148, 136], // teal
    [16, 185, 129], // emerald
    [34, 197, 94], // green
    [132, 204, 22], // lime
    [202, 138, 4], // yellow
    [245, 158, 11], // amber
    [249, 115, 22], // orange
    [239, 68, 68], // red
    [220, 38, 38], // red-600
    [185, 28, 28], // red-700
    [153, 27, 27], // red-800
    [127, 29, 29], // red-900
  ] as const

  const clamped = Math.min(1, Math.max(0, t))
  const scaled = clamped * (stops.length - 1)
  const i = Math.floor(scaled)
  const f = scaled - i
  const a = stops[i]
  const b = stops[Math.min(i + 1, stops.length - 1)]
  const r = Math.round(a[0] + (b[0] - a[0]) * f)
  const g = Math.round(a[1] + (b[1] - a[1]) * f)
  const bl = Math.round(a[2] + (b[2] - a[2]) * f)
  return `rgb(${r}, ${g}, ${bl})`
}

export function hoursHeatTone(hours: number, min: number, max: number) {
  if (!Number.isFinite(hours) || max <= min) return 0.5
  return (hours - min) / (max - min)
}

export function hoursVsAveragePct(hours: number, average: number) {
  if (!average) return 0
  return Math.round(((hours - average) / average) * 100)
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

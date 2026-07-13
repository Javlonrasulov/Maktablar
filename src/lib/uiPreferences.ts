import {
  DEFAULT_TEXT_COLOR,
  getTextColorOption,
  normalizeTextColor,
  type TextColorId,
} from '@/constants/textColors'

const FONT_SIZE_STORAGE = 'navbahor-font-size'
const TEXT_COLOR_STORAGE = 'navbahor-text-color'

export const FONT_SIZES = ['sm', 'md', 'lg', 'xl'] as const
export type FontSize = (typeof FONT_SIZES)[number]
export const DEFAULT_FONT_SIZE: FontSize = 'md'

export const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: '13px',
  md: '15px',
  lg: '17px',
  xl: '19px',
}

export function normalizeFontSize(size: string): FontSize {
  return FONT_SIZES.includes(size as FontSize) ? (size as FontSize) : DEFAULT_FONT_SIZE
}

export function readStoredFontSize(): FontSize {
  try {
    const stored = localStorage.getItem(FONT_SIZE_STORAGE)
    if (stored) return normalizeFontSize(stored)
  } catch {
    // ignore
  }
  return DEFAULT_FONT_SIZE
}

export function saveFontSize(size: FontSize) {
  try {
    localStorage.setItem(FONT_SIZE_STORAGE, normalizeFontSize(size))
  } catch {
    // ignore
  }
}

export function applyFontSize(size: FontSize | string) {
  const normalized = normalizeFontSize(size)
  const px = FONT_SIZE_MAP[normalized]
  document.documentElement.style.setProperty('--app-font-size', px)
  document.documentElement.style.fontSize = px
  document.documentElement.dataset.fontSize = normalized
}

export function readStoredTextColor(): TextColorId {
  try {
    const stored = localStorage.getItem(TEXT_COLOR_STORAGE)
    if (stored) return normalizeTextColor(stored)
  } catch {
    // ignore
  }
  return DEFAULT_TEXT_COLOR
}

export function saveTextColor(id: TextColorId) {
  try {
    localStorage.setItem(TEXT_COLOR_STORAGE, normalizeTextColor(id))
  } catch {
    // ignore
  }
}

export function applyTextColor(id: string, isDark: boolean) {
  const colorId = normalizeTextColor(id)
  const option = getTextColorOption(colorId)
  const root = document.documentElement

  root.dataset.textColor = colorId
  root.classList.toggle('text-color-override', colorId !== DEFAULT_TEXT_COLOR)

  if (colorId === DEFAULT_TEXT_COLOR || !option.light) {
    root.style.removeProperty('--theme-text-primary')
    root.style.removeProperty('--theme-text-secondary')
    root.style.removeProperty('--theme-text-muted')
    return
  }

  const color = isDark ? option.dark : option.light
  if (!color) return
  root.style.setProperty('--theme-text-primary', color)
  root.style.setProperty('--theme-text-secondary', color)
  root.style.setProperty('--theme-text-muted', color)
}

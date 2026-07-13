import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { TextColorId } from '@/constants/textColors'
import { useTheme } from '@/hooks/useTheme'
import {
  applyFontSize,
  applyTextColor,
  DEFAULT_FONT_SIZE,
  normalizeFontSize,
  readStoredFontSize,
  readStoredTextColor,
  saveFontSize,
  saveTextColor,
  type FontSize,
} from '@/lib/uiPreferences'

interface UiPreferencesValue {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  textColor: TextColorId
  setTextColor: (id: TextColorId) => void
}

const UiPreferencesContext = createContext<UiPreferencesValue | null>(null)

export function UiPreferencesProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const initial = readStoredFontSize()
    applyFontSize(initial)
    return initial
  })
  const [textColor, setTextColorState] = useState<TextColorId>(() => {
    const initial = readStoredTextColor()
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    applyTextColor(initial, isDark)
    return initial
  })

  useEffect(() => {
    applyFontSize(fontSize)
    saveFontSize(fontSize)
  }, [fontSize])

  useEffect(() => {
    applyTextColor(textColor, theme === 'dark')
    saveTextColor(textColor)
  }, [textColor, theme])

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(normalizeFontSize(size))
  }, [])

  const setTextColor = useCallback((id: TextColorId) => {
    setTextColorState(id)
  }, [])

  const value = useMemo(
    () => ({ fontSize, setFontSize, textColor, setTextColor }),
    [fontSize, setFontSize, textColor, setTextColor],
  )

  return (
    <UiPreferencesContext.Provider value={value}>{children}</UiPreferencesContext.Provider>
  )
}

export function useUiPreferences() {
  const ctx = useContext(UiPreferencesContext)
  if (!ctx) throw new Error('useUiPreferences must be used within UiPreferencesProvider')
  return ctx
}

export { DEFAULT_FONT_SIZE }

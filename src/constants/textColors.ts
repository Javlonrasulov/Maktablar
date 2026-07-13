/** Matn rangi palitrasi — light/dark rejim uchun o‘qiladigan juftliklar */
export const TEXT_COLOR_OPTIONS = [
  {
    id: 'default',
    light: null,
    dark: null,
    swatch: 'linear-gradient(135deg, #64748b 0%, #0f172a 100%)',
  },
  {
    id: 'black',
    light: '#000000',
    dark: '#ffffff',
    swatch: '#000000',
  },
  {
    id: 'slate',
    light: '#0f172a',
    dark: '#f1f5f9',
    swatch: '#0f172a',
  },
  {
    id: 'navy',
    light: '#0c2340',
    dark: '#dbeafe',
    swatch: '#0c2340',
  },
  {
    id: 'charcoal',
    light: '#1f2937',
    dark: '#f3f4f6',
    swatch: '#1f2937',
  },
  {
    id: 'zinc',
    light: '#18181b',
    dark: '#fafafa',
    swatch: '#18181b',
  },
  {
    id: 'indigo',
    light: '#312e81',
    dark: '#e0e7ff',
    swatch: '#312e81',
  },
  {
    id: 'blue',
    light: '#1e3a8a',
    dark: '#dbeafe',
    swatch: '#1e3a8a',
  },
  {
    id: 'teal',
    light: '#134e4a',
    dark: '#ccfbf1',
    swatch: '#134e4a',
  },
  {
    id: 'violet',
    light: '#4c1d95',
    dark: '#ede9fe',
    swatch: '#4c1d95',
  },
] as const

export type TextColorId = (typeof TEXT_COLOR_OPTIONS)[number]['id']

export const DEFAULT_TEXT_COLOR: TextColorId = 'default'

const TEXT_COLOR_IDS: TextColorId[] = TEXT_COLOR_OPTIONS.map((o) => o.id)

export function normalizeTextColor(id: string): TextColorId {
  return TEXT_COLOR_IDS.includes(id as TextColorId) ? (id as TextColorId) : DEFAULT_TEXT_COLOR
}

export function getTextColorOption(id: string) {
  return TEXT_COLOR_OPTIONS.find((o) => o.id === id) ?? TEXT_COLOR_OPTIONS[0]
}

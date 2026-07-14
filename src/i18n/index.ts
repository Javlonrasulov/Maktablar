import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import uzCyrl from './locales/uz-Cyrl.json'
import uzLatn from './locales/uz-Latn.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

export const languages = [
  { code: 'uz-Cyrl', label: "Ўзбек (Кирил)", short: 'Ўз' },
  { code: 'uz-Latn', label: "O'zbek (Lotin)", short: "O'z" },
  { code: 'ru', label: 'Русский', short: 'Ru' },
  { code: 'en', label: 'English', short: 'En' },
] as const

export type AppLanguage = (typeof languages)[number]['code']

const STORAGE_KEY = 'navbahor-lang'

const saved = (localStorage.getItem(STORAGE_KEY) as AppLanguage | null) ?? 'uz-Cyrl'

void i18n.use(initReactI18next).init({
  resources: {
    'uz-Cyrl': { translation: uzCyrl },
    'uz-Latn': { translation: uzLatn },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: saved,
  fallbackLng: 'uz-Cyrl',
  interpolation: { escapeValue: false },
})

export function setAppLanguage(code: AppLanguage) {
  localStorage.setItem(STORAGE_KEY, code)
  void i18n.changeLanguage(code)
  document.documentElement.lang = code
}

document.documentElement.lang = saved

export default i18n

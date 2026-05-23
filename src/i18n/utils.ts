import en from './en.json';
import es from './es.json';

export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export const defaultLang = 'en' as const;
export type Lang = keyof typeof languages;

const dictionaries = { en, es } as const;
export type Dictionary = typeof en;

/**
 * Extract language code from a URL pathname.
 * Returns 'en' for default routes (no prefix), 'es' for /es/* routes.
 */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang in languages) return maybeLang as Lang;
  return defaultLang;
}

/**
 * Build a translator bound to a specific language.
 * Supports nested keys via dot notation: t('nav.services')
 */
export function useTranslations(lang: Lang) {
  const dict = dictionaries[lang];
  return function t(key: string): string {
    const parts = key.split('.');
    let value: unknown = dict;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation: ${key} (${lang})`);
        }
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };
}

/**
 * Translate an internal path to the target language.
 * '/services' + 'es' => '/es/services'
 * '/es/services' + 'en' => '/services'
 */
export function localizePath(path: string, targetLang: Lang): string {
  const cleanPath = path.replace(/^\/(en|es)(?=\/|$)/, '') || '/';
  if (targetLang === defaultLang) return cleanPath;
  return `/${targetLang}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Returns the opposite language for the language switcher.
 */
export function getAlternateLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

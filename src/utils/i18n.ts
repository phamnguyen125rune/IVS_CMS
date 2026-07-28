import vi from '@/dictionaries/vi.json';
import en from '@/dictionaries/en.json';
import ja from '@/dictionaries/ja.json';

const dictionaries = {
  vi,
  en,
  ja,
};

export type Locale = 'vi' | 'en' | 'ja';
export type Dictionary = typeof vi;

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale as Locale] || dictionaries.vi;
}

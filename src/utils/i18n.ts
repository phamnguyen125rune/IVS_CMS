import vn from '@/dictionaries/vn.json';
import en from '@/dictionaries/en.json';
import jp from '@/dictionaries/jp.json';

const dictionaries = {
  vn,
  en,
  jp,
};

export type Locale = 'vn' | 'en' | 'jp';
export type Dictionary = typeof vn;

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale as Locale] || dictionaries.vn;
}

import type { Metadata } from 'next';

// Supported locales — must match SUPPORTED_LOCALES in src/proxy.ts
export const supportedLocales = ['vi', 'en', 'ja'] as const;
export type Locale = (typeof supportedLocales)[number];

export const metadata: Metadata = {
  title: 'CMS',
};

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}

export default async function LanguageLayout({ children, params }: LanguageLayoutProps) {
  const { language } = await params;
  const currentLocale = supportedLocales.includes(language as Locale) ? (language as Locale) : 'vi';

  return (
    // `lang` attribute is required for screen readers and search engine language detection
    <div lang={currentLocale}>{children}</div>
  );
}

// TODO: Enable when switching to static rendering (SSG).
// Currently unused — all pages use dynamic rendering.
// export async function generateStaticParams() {
//   return supportedLocales.map((language) => ({ language }));
// }

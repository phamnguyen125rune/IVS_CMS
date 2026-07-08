import type { Metadata } from 'next';

// Supported locales — must match SUPPORTED_LOCALES in src/middleware.ts
export const supportedLocales = ['vi', 'en'] as const;
export type Locale = (typeof supportedLocales)[number];

export const metadata: Metadata = {
  title: 'CMS',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const currentLocale = supportedLocales.includes(locale as Locale) ? (locale as Locale) : 'vi';

  return (
    // `lang` attribute is required for screen readers and search engine language detection
    <div lang={currentLocale}>
      {children}
    </div>
  );
}

// TODO: Enable when switching to static rendering (SSG).
// Currently unused — all pages use dynamic rendering.
// export async function generateStaticParams() {
//   return supportedLocales.map((locale) => ({ locale }));
// }

// Root layout — minimal wrapper required by Next.js App Router.
//
// NOTE: `lang` attribute is intentionally left as "vi" here as a fallback.
// The actual locale is set in src/app/[language]/layout.tsx via the URL param.
// This root layout only renders when a request bypasses the [language] segment
// (e.g., 404 page, before middleware redirect).

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'CMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

import { NextResponse, type NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['vi', 'en', 'ja'] as const;
const DEFAULT_LOCALE = 'vi';
type Locale = (typeof SUPPORTED_LOCALES)[number];

const PUBLIC_FILE_REGEX = /\.(.*)$/;

/**
 * Xử lý định tuyến đa ngôn ngữ và kiểm soát truy cập (Auth Guard) cho các yêu cầu đến hệ thống.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép đi qua không cần xử lý đối với tài nguyên tĩnh hoặc API nội bộ
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Tự động chèn mã ngôn ngữ vào URL nếu phát hiện thiếu tiền tố ngôn ngữ (locale prefix)
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const acceptLanguage = request.headers.get('accept-language') ?? '';
    const preferredLocale = detectLocale(acceptLanguage);
    const redirectUrl = new URL(`/${preferredLocale}${pathname}`, request.url);

    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

/**
 * Phân tích header 'Accept-Language' để trích xuất ngôn ngữ ưu tiên của trình duyệt người dùng.
 */
function detectLocale(acceptLanguage: string): Locale {
  const langs = acceptLanguage
    .split(',')
    .map((part) => part.trim().split(';')[0].trim().substring(0, 2).toLowerCase());

  for (const lang of langs) {
    if (SUPPORTED_LOCALES.includes(lang as Locale)) {
      return lang as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse, type NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['vi', 'en', 'ja'] as const;
const DEFAULT_LOCALE = 'vi';
type Locale = (typeof SUPPORTED_LOCALES)[number];

const PROTECTED_PATHS = ['/users', '/profile', 'contact'];
const PUBLIC_FILE_REGEX = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PROXY API SANG JAVA: Đính kèm HttpOnly Cookie vào Header Authorization
  if (pathname.startsWith('/api/v1')) {
    const token = request.cookies.get('session_token')?.value;
    const headers = new Headers(request.headers);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const backendUrl =
      process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';
    return NextResponse.rewrite(new URL(`${backendUrl}${pathname}${request.nextUrl.search}`), {
      request: { headers },
    });
  }

  // 2. Bỏ qua không cần kiểm tra nếu là API nội bộ khác hoặc tài nguyên tĩnh
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Chuyển hướng URL nếu phát hiện thiếu ngôn ngữ
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

  const locale = pathname.split('/')[1] as Locale;
  const token = request.cookies.get('session_token')?.value;
  const pathWithoutLocale = `/${pathname.split('/').slice(2).join('/')}`;
  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  // Yêu cầu đăng nhập
  if (isProtected && !token) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Chuyển thẳng về trang cấu hình nếu đã login
  if (pathWithoutLocale.startsWith('/login') && token) {
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
  }

  return NextResponse.next();
}

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
  // LƯU Ý: Xóa 'api' khỏi regex bỏ qua để Middleware có thể bắt và proxy được request /api/v1
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

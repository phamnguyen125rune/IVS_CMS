import { NextResponse, type NextRequest } from 'next/server';

// ============================================================
// Proxy (Next.js 16) — Runs before every request
//
// NOTE: Previously called "middleware" — renamed to "proxy" in Next.js 16.
//       Function export name must also be "proxy" (not "middleware").
//
// Two responsibilities:
//   1. Locale  — detect language, redirect to URL with locale prefix
//                e.g. /users → /vi/users
//   2. Auth    — protect routes that require login
// ============================================================

// Các ngôn ngữ được hỗ trợ — phải khớp với supportedLocales trong [locale]/layout.tsx
const SUPPORTED_LOCALES = ['vi', 'en'] as const;
const DEFAULT_LOCALE = 'vi';
type Locale = (typeof SUPPORTED_LOCALES)[number];

// Các path yêu cầu đăng nhập (sau khi có locale prefix)
// VD: /vi/users, /en/profile
const PROTECTED_PATHS = ['/users', '/profile'];

// Các path không cần thêm locale prefix (API routes, static files)
const PUBLIC_FILE_REGEX = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Bỏ qua: file tĩnh và API routes ---
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // --- BƯỚC 1: Xử lý Locale ---

  // Kiểm tra URL đã có locale prefix chưa (vd: /vi/..., /en/...)
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Detect ngôn ngữ ưu tiên từ header Accept-Language của browser
    const acceptLanguage = request.headers.get('accept-language') ?? '';
    const preferredLocale = detectLocale(acceptLanguage);

    // Redirect về URL có locale prefix
    // VD: /users → /vi/users
    const redirectUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
    redirectUrl.search = request.nextUrl.search; // giữ nguyên query string
    return NextResponse.redirect(redirectUrl);
  }

  // Lấy locale từ URL để dùng ở bước kiểm tra auth
  const locale = pathname.split('/')[1] as Locale;

  // --- BƯỚC 2: Xử lý Auth ---
  const token = request.cookies.get('session_token')?.value;

  // Kiểm tra path hiện tại (bỏ tiền tố locale) có cần bảo vệ không
  const pathWithoutLocale = `/${pathname.split('/').slice(2).join('/')}`;
  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  if (isProtected && !token) {
    // Chưa đăng nhập → redirect về trang login cùng locale
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Đã đăng nhập mà vào trang login → redirect về trang chính
  if (pathWithoutLocale.startsWith('/login') && token) {
    return NextResponse.redirect(new URL(`/${locale}/users`, request.url));
  }

  return NextResponse.next();
}

// Hàm phát hiện ngôn ngữ từ Accept-Language header
// VD: "en-US,en;q=0.9,vi;q=0.8" → 'en'
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
  // Apply proxy to all paths except API routes and static assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

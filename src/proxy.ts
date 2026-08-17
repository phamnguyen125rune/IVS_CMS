import { NextResponse, type NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['vi', 'en', 'ja'] as const;
const DEFAULT_LOCALE = 'vi';
type Locale = (typeof SUPPORTED_LOCALES)[number];

const PROTECTED_PATHS = ['/users', '/profile', '/contact'];
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

  const locale = pathname.split('/')[1] as Locale;

  // Kiểm tra trạng thái đăng nhập bằng cách trích xuất token lưu trong Cookie 'session_token'
  const token = request.cookies.get('session_token')?.value;
  const pathWithoutLocale = `/${pathname.split('/').slice(2).join('/')}`;
  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  // Yêu cầu đăng nhập đối với các truy cập chưa xác thực vào vùng giới hạn (PROTECTED_PATHS)
  if (isProtected && !token) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Chuyển thẳng về trang cá nhân nếu người dùng đã có phiên đăng nhập hợp lệ nhưng cố tình quay lại trang /login
  if (pathWithoutLocale.startsWith('/login') && token) {
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
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

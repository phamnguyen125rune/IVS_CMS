import { NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { cookies } from 'next/headers';
import { ApiError } from '@/utils/api-client';

const DEFAULT_STAFF_PASSWORD = '123456';

export async function POST(request: Request) {
  let loginId = '';
  let password = '';
  try {
    const body = await request.json();
    loginId = body.loginId;
    password = body.password;
    if (!loginId || !password) {
      return NextResponse.json(
        { message: 'Tên đăng nhập và mật khẩu không được để trống' },
        { status: 400 }
      );
    }

    const authData = await authService.login(loginId, password);

    const cookieStore = await cookies();
    cookieStore.set('session_token', authData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8640000,
    });

    const mustChangePassword = password === DEFAULT_STAFF_PASSWORD;
    if (mustChangePassword) {
      cookieStore.set('must_change_password', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 8640000,
      });
    } else {
      cookieStore.delete('must_change_password');
    }

    return NextResponse.json({ user: authData.user, mustChangePassword });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Có lỗi kết nối đến máy chủ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { cookies } from 'next/headers';
import { ApiError } from '@/utils/api-client';

export async function POST(request: Request) {
  try {
    const { loginId, password } = await request.json();
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

    return NextResponse.json({ user: authData.user });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Có lỗi kết nối đến máy chủ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

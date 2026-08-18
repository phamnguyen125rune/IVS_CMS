import { NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/utils/api-client';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    await authService.verifyRegisterOtp(email, otp);
    return NextResponse.json({ message: 'Đăng ký tài khoản thành công' });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Có lỗi kết nối đến máy chủ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/utils/api-client';

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    await authService.resetForgotPassword(payload);
    return NextResponse.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Có lỗi kết nối đến máy chủ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

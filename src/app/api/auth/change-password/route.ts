import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userService } from '@/services/user.service';
import { ApiError } from '@/utils/api-client';

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    await userService.changePassword(payload);

    const cookieStore = await cookies();
    cookieStore.delete('must_change_password');

    return NextResponse.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Không thể đổi mật khẩu';
    return NextResponse.json({ message }, { status: 500 });
  }
}

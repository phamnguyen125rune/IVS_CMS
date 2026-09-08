import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { ApiError } from '@/utils/api-client';

export async function GET() {
  try {
    return NextResponse.json(await userService.getRoles());
  } catch (err) {
    if (err instanceof ApiError) {
      const response = NextResponse.json({ message: err.message }, { status: err.status });
      if (err.status === 401) {
        response.cookies.delete('session_token');
        response.cookies.delete('must_change_password');
      }
      return response;
    }
    const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
    return NextResponse.json({ message }, { status: 500 });
  }
}

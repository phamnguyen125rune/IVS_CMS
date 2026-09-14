import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session_token');
    cookieStore.delete('must_change_password');
    return NextResponse.json({ message: 'Đăng xuất thành công' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
    return NextResponse.json({ message }, { status: 500 });
  }
}

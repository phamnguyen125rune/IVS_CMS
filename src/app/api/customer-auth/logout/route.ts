import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('customer_profile');
    return NextResponse.json({ message: 'Đã đăng xuất Google khách hàng' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Không đăng xuất được khách hàng';
    return NextResponse.json({ message }, { status: 500 });
  }
}

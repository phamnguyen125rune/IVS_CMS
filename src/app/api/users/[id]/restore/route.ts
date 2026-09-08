import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { ApiError } from '@/utils/api-client';

export async function PUT(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await userService.restoreUser(Number(id));
    return NextResponse.json({ message: 'Khôi phục tài khoản thành công' });
  } catch (err) {
    return handleRouteError(err);
  }
}

function handleRouteError(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
  return NextResponse.json({ message }, { status: 500 });
}

import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { ApiError } from '@/utils/api-client';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    return NextResponse.json(await userService.updateUser(Number(id), payload));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await userService.deleteUser(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}

function handleRouteError(err: unknown) {
  if (err instanceof ApiError) {
    const response = NextResponse.json({ message: err.message }, { status: err.status });
    if (err.status === 401 || err.status === 403) {
      response.cookies.delete('session_token');
      response.cookies.delete('must_change_password');
    }
    return response;
  }
  const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
  return NextResponse.json({ message }, { status: 500 });
}

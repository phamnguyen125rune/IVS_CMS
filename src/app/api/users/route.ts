import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { ApiError } from '@/utils/api-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const size = Number(searchParams.get('size') || '10');

    return NextResponse.json(await userService.getUsers(page, size));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json(await userService.createUser(payload), { status: 201 });
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

import { NextResponse } from 'next/server';
import { ApiError } from '@/utils/api-client';

export function parseUserId(value: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError('ID người dùng không hợp lệ', 400);
  }
  return id;
}

export function handleUserRouteError(error: unknown) {
  if (error instanceof ApiError) {
    const response = NextResponse.json({ message: error.message }, { status: error.status });
    if (error.status === 401) {
      response.cookies.delete('session_token');
      response.cookies.delete('must_change_password');
    }
    return response;
  }

  const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
  return NextResponse.json({ message }, { status: 500 });
}

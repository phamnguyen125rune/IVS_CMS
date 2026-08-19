import { NextResponse } from 'next/server';
import { ApiError, apiFetch } from '@/utils/api-client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await apiFetch(`/api/v1/contacts/${id}`);
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const response = NextResponse.json({ message: err.message }, { status: err.status });
      if (err.status === 401) {
        response.cookies.delete('session_token');
      }
      return response;
    }
    const message = err instanceof Error ? err.message : 'Không thể tải chi tiết liên hệ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await apiFetch(`/api/v1/contacts/${id}`, {
      method: 'DELETE',
    });
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const response = NextResponse.json({ message: err.message }, { status: err.status });
      if (err.status === 401) {
        response.cookies.delete('session_token');
      }
      return response;
    }
    const message = err instanceof Error ? err.message : 'Không thể xóa liên hệ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

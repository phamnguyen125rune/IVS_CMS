import { NextResponse } from 'next/server';
import { ApiError, apiFetch } from '@/utils/api-client';

export async function GET(request: Request) {
  try {
    const { search } = new URL(request.url);
    const data = await apiFetch(`/api/v1/contacts${search}`);
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const response = NextResponse.json({ message: err.message }, { status: err.status });
      if (err.status === 401) {
        response.cookies.delete('session_token');
      }
      return response;
    }
    const message = err instanceof Error ? err.message : 'Không thể tải danh sách liên hệ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = await apiFetch('/api/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const response = NextResponse.json({ message: err.message }, { status: err.status });
      if (err.status === 401) {
        response.cookies.delete('session_token');
      }
      return response;
    }
    const message = err instanceof Error ? err.message : 'Không gửi được yêu cầu liên hệ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

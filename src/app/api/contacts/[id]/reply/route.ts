import { NextResponse } from 'next/server';
import { ApiError, apiFetch } from '@/utils/api-client';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const data = await apiFetch(`/api/v1/contacts/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(payload),
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
    const message = err instanceof Error ? err.message : 'Không gửi được phản hồi';
    return NextResponse.json({ message }, { status: 500 });
  }
}

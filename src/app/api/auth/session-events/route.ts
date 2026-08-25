import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();
  const token = searchParams.get('token') || cookieStore.get('session_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Bạn chưa đăng nhập' }, { status: 401 });
  }

  const backendUrl =
    process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/session-events`, {
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok || !response.body) {
      const data = await response.json().catch(() => ({}));
      const errorResponse = NextResponse.json(
        { message: data?.message || 'Phiên đăng nhập không hợp lệ' },
        { status: response.status || 401 }
      );
      errorResponse.cookies.delete('session_token');
      errorResponse.cookies.delete('must_change_password');
      return errorResponse;
    }

    return new Response(response.body, {
      headers: {
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream; charset=utf-8',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Không thể kết nối realtime đến backend' },
      { status: 503 }
    );
  }
}

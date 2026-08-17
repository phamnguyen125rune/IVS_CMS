// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loginId, password } = body;

    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';

    const backendRes = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || 'Đăng nhập thất bại' },
        { status: backendRes.status }
      );
    }

    // Bóc tách token
    const accessToken =
      data.access_token ||
      data.accessToken ||
      data.data?.access_token ||
      data.data?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Không tìm thấy Access Token từ server' },
        { status: 500 }
      );
    }

    // Set cookie session_token trên Next.js
    const cookieStore = await cookies();
    cookieStore.set('session_token', accessToken, {
      httpOnly: false, // Để trình duyệt đọc được nếu cần
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({
      statusCode: 200,
      message: 'Đăng nhập thành công',
      access_token: accessToken,
      user: data.user || data.data?.user,
    });
  } catch (error) {
    console.error('[AUTH LOGIN ROUTE ERROR]:', error);
    return NextResponse.json(
      { message: 'Không thể kết nối đến máy chủ Backend' },
      { status: 503 }
    );
  }
}
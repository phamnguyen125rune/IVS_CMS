import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/categories`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('[GET /api/categories]', error);

    return NextResponse.json(
      {
        message: 'Không thể kết nối đến backend',
      },
      {
        status: 503,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const token = request.cookies.get('session_token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('[POST /api/categories]', error);

    return NextResponse.json(
      {
        message: 'Không thể kết nối đến backend',
      },
      {
        status: 503,
      }
    );
  }
}

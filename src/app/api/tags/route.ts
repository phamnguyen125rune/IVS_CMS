import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

function getHeaders(request: NextRequest): HeadersInit {
  const token = request.cookies.get('session_token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * GET /api/tags
 *
 * FE:
 * /api/tags
 *
 * BE:
 * /api/v1/tags
 */
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/tags`, {
      method: 'GET',
      headers: getHeaders(request),
      cache: 'no-store',
    });

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('[GET /api/tags]', error);

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

/**
 * POST /api/tags
 *
 * FE:
 * /api/tags
 *
 * BE:
 * /api/v1/tags
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/tags`, {
      method: 'POST',
      headers: getHeaders(request),
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('[POST /api/tags]', error);

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

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

// =========================
// PUT - UPDATE TAG
// =========================
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const token = request.cookies.get('session_token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/tags/${id}`, {
      method: 'PUT',
      headers,
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

    if (typeof data === 'object' && data !== null) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    return new NextResponse(String(data), {
      status: response.status,
    });
  } catch (error) {
    console.error('[PUT /api/tags/:id]', error);

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

// =========================
// DELETE - DELETE TAG
// =========================
export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const token = request.cookies.get('session_token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/tags/${id}`, {
      method: 'DELETE',
      headers,
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

    if (typeof data === 'object' && data !== null) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    return new NextResponse(String(data), {
      status: response.status,
    });
  } catch (error) {
    console.error('[DELETE /api/tags/:id]', error);

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

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

function getAuthHeaders(request: NextRequest): HeadersInit {
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
 * PUT /api/categories/:id
 *
 * FE:
 * /api/categories/1
 *
 * BE:
 * /api/v1/categories/1
 */
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(request),
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
    console.error('[PUT /api/categories/:id]', error);

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
 * DELETE /api/categories/:id
 *
 * FE:
 * /api/categories/1
 *
 * BE:
 * /api/v1/categories/1
 */
export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const response = await fetch(`${BACKEND_URL}/api/v1/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(request),
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
    console.error('[DELETE /api/categories/:id]', error);

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

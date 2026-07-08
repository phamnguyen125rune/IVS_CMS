// PLACEHOLDER — POST /api/auth/logout
//
// Clears the session_token cookie, effectively logging the user out.
//
// Mapped from: docs/06-features.md → Phân hệ Admin → Xác thực (JWT)
//
// TODO: Implement — optionally call Java to invalidate token server-side

import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Clear session_token cookie
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}

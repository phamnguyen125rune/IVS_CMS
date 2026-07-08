// PLACEHOLDER — POST /api/auth/login
//
// Receives loginId + password from client, calls Java Spring Boot auth endpoint,
// sets session_token cookie on success.
//
// Mapped from: docs/06-features.md → Phân hệ Admin → Xác thực (JWT)
//
// TODO: Implement when Java auth API is ready

import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Forward credentials to Java, receive JWT, set cookie
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}

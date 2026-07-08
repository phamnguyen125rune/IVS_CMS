// PLACEHOLDER — GET /api/auth/profile
//
// Returns the currently authenticated user's profile by reading the session token
// and calling Java Spring Boot to validate and retrieve user data.
//
// Mapped from: docs/06-features.md → Phân hệ Admin → Quản lý Profile
//
// TODO: Implement when Java user API is ready

import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Read session_token cookie, call Java /api/users/me, return profile
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}

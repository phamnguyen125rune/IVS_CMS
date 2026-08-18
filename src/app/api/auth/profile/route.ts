import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { ApiError } from '@/utils/api-client';

export async function GET() {
  try {
    const profile = await userService.getMyProfile();
    return NextResponse.json(profile);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Không thể tải hồ sơ';
    return NextResponse.json({ message }, { status: 500 });
  }
}

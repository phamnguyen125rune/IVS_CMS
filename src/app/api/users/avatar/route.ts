import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { ApiError } from '@/utils/api-client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Vui lòng chọn ảnh đại diện' }, { status: 400 });
    }

    return NextResponse.json(await userService.uploadMyAvatar(file), { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

function handleRouteError(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
  return NextResponse.json({ message }, { status: 500 });
}

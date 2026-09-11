import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { handleUserRouteError } from '../_route-utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Vui lòng chọn ảnh đại diện' }, { status: 400 });
    }

    return NextResponse.json(await userService.uploadMyAvatar(file), { status: 201 });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

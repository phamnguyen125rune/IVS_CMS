import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { handleUserRouteError, parseUserId } from '../../_route-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Vui lòng chọn ảnh đại diện' }, { status: 400 });
    }

    const result = await userService.uploadUserAvatar(parseUserId(id), file);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

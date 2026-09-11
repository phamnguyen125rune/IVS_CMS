import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { UserStatus } from '@/types/user.type';
import { handleUserRouteError, parseUserId } from '../../_route-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { status } = (await request.json()) as { status: UserStatus };
    await userService.updateUserStatus(parseUserId(id), status);
    return NextResponse.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

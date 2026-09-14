import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { handleUserRouteError, parseUserId } from '../../_route-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await userService.resetUserPassword(parseUserId(id));
    return NextResponse.json({
      message: 'Đã đưa mật khẩu về mặc định 123456',
      defaultPassword: '123456',
    });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

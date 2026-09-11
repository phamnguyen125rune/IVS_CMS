import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { handleUserRouteError, parseUserId } from '../../_route-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await userService.restoreUser(parseUserId(id));
    return NextResponse.json({ message: 'Khôi phục tài khoản thành công' });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

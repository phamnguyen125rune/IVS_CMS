import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { handleUserRouteError, parseUserId } from '../../_route-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await userService.hardDeleteUser(parseUserId(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { UserUpdateRequest } from '@/types/user.type';
import { handleUserRouteError, parseUserId } from '../_route-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    return NextResponse.json(await userService.getUserById(parseUserId(id)));
  } catch (error) {
    return handleUserRouteError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as UserUpdateRequest;
    return NextResponse.json(await userService.updateUser(parseUserId(id), payload));
  } catch (error) {
    return handleUserRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await userService.softDeleteUser(parseUserId(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

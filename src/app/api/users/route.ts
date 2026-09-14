import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { UserCreateRequest } from '@/types/user.type';
import { handleUserRouteError } from './_route-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const size = Number(searchParams.get('size') || '10');

    return NextResponse.json(await userService.getUsers(page, size));
  } catch (error) {
    return handleUserRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as UserCreateRequest;
    return NextResponse.json(await userService.createUser(payload), { status: 201 });
  } catch (error) {
    return handleUserRouteError(error);
  }
}

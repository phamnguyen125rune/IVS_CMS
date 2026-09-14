import { NextResponse } from 'next/server';
import { userService } from '@/services/user.service';
import { handleUserRouteError } from '../_route-utils';

export async function GET() {
  try {
    return NextResponse.json(await userService.getDeletedUsers());
  } catch (error) {
    return handleUserRouteError(error);
  }
}

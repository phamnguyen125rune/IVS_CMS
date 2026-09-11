import { NextResponse } from 'next/server';
import { roleService } from '@/services/role.service';
import { ApiError } from '@/utils/api-client';

export async function GET() {
  try {
    return NextResponse.json(await roleService.getAllRoles());
  } catch (error) {
    if (error instanceof ApiError) {
      const response = NextResponse.json({ message: error.message }, { status: error.status });
      if (error.status === 401) {
        response.cookies.delete('session_token');
        response.cookies.delete('must_change_password');
      }
      return response;
    }

    const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
    return NextResponse.json({ message }, { status: 500 });
  }
}

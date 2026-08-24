import { NextResponse } from 'next/server';
import { cmsRecordService } from '@/services/cms-record.service';
import { ApiError } from '@/utils/api-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    return NextResponse.json(
      await cmsRecordService.findAll({
        moduleKey: searchParams.get('moduleKey') || undefined,
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || 'ALL',
        page: Number(searchParams.get('page') || '1'),
        size: Number(searchParams.get('size') || '20'),
      })
    );
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: Request) {
  try {
    return NextResponse.json(await cmsRecordService.create(await request.json()), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
  return NextResponse.json({ message }, { status: 500 });
}

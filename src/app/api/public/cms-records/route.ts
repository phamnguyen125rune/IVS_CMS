import { NextResponse } from 'next/server';
import { cmsRecordService } from '@/services/cms-record.service';
import { ApiError } from '@/utils/api-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleKey = searchParams.get('moduleKey') || 'posts';
    return NextResponse.json(
      await cmsRecordService.findPublished(
        moduleKey,
        Number(searchParams.get('page') || '1'),
        Number(searchParams.get('size') || '20')
      )
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
    return NextResponse.json({ message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { cmsRecordService } from '@/services/cms-record.service';
import { ApiError } from '@/utils/api-client';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    return NextResponse.json(await cmsRecordService.updateStatus(Number(id), status));
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
    return NextResponse.json({ message }, { status: 500 });
  }
}

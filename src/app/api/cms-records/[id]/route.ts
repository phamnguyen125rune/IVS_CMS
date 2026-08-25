import { NextResponse } from 'next/server';
import { cmsRecordService } from '@/services/cms-record.service';
import { ApiError } from '@/utils/api-client';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json(await cmsRecordService.update(Number(id), await request.json()));
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await cmsRecordService.delete(Number(id));
    return NextResponse.json({ message: 'Đã xóa dữ liệu' });
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

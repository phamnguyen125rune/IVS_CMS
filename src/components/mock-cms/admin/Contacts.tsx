'use client';

import AdminWorkspace from './AdminWorkspace';

export default function Contacts() {
  return (
    <AdminWorkspace
      moduleKey="forms"
      title="Quản lý Biểu mẫu"
      description="Theo dõi yêu cầu khách hàng, phân loại tình trạng xử lý và lưu lịch sử phản hồi."
      createLabel="Thêm yêu cầu"
      tone="emerald"
      primaryStatuses={['NEW', 'REPLIED', 'PROCESSING']}
      searchPlaceholder="Tìm theo tên khách, email, loại yêu cầu..."
    />
  );
}

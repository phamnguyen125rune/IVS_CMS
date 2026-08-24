'use client';

export type CmsRecord = {
  id: number;
  moduleKey?: string;
  title: string;
  subtitle: string;
  type: string;
  status: string;
  owner: string;
  updatedAt: string;
  description: string;
  imageUrl?: string;
};

export type CmsModuleKey =
  | 'posts'
  | 'categories'
  | 'media'
  | 'forms'
  | 'roles'
  | 'logs'
  | 'settings'
  | 'profile';

const STORAGE_PREFIX = 'ivs_cms_demo_';

const seed: Record<CmsModuleKey, CmsRecord[]> = {
  posts: [
    {
      id: 1,
      title: 'Chuyển đổi số cho doanh nghiệp sản xuất',
      subtitle: 'tin-tuc',
      type: 'Tin tức',
      status: 'PUBLISHED',
      owner: 'Nguyễn Văn Admin',
      updatedAt: '2026-08-18',
      description: 'Bài viết phân tích cách CMS hỗ trợ quy trình chuyển đổi số.',
      imageUrl:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop',
    },
    {
      id: 2,
      title: '5 nguyên tắc xây dựng hệ thống nội dung đa ngôn ngữ',
      subtitle: 'kien-thuc',
      type: 'Kiến thức',
      status: 'PENDING',
      owner: 'Trần Thị Hương',
      updatedAt: '2026-08-19',
      description: 'Nội dung đang chờ kiểm duyệt trước khi xuất bản.',
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Checklist vận hành CMS cho đội marketing',
      subtitle: 'huong-dan',
      type: 'Hướng dẫn',
      status: 'DRAFT',
      owner: 'Lê Văn Phúc',
      updatedAt: '2026-08-20',
      description: 'Bản nháp checklist quy trình biên tập và xuất bản.',
      imageUrl:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop',
    },
  ],
  categories: [
    {
      id: 1,
      title: 'Tin tức công ty',
      subtitle: 'tin-tuc',
      type: 'Danh mục',
      status: 'ACTIVE',
      owner: 'Admin',
      updatedAt: '2026-08-15',
      description: 'Các thông báo, sự kiện và hoạt động nội bộ.',
    },
    {
      id: 2,
      title: 'Dịch vụ',
      subtitle: 'dich-vu',
      type: 'Danh mục',
      status: 'ACTIVE',
      owner: 'Admin',
      updatedAt: '2026-08-16',
      description: 'Nhóm bài giới thiệu dịch vụ và năng lực triển khai.',
    },
  ],
  media: [
    {
      id: 1,
      title: 'office-hero.jpg',
      subtitle: '1.2 MB',
      type: 'Image',
      status: 'READY',
      owner: 'Media team',
      updatedAt: '2026-08-17',
      description: 'Ảnh hero trang giới thiệu doanh nghiệp.',
      imageUrl:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'project-dashboard.png',
      subtitle: '860 KB',
      type: 'Image',
      status: 'READY',
      owner: 'Design team',
      updatedAt: '2026-08-18',
      description: 'Ảnh minh họa dashboard dự án.',
      imageUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop',
    },
  ],
  forms: [
    {
      id: 1,
      title: 'Nguyễn Minh Anh',
      subtitle: 'anh.nguyen@example.com',
      type: 'Liên hệ tư vấn',
      status: 'NEW',
      owner: 'Sales',
      updatedAt: '2026-08-20',
      description: 'Khách hàng cần tư vấn triển khai website đa ngôn ngữ.',
    },
    {
      id: 2,
      title: 'Công ty Sakura',
      subtitle: 'contact@sakura.example',
      type: 'Báo giá',
      status: 'REPLIED',
      owner: 'CSKH',
      updatedAt: '2026-08-19',
      description: 'Đã phản hồi bảng giá gói CMS doanh nghiệp.',
    },
  ],
  roles: [
    {
      id: 1,
      title: 'Admin',
      subtitle: 'Toàn quyền hệ thống',
      type: 'Role',
      status: 'ACTIVE',
      owner: 'System',
      updatedAt: '2026-08-18',
      description: 'Quản lý người dùng, bài viết, danh mục, cài đặt và nhật ký.',
    },
    {
      id: 2,
      title: 'Editor',
      subtitle: 'Biên tập nội dung',
      type: 'Role',
      status: 'ACTIVE',
      owner: 'System',
      updatedAt: '2026-08-18',
      description: 'Tạo, sửa và gửi bài viết vào quy trình kiểm duyệt.',
    },
  ],
  logs: [
    {
      id: 1,
      title: 'Tạo tài khoản nhân sự',
      subtitle: 'admin@cms.local',
      type: 'Nhân sự',
      status: 'SUCCESS',
      owner: 'Admin System',
      updatedAt: '2026-08-20',
      description: 'Tạo tài khoản nhân sự mới với mật khẩu mặc định.',
    },
    {
      id: 2,
      title: 'Xuất bản bài viết',
      subtitle: 'Chuyển đổi số cho doanh nghiệp sản xuất',
      type: 'Bài viết',
      status: 'SUCCESS',
      owner: 'Nguyễn Văn Admin',
      updatedAt: '2026-08-20',
      description: 'Bài viết được duyệt và chuyển sang trạng thái xuất bản.',
    },
  ],
  settings: [
    {
      id: 1,
      title: 'Tên website',
      subtitle: 'CMS',
      type: 'General',
      status: 'ACTIVE',
      owner: 'System',
      updatedAt: '2026-08-20',
      description: 'Tên hiển thị ở header, footer và metadata.',
    },
    {
      id: 2,
      title: 'Email liên hệ',
      subtitle: 'info@cms.vn',
      type: 'Contact',
      status: 'ACTIVE',
      owner: 'System',
      updatedAt: '2026-08-20',
      description: 'Email nhận thông tin liên hệ từ khách hàng.',
    },
  ],
  profile: [
    {
      id: 1,
      title: 'Nguyễn Văn Admin',
      subtitle: 'admin@cms.local',
      type: 'SUPER_ADMIN',
      status: 'ACTIVE',
      owner: 'System',
      updatedAt: '2026-08-20',
      description: 'Hồ sơ quản trị viên hệ thống.',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop',
    },
  ],
};

export function getCmsRecords(moduleKey: CmsModuleKey) {
  if (typeof window === 'undefined') {
    return seed[moduleKey];
  }

  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${moduleKey}`);
  if (!raw) {
    saveCmsRecords(moduleKey, seed[moduleKey]);
    return seed[moduleKey];
  }

  try {
    return JSON.parse(raw) as CmsRecord[];
  } catch {
    saveCmsRecords(moduleKey, seed[moduleKey]);
    return seed[moduleKey];
  }
}

export function saveCmsRecords(moduleKey: CmsModuleKey, records: CmsRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(`${STORAGE_PREFIX}${moduleKey}`, JSON.stringify(records));
}

export function upsertCmsRecord(moduleKey: CmsModuleKey, record: Partial<CmsRecord>) {
  const records = getCmsRecords(moduleKey);
  const now = new Date().toISOString().slice(0, 10);
  const nextRecord: CmsRecord = {
    id: record.id || nextId(records),
    title: record.title || 'Chưa đặt tên',
    subtitle: record.subtitle || '',
    type: record.type || 'Khác',
    status: record.status || 'ACTIVE',
    owner: record.owner || 'Admin',
    updatedAt: now,
    description: record.description || '',
    imageUrl: record.imageUrl || '',
  };

  const nextRecords = records.some((item) => item.id === nextRecord.id)
    ? records.map((item) => (item.id === nextRecord.id ? nextRecord : item))
    : [nextRecord, ...records];

  saveCmsRecords(moduleKey, nextRecords);
  return nextRecords;
}

export function deleteCmsRecord(moduleKey: CmsModuleKey, id: number) {
  const nextRecords = getCmsRecords(moduleKey).filter((item) => item.id !== id);
  saveCmsRecords(moduleKey, nextRecords);
  return nextRecords;
}

export function updateCmsStatus(moduleKey: CmsModuleKey, id: number, status: string) {
  const nextRecords = getCmsRecords(moduleKey).map((item) =>
    item.id === id ? { ...item, status, updatedAt: new Date().toISOString().slice(0, 10) } : item
  );
  saveCmsRecords(moduleKey, nextRecords);
  return nextRecords;
}

export function resetCmsDemoData() {
  if (typeof window === 'undefined') {
    return;
  }

  (Object.keys(seed) as CmsModuleKey[]).forEach((moduleKey) => {
    saveCmsRecords(moduleKey, seed[moduleKey]);
  });
}

export function getAllCmsSeed() {
  return seed;
}

function nextId(records: CmsRecord[]) {
  return records.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

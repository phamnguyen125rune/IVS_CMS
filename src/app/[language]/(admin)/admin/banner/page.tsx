import BannerManagement from '@/components/mock-cms/admin/banner/BannerManagement';

export const metadata = {
  title: 'Quản lý Banner | CMS Admin',
  description: 'Quản lý và tùy chỉnh Banner trang chính',
};

export default function BannerPage() {
  return <BannerManagement />;
}

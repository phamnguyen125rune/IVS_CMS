export interface PostSectionConfig {
  key: 'news' | 'recruitment';
  basePath: string;
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  featuredBadge: string;
  detailLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  backLabel: string;
  relatedTitle: string;
  showCategoryFilter: boolean;
  categoryId?: number;
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Recruitment is a Post category, not a separate content domain.
 * Keep its id in one place so news/recruitment pages never spread a magic
 * category number across components.
 */
export const RECRUITMENT_CATEGORY_ID = positiveInteger(
  process.env.RECRUITMENT_CATEGORY_ID || process.env.NEXT_PUBLIC_RECRUITMENT_CATEGORY_ID,
  1
);

export const NEWS_POST_SECTION: PostSectionConfig = {
  key: 'news',
  basePath: '/bai-viet',
  eyebrow: 'Tin tức',
  title: 'Kiến thức & Insights',
  description: 'Cập nhật bài viết, kiến thức chuyên sâu và thông tin mới nhất từ đội ngũ CMS.',
  searchPlaceholder: 'Tìm kiếm bài viết...',
  featuredBadge: 'Mới nhất',
  detailLabel: 'Đọc bài viết',
  emptyTitle: 'Không tìm thấy bài viết phù hợp',
  emptyDescription: 'Thử thay đổi từ khóa tìm kiếm hoặc danh mục khác.',
  backLabel: 'Quay lại danh sách bài viết',
  relatedTitle: 'Bài viết liên quan',
  showCategoryFilter: true,
};

export const RECRUITMENT_POST_SECTION: PostSectionConfig = {
  key: 'recruitment',
  basePath: '/tuyen-dung',
  eyebrow: 'Tuyển dụng',
  title: 'Cơ hội nghề nghiệp',
  description:
    'Khám phá các vị trí đang tuyển và đồng hành cùng chúng tôi trong những dự án tạo ra giá trị thực.',
  searchPlaceholder: 'Tìm kiếm vị trí công việc...',
  featuredBadge: 'Vị trí mới',
  detailLabel: 'Xem chi tiết',
  emptyTitle: 'Chưa có vị trí tuyển dụng phù hợp',
  emptyDescription: 'Thử thay đổi từ khóa hoặc quay lại sau để xem các cơ hội mới.',
  backLabel: 'Quay lại danh sách tuyển dụng',
  relatedTitle: 'Vị trí đang tuyển khác',
  showCategoryFilter: false,
  categoryId: RECRUITMENT_CATEGORY_ID,
};

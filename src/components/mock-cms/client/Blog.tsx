import PostArchive from '@/components/mock-cms/client/posts/PostArchive';
import { NEWS_POST_SECTION } from '@/config/post-sections';
import type { PostCategory } from '@/types/category.type';
import type { PaginatedResponse, ResPostListDTO } from '@/types/post.type';

interface Props {
  data: PaginatedResponse<ResPostListDTO>;
  categories: PostCategory[];
  keyword: string;
  categoryId?: number;
  page: number;
}

export default function Blog(props: Props) {
  return <PostArchive {...props} section={NEWS_POST_SECTION} />;
}

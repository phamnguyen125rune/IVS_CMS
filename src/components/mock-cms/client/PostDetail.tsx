import PostDetailView from '@/components/mock-cms/client/posts/PostDetailView';
import { NEWS_POST_SECTION } from '@/config/post-sections';
import type { ResPostDTO, ResPostListDTO } from '@/types/post.type';

interface PostDetailProps {
  post: ResPostDTO;
  recentPosts?: ResPostListDTO[];
}

export default function PostDetail({ post, recentPosts = [] }: PostDetailProps) {
  return <PostDetailView post={post} recentPosts={recentPosts} section={NEWS_POST_SECTION} />;
}

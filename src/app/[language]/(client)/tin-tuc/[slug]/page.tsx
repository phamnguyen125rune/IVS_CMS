import { permanentRedirect } from 'next/navigation';
import { postPath } from '@/utils/post-seo';

export default async function LegacyNewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(postPath(slug));
}

import { Metadata } from 'next';
import PostDetail from '@/components/mock-cms/client/PostDetail';

type Props = {
  params: Promise<{ slug: string; language: string }> | { slug: string; language: string };
};

// Gọi API lấy dữ liệu thật trực tiếp từ Server
async function getPostBySlug(slug: string) {
  try {
    const backendUrl = process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

    const listRes = await fetch(`${backendUrl}/api/v1/posts?keyword=${slug}&status=PUBLISHED&page=1&size=10`, {
      cache: 'no-store'
    });
    if (!listRes.ok) return null;
    const listData = await listRes.json();

    const found = listData.result?.find((p: any) => p.slug === slug);
    if (!found) return null;

    const detailRes = await fetch(`${backendUrl}/api/v1/posts/${found.id}`, { cache: 'no-store' });
    if (!detailRes.ok) return null;

    return await detailRes.json();
  } catch (err) {
    console.error('Lỗi SSR fetch data:', err);
    return null;
  }
}

// Hàm sinh thẻ SEO & Open Graph chuẩn mạng xã hội
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await Promise.resolve(props.params);
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: 'Không tìm thấy bài viết | CMS' };
  }

  const metaTitle = post.metadata?.title || post.title;
  const metaDesc = post.metadata?.description || post.summary || '';
  const ogTitle = post.metadata?.openGraph?.title || metaTitle;
  const ogDescription = post.metadata?.openGraph?.description || metaDesc;

  // Lấy ảnh Cover thật từ Database
  let ogImage = post.metadata?.openGraph?.imageUrl || (post.mediaList && post.mediaList.length > 0 ? post.mediaList[0].filePath : '');

  // -------------------------------------------------------------
  // LOGIC ẢNH MẶC ĐỊNH (DEFAULT IMAGE)
  // -------------------------------------------------------------
  const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!ogImage) {
    // Nếu bài viết không có ảnh -> Gán ảnh mặc định
    ogImage = DEFAULT_IMAGE_URL;
  } else if (ogImage.startsWith('/')) {
    // Nếu có ảnh từ Backend của bạn (dạng /api/v1/media...) -> Ghép thêm tên miền
    ogImage = `${siteUrl}${ogImage}`;
  }
  // Nếu ogImage đã là dạng "http..." (link ngoài) thì giữ nguyên

  const postUrl = `${siteUrl}/${params.language}/bai-viet/${post.slug}`;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: { canonical: post.metadata?.canonicalUrl || postUrl },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: postUrl,
      siteName: 'Apex CMS',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : [],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    }
  };
}

export default async function PostPage(props: Props) {
  const params = await Promise.resolve(props.params);
  const post = await getPostBySlug(params.slug);

  return <PostDetail initialPost={post} slug={params.slug} />;
}
import { permanentRedirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function LegacyNewsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (query.page) params.set('page', query.page);

  permanentRedirect(`/vi/bai-viet${params.size ? `?${params.toString()}` : ''}`);
}

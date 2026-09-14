import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ language: string }>;
}

export default async function AdminIndexPage({ params }: PageProps) {
  const { language } = await params;

  redirect(`/${language}/admin/tong-quan`);
}
